const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ControlAccesos = sequelize.define('ControlAccesos', {  
  entryTime: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  
  exitTime: {
    type: DataTypes.DATE,
    allowNull: true,
  },

  observations: {
    type: DataTypes.STRING,
    allowNull: true,
  }
}, {
  freezeTableName: true,
  timestamps: true,
});

module.exports = ControlAccesos;