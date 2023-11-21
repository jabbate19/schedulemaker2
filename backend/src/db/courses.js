const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('courses', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    department: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'departments',
        key: 'id'
      }
    },
    course: {
      type: DataTypes.STRING(4),
      allowNull: false
    },
    credits: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false,
      comment: "Number of credit hours"
    },
    quarter: {
      type: DataTypes.SMALLINT.UNSIGNED,
      allowNull: false,
      comment: "5 digit quarter, we're good until 6500AD",
      references: {
        model: 'quarters',
        key: 'quarter'
      }
    },
    title: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: "Course title"
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'courses',
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
        name: "coursenumbers",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "quarter" },
          { name: "department" },
          { name: "course" },
        ]
      },
      {
        name: "department",
        using: "BTREE",
        fields: [
          { name: "department" },
        ]
      },
      {
        name: "quarter",
        using: "BTREE",
        fields: [
          { name: "quarter" },
        ]
      },
    ]
  });
};
