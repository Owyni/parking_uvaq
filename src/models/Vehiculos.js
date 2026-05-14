const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Vehiculos = sequelize.define('Vehiculos', {
  placa: { type: DataTypes.STRING, allowNull: false, unique: true },
  modelo: { type: DataTypes.STRING, allowNull: false }
}, { freezeTableName: true });

module.exports = Vehiculos;