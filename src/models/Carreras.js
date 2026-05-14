const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Carreras = sequelize.define('Carreras', {
  name: { type: DataTypes.STRING, allowNull: false, unique: true }
}, { freezeTableName: true, timestamps: false });

module.exports = Carreras;