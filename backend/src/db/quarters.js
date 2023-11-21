const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('quarters', {
    quarter: {
      type: DataTypes.SMALLINT.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    start: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      comment: "starting date of the quarter"
    },
    end: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      comment: "ending date of the quarter"
    }
  }, {
    sequelize,
    tableName: 'quarters',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "quarter" },
        ]
      },
    ]
  });
};
