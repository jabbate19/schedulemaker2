const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('times', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    section: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      comment: "FK to sections.id",
      references: {
        model: 'sections',
        key: 'id'
      }
    },
    day: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false,
      comment: "Day of the week 0=sunday "
    },
    start: {
      type: DataTypes.SMALLINT.UNSIGNED,
      allowNull: false,
      comment: "start time"
    },
    end: {
      type: DataTypes.SMALLINT.UNSIGNED,
      allowNull: false,
      comment: "end time"
    },
    building: {
      type: DataTypes.STRING(5),
      allowNull: true,
      comment: "building number bitches!",
      references: {
        model: 'buildings',
        key: 'number'
      }
    },
    room: {
      type: DataTypes.STRING(10),
      allowNull: false,
      comment: "room number"
    }
  }, {
    sequelize,
    tableName: 'times',
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
        name: "section",
        using: "BTREE",
        fields: [
          { name: "section" },
        ]
      },
      {
        name: "building",
        using: "BTREE",
        fields: [
          { name: "building" },
        ]
      },
    ]
  });
};
