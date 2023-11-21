const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('schools', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    number: {
      type: DataTypes.STRING(2),
      allowNull: true
    },
    code: {
      type: DataTypes.STRING(8),
      allowNull: true
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: ""
    },
    vnumber: {
      type: DataTypes.STRING(2),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'schools',
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
        name: "UNI_id-number",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "number" },
          { name: "code" },
        ]
      },
      {
        name: "UQ_schools_vnumber_code",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "vnumber" },
          { name: "code" },
        ]
      },
    ]
  });
};
