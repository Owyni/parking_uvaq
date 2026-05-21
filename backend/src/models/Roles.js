const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Roles = sequelize.define('Roles', {
  name: { type: DataTypes.STRING, allowNull: false, unique: true }
}, { freezeTableName: true, timestamps: false });

module.exports = Roles;