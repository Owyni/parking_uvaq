const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const CategoriaEspacios = sequelize.define('CategoriaEspacios', {
  name: { type: DataTypes.STRING, allowNull: false, unique: true }
}, { freezeTableName: true, timestamps: false });

module.exports = CategoriaEspacios;