const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('departments', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    number: {
      type: DataTypes.SMALLINT.UNSIGNED.ZEROFILL,
      allowNull: true,
      unique: "UNI_deptnumber"
    },
    code: {
      type: DataTypes.STRING(5),
      allowNull: true,
      unique: "UNI_deptcode"
    },
    title: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    school: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: 'schools',
        key: 'id'
      }
    },
    qtrnums: {
      type: DataTypes.STRING(20),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'departments',
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
        name: "UNI_deptnumber",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "number" },
        ]
      },
      {
        name: "UNI_deptcode",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "code" },
        ]
      },
      {
        name: "school",
        using: "BTREE",
        fields: [
          { name: "school" },
        ]
      },
    ]
  });
};
