const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Vehiculo = sequelize.define('Vehiculo', {
  plate: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  model: {
    type: DataTypes.STRING
  },
  color: {
    type: DataTypes.STRING
  }
}, {
  timestamps: true
});

module.exports = Vehiculo;