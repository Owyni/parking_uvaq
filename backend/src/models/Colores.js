const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Colores = sequelize.define('Colores', {
  name: { type: DataTypes.STRING, allowNull: false, unique: true }
}, { freezeTableName: true, timestamps: false });

module.exports = Colores;