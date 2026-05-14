const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const TipoVehiculos = sequelize.define('TipoVehiculos', {
  name: { type: DataTypes.STRING, allowNull: false, unique: true }
}, { freezeTableName: true, timestamps: false });

module.exports = TipoVehiculos;