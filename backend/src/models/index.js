const sequelize = require('../config/db');

// Importar Modelos
const Usuarios = require('./Usuarios');
const Vehiculos = require('./Vehiculos');
const ControlAccesos = require('./ControlAccesos');
const CategoriaEspacios = require('./CategoriaEspacios');
const Roles = require('./Roles');
const Carreras = require('./Carreras');
const Colores = require('./Colores');
const TipoVehiculos = require('./TipoVehiculos');

// --- RELACIONES ---

// Usuarios
Usuarios.belongsTo(Roles, { foreignKey: 'roleId' });
Usuarios.belongsTo(Carreras, { foreignKey: 'carreraId' });

// Vehículos
Vehiculos.belongsTo(Usuarios, { foreignKey: 'userId' });
Usuarios.hasMany(Vehiculos, { foreignKey: 'userId' });

Vehiculos.belongsTo(Colores, { foreignKey: 'colorId' });
Vehiculos.belongsTo(TipoVehiculos, { foreignKey: 'tipoVehiculoId' });

// Logs (El flujo del estacionamiento)
ControlAccesos.belongsTo(Vehiculos, { foreignKey: 'vehicleId' });
Vehiculos.hasMany(ControlAccesos, { foreignKey: 'vehicleId' });

ControlAccesos.belongsTo(CategoriaEspacios, { foreignKey: 'categoryId' });
CategoriaEspacios.hasMany(ControlAccesos, { foreignKey: 'categoryId' });

module.exports = {
  sequelize,
  Usuarios,
  Vehiculos,
  ControlAccesos,
  CategoriaEspacios,
  Roles,
  Carreras,
  Colores,
  TipoVehiculos
};