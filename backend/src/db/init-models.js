var DataTypes = require("sequelize").DataTypes;
var _buildings = require("./buildings");
var _courses = require("./courses");
var _departments = require("./departments");
var _quarters = require("./quarters");
var _schedulecourses = require("./schedulecourses");
var _schedulenoncourses = require("./schedulenoncourses");
var _schedules = require("./schedules");
var _schools = require("./schools");
var _scrapelog = require("./scrapelog");
var _sections = require("./sections");
var _times = require("./times");

function initModels(sequelize) {
  var buildings = _buildings(sequelize, DataTypes);
  var courses = _courses(sequelize, DataTypes);
  var departments = _departments(sequelize, DataTypes);
  var quarters = _quarters(sequelize, DataTypes);
  var schedulecourses = _schedulecourses(sequelize, DataTypes);
  var schedulenoncourses = _schedulenoncourses(sequelize, DataTypes);
  var schedules = _schedules(sequelize, DataTypes);
  var schools = _schools(sequelize, DataTypes);
  var scrapelog = _scrapelog(sequelize, DataTypes);
  var sections = _sections(sequelize, DataTypes);
  var times = _times(sequelize, DataTypes);

  times.belongsTo(buildings, { as: "building_building", foreignKey: "building"});
  buildings.hasMany(times, { as: "times", foreignKey: "building"});
  sections.belongsTo(courses, { as: "course_course", foreignKey: "course"});
  courses.hasMany(sections, { as: "sections", foreignKey: "course"});
  courses.belongsTo(departments, { as: "department_department", foreignKey: "department"});
  departments.hasMany(courses, { as: "courses", foreignKey: "department"});
  courses.belongsTo(quarters, { as: "quarter_quarter", foreignKey: "quarter"});
  quarters.hasMany(courses, { as: "courses", foreignKey: "quarter"});
  schedulecourses.belongsTo(schedules, { as: "schedule_schedule", foreignKey: "schedule"});
  schedules.hasMany(schedulecourses, { as: "schedulecourses", foreignKey: "schedule"});
  schedulenoncourses.belongsTo(schedules, { as: "schedule_schedule", foreignKey: "schedule"});
  schedules.hasMany(schedulenoncourses, { as: "schedulenoncourses", foreignKey: "schedule"});
  departments.belongsTo(schools, { as: "school_school", foreignKey: "school"});
  schools.hasMany(departments, { as: "departments", foreignKey: "school"});
  schedulecourses.belongsTo(sections, { as: "section_section", foreignKey: "section"});
  sections.hasMany(schedulecourses, { as: "schedulecourses", foreignKey: "section"});
  times.belongsTo(sections, { as: "section_section", foreignKey: "section"});
  sections.hasMany(times, { as: "times", foreignKey: "section"});

  return {
    buildings,
    courses,
    departments,
    quarters,
    schedulecourses,
    schedulenoncourses,
    schedules,
    schools,
    scrapelog,
    sections,
    times,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
