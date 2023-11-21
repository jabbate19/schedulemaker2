const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('schedules', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    oldid: {
      type: DataTypes.STRING(7),
      allowNull: true,
      comment: "the old style schedule indexes"
    },
    datelastaccessed: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('current_timestamp')
    },
    startday: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false,
      defaultValue: 1,
      comment: "The day the schedule starts on 0=sunday"
    },
    endday: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false,
      defaultValue: 6,
      comment: "End day of the schedule, 0=sun"
    },
    starttime: {
      type: DataTypes.SMALLINT.UNSIGNED.ZEROFILL,
      allowNull: false,
      defaultValue: 0480,
      comment: "The start time, minutes into the day"
    },
    endtime: {
      type: DataTypes.SMALLINT.UNSIGNED.ZEROFILL,
      allowNull: false,
      defaultValue: 1320,
      comment: "Schedule end time, minutes into the day"
    },
    building: {
      type: "SET('CODE','NUMBER')",
      allowNull: true,
      defaultValue: "number"
    },
    quarter: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    image: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    sequelize,
    tableName: 'schedules',
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
        name: "oldid",
        using: "BTREE",
        fields: [
          { name: "oldid" },
        ]
      },
    ]
  });
};
