const sequelize = require('../config/db');
const Usuario = require('./Usuario');
const Vehiculo = require('./Vehiculo');

// Relaciones
Usuario.hasMany(Vehiculo, { foreignKey: 'userId' });
Vehiculo.belongsTo(Usuario, { foreignKey: 'userId' });

module.exports = {
  sequelize,
  Usuario,
  Vehiculo
};