const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('scrapelog', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    timeStarted: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "Time scrape started"
    },
    timeEnded: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "Time scrape ended"
    },
    quartersAdded: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false
    },
    coursesAdded: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    coursesUpdated: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    sectionsAdded: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    sectionsUpdated: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    failures: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      comment: "Number of overall failures"
    }
  }, {
    sequelize,
    tableName: 'scrapelog',
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
    ]
  });
};
