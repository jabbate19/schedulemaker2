const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('schedulenoncourses', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    day: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false,
      comment: "numerical day representation (0=sunday)"
    },
    start: {
      type: DataTypes.SMALLINT.UNSIGNED,
      allowNull: false,
      comment: "start time HRMN"
    },
    end: {
      type: DataTypes.SMALLINT.UNSIGNED,
      allowNull: false,
      comment: "end time HRMN"
    },
    schedule: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      comment: "FK to schedules.id",
      references: {
        model: 'schedules',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'schedulenoncourses',
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
        name: "schedule",
        using: "BTREE",
        fields: [
          { name: "schedule" },
        ]
      },
    ]
  });
};
