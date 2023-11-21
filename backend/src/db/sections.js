const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('sections', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    course: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      comment: "FK to courses.id",
      references: {
        model: 'courses',
        key: 'id'
      }
    },
    section: {
      type: DataTypes.STRING(4),
      allowNull: false,
      comment: "Section number"
    },
    title: {
      type: DataTypes.STRING(30),
      allowNull: true,
      comment: "The section specific course title"
    },
    type: {
      type: DataTypes.ENUM('R','N','H','BL','OL'),
      allowNull: false,
      defaultValue: "R",
      comment: "R=regular, N=night, OL=online, H=honors, BL=????"
    },
    status: {
      type: DataTypes.ENUM('O','C','X'),
      allowNull: false,
      comment: "o=open, c=closed, x=cancelled"
    },
    instructor: {
      type: DataTypes.STRING(64),
      allowNull: false,
      defaultValue: "TBA",
      comment: "Instructor's Name"
    },
    maxenroll: {
      type: DataTypes.SMALLINT.UNSIGNED,
      allowNull: false,
      comment: "max enrollment"
    },
    curenroll: {
      type: DataTypes.SMALLINT.UNSIGNED,
      allowNull: false,
      comment: "current enrollment"
    }
  }, {
    sequelize,
    tableName: 'sections',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "course_2",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "course" },
          { name: "section" },
        ]
      },
      {
        name: "course",
        using: "BTREE",
        fields: [
          { name: "course" },
        ]
      },
    ]
  });
};
