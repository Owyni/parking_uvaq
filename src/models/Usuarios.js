const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Usuarios = sequelize.define('Usuarios', {
  name: { type: DataTypes.STRING, allowNull: false },
  matricula: { type: DataTypes.STRING, allowNull: false, unique: true },
  correo: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } }
}, { freezeTableName: true });

module.exports = Usuarios;