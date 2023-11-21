import express, {Request, Response} from 'express';
import db from '../db';
const { Op } = require("sequelize");

const router = express.Router();

router.get('/', async (req, res) => {
    let x = await db.buildings.findAll();
    res.json(x);
});


interface Course {
    name: string;
    sections: number[]
}

function getCleanCourseNum(courseNum: string) {
    var regex = /^(.*?)-?(?:[A-Z]\d{0,2})$/g;
    let matches = courseNum.match(regex);
    if (matches == null) {
        return courseNum;
    }
    return matches[0];
}

function isSpecialSection(courseNum: string) {
    var regex = /[A-GI-Z]\d{0,2}$/;
    return regex.test(courseNum);
}

function pruneSpecialCourses(schedules: any[][], courseGroups) {
    let validSchedules: any[] = [];

    for (let schedule of schedules) {
        let flattenedSchedule: any = {};
        for (let course of schedule) {
            let cleanCourseNum = getCleanCourseNum(course.courseNum);
            if (courseGroups[cleanCourseNum] != null && courseGroups[cleanCourseNum] > 0) {
                if (isSpecialSection(course.courseNum)) {
                    flattenedSchedule[course.courseNum] = true;
                } else {
                    flattenedSchedule[course.courseNum] = Object.keys(courseGroups[cleanCourseNum]);
                }
            } else {
                flattenedSchedule[course.courseNum] = false;
            }
        }
        let scheduleMeetsRequirements = true;
        for (let flatCourseNum of Object.keys(flattenedSchedule)) {
            let courseReqs = flattenedSchedule[flatCourseNum];
            if (Array.isArray(courseReqs)) {
                let courseMeetsRequirements = false;
                for (let courseReq of courseReqs) {
                    if (flattenedSchedule[courseReq]) {
                        courseMeetsRequirements = true;
                        break;
                    }
                }
                scheduleMeetsRequirements = courseMeetsRequirements && scheduleMeetsRequirements;
                if (!scheduleMeetsRequirements) {
                    continue;
                }
            }
        }
        if (scheduleMeetsRequirements) {
            validSchedules.push(schedule);
        }
    }
    return validSchedules;
}

function overlaps(options, candidate) {
    if (options.length == 0) {
        return false;
    }

    for (let option of options) {
        if (option.times.length == 0 || candidate.times.length == 0) {
            return false;
        }

        for (let candidateTime of candidate.times) {
            for (let optionTime of option.times) {
                if (candidateTime.day == optionTime.day) {
                    if  (
                            (optionTime.start <= candidateTime.start && candidateTime.start < optionTime.end ||
                            optionTime.start < candidateTime.end && candidateTime.end <= optionTime.end ||
                            candidateTime.start <= optionTime.start && candidateTime.end >= optionTime.end)
                            && candidateTime.day == optionTime.day
                        ) {
                        return true;
                    }
                }
            }
        }

    }
}

function generateSchedules(courses, noncourses, nocourses, chain: any[]=[], results: any[]=[], level=0) {
    let oldChain = [...chain];
    for (let childCourse of courses[level]) {
        if (!overlaps(chain, childCourse) && !overlaps(noncourses, childCourse) && !overlaps(nocourses, childCourse)) {
            chain.push(childCourse);
            if (level < courses.length - 1) {
                generateSchedules(courses, noncourses, nocourses, chain, results, level + 1);
            } else {
                results.push(chain);
            }
        }
        chain = [...oldChain];
    }
    return results;
}

async function getMeetingInfo(course) {
    let meetings = await db.times.findAll({
        include: [
            'Building'
        ],
        where: {
            section: course.id
        }
    });
    let courseNum = `${course.Course.Department.code}-${course.Course.course}-${course.section}`;
    return {
        title: course.Course.title,
        instructor: course.instructor,
        curenroll: course.curenroll,
        maxenroll: course.maxenroll,
        courseNum,
        courseParentNum: `${course.Course.Department.code}-${course.Course.course}`,
        courseId: course.Course.id,
        id: course.id,
        online: course.type == 'OL',
        credits: isSpecialSection(courseNum) ? 0 : course.Course.credits,
        times: meetings.map((meeting) => {
            return {
                bldg: {
                    code: meeting.Building.code,
                    number: meeting.Building.number,
                },
                room: meeting.room,
                day: meeting.day,
                start: meeting.start,
                end: meeting.end,
                off_campus: meeting.Building.off_campus
            }
        })
    }
}

async function getCourseBySectionId(id) {
    let course = await db.sections.findOne({
        include: [
            {
                association: 'Course',
                include: ['Department']
            }
        ],
        where: {
            id: id
        }
    });

    if (course.quarter > 20130) {
        course.department = course.code;
    } else {
        course.department = course.number;
    }

    return course ? getMeetingInfo(course) : null;
}

router.post('/getCourseOpts', async (req: Request, res: Response) => {
    if (req.body.course == null || req.body.term == null) {
        res.send("No items added");
        return;
    }

    let courseOptions: any[] = [];
    for (let course of req.body.course.split(',')) {
        let upperCourse = course.toUpperCase();
        let parts = upperCourse.match(/([A-Z]{4})[-\s]*(\d{0,3}[A-Z]?)?(?:[-\s]+(\d{0,2}[A-Z]?\d?))?/);
        let department = parts[1];
        let where: any = {
            quarter: req.body.term,
            '$Sections.status$': {
                [Op.ne]: 'X'
            }
        }
        
        if (department.length != 4) {
            res.send("Invalid department");
            return;
        }
        where[Op.or] = [
            {'$Department.code$': department},
            {'$Department.number$': department}
        ]

        

        let courseNum = parts[2];
        if (courseNum != null && ( courseNum.length != 3 && courseNum.length != 4 )) {
            where['course'] = {
                [Op.like]: `${courseNum}%`
            };
        } else {
            where['course'] = courseNum;
        }
        let section = parts[3];
        if (section != null && section.length != 4) {
            where['$Sections.section$'] = {
                [Op.like]: `${section}%`
            };
        } else if (section != null) {
            where['$Sections.section$'] = section;
        }

        if (req.body.ignoreFull) {
            where['$Sections.curenroll$'] = {
                [Op.lt]: db.sequelize.col('section.maxenroll')
            }
        }

        let res = await db.courses.findAll({
            attributes: ['Sections.id'],
            include: [
                'Sections',
                'Department'
            ],
            where
            //order: ['course', '$Section.section$']
        });

        for (let course of res) {
            courseOptions.push(await getCourseBySectionId(course.Sections[0].id));
        }
    }
    res.send(courseOptions);
    return;
});

router.post('/getMatchingSchedules', async (req: Request, res: Response) => {
    let totalSchedules = 1;
    req.body.courses.forEach((course: Course[]) => {
        course.forEach((option: Course) => {
            totalSchedules *= option.sections.length;
        })
    });
    if (totalSchedules >= 10000) {
        res.json({
            error: "argument",
            msg: "Too many schedule possibilities to generate, try to remove classes from your shopping cart. Adding classes like YearOne or classes with hundreds of sections can cause this to occur.",
            arg: "action"
        });
        return;
    }
    let courseGroups: any = {};
    let courseGroupsByCourseId = {};
    let courseSet: any[] = [];
    for (let course of req.body.courses) {
        for (let i in course) {
            let option = course[i];
            let courseSubSet: any[] = [];
            courseGroupsByCourseId[i] = [];
            for(let section of option.sections) {
                let courseInfo = await getCourseBySectionId(section);
                courseInfo.courseIndex = i;
                let cleanCourseNum = getCleanCourseNum(courseInfo.courseNum);

                if (courseGroups[cleanCourseNum] == null) {
                    courseGroups[cleanCourseNum] = []
                }

                if (courseGroupsByCourseId[i][courseInfo.courseId] == null) {
                    courseGroupsByCourseId[i][courseInfo.courseId] = []
                }

                if (isSpecialSection(courseInfo.course)) {
                    if (courseGroups[cleanCourseNum][courseInfo.courseNum] == null) {
                        courseGroups[cleanCourseNum][courseInfo.courseNum] = courseInfo;
                    }

                    if (courseGroupsByCourseId[i][courseInfo.courseId][courseInfo.courseNum] == null) {
                        courseGroupsByCourseId[i][courseInfo.courseId][courseInfo.courseNum] = courseInfo;
                    }
                } else {
                    courseSubSet.push(courseInfo);
                }
            };

            if (courseSubSet.length > 0) {
                courseSet.push(courseSubSet);
            }
        };
    };

    if (courseGroups.length > 0) {
        for (let courseGroupsByIndex of Object.values(courseGroupsByCourseId)) {
            let specialCoruseSubSet = [];
            for (let courseGroup of courseGroupsByIndex) {
                for (let specialCourse of courseGroup) {
                    specialCoruseSubSet.push(specialCourse);
                }
            }

            if (specialCoruseSubSet.length > 0) {
                courseSet.push(specialCoruseSubSet);
            }
        }
    }

    let courseIndex = req.body.courses.length;

    let nonCourseSet: any[] = [];
    for (let nonCourse of req.body.nonCourses) {
        noncourseNum = 'non';
        noncourseNumIndex = courseIndex++;
        nonCourseSet.push(nonCourse);
    }

    if (courseSet.length == 0 && nonCourseSet.length == 0) {
        res.send("No items added");
        return;
    }

    let noCourseSet = req.body.noCourses;

    let results = pruneSpecialCourses(generateSchedules(courseSet, nonCourseSet, noCourseSet), courseGroups);
    
    res.send({
        courses: courseSet,
        nonCourses: nonCourseSet,
        noCourses: noCourseSet,
        results: results
    });
    return;
});

export default router;
