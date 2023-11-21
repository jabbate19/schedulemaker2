const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('schedulecourses', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    schedule: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      comment: "FK to schedules.id",
      references: {
        model: 'schedules',
        key: 'id'
      }
    },
    section: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      comment: "FK to sections.id",
      references: {
        model: 'sections',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'schedulecourses',
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
          { name: "section" },
        ]
      },
      {
        name: "FK_schedulecourses-sections",
        using: "BTREE",
        fields: [
          { name: "section" },
        ]
      },
    ]
  });
};
