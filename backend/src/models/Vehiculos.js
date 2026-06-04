const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Vehiculos = sequelize.define('Vehiculos', {
  placa: { 
    type: DataTypes.STRING, 
    allowNull: false, 
    unique: true 
  },
  modelo: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  tipoVehiculoId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  colorId: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, { 
  freezeTableName: true,
  timestamps: false 
});

module.exports = Vehiculos;