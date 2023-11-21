const { Sequelize } = require('sequelize');
import config from '../config';

const sequelize = new Sequelize(
    config.DATABASE_NAME,
    config.DATABASE_USER,
    config.DATABASE_PASS,
    {
        host: config.DATABASE_HOST,
        dialect: 'mysql',
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        logging: config.LOG_QUERY
    }
);

interface DB {
    Sequelize: any,
    sequelize: any,
    buildings: any,
    courses: any,
    departments: any,
    quarters: any,
    schedulecourses: any,
    schedulenoncourses: any,
    //schedulenocourses: any,
    schedules: any,
    schools: any,
    scrapelog: any,
    sections: any,
    times: any
}

const db: DB = {
    Sequelize,
    sequelize,
    buildings: require("./buildings.js")(sequelize, Sequelize),
    courses: require("./courses.js")(sequelize, Sequelize),
    departments: require("./departments.js")(sequelize, Sequelize),
    quarters: require("./quarters.js")(sequelize, Sequelize),
    schedulecourses: require("./schedulecourses.js")(sequelize, Sequelize),
    schedulenoncourses: require("./schedulenoncourses.js")(sequelize, Sequelize),
    //schedulenocourses: require("./schedulenocourses.js")(sequelize, Sequelize),
    schedules: require("./schedules.js")(sequelize, Sequelize),
    schools: require("./schools.js")(sequelize, Sequelize),
    scrapelog: require("./scrapelog.js")(sequelize, Sequelize),
    sections: require("./sections.js")(sequelize, Sequelize),
    times: require("./times.js")(sequelize, Sequelize)
};

db.sections.belongsTo(db.courses, {
    as: 'Course',
    foreignKey: 'course'
});

db.courses.hasMany(db.sections, {
    as: 'Sections',
    foreignKey: 'course'
});

db.courses.belongsTo(db.departments, {
    as: 'Department',
    foreignKey: 'department'
});

db.times.belongsTo(db.buildings, {
    as: 'Building',
    foreignKey: 'building'
})

export default db;
