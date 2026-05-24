const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const CategoriaEspacios = sequelize.define(
  'CategoriaEspacios',
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    totalCapacity: {
      type: DataTypes.INTEGER,
      allowNull: true,
    }
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = CategoriaEspacios;