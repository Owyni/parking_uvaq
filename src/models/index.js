const sequelize = require('../config/db');

// Importar Modelos
const Usuario = require('./Usuarios');
const Vehiculo = require('./Vehiculos');
const ParkingLog = require('./ControlAccesos');
const ParkingCategory = require('./CategoriaEspacios');
const Role = require('./Roles');
const Carrera = require('./Carreras');
const Color = require('./Colores');
const TipoVehiculo = require('./TipoVehiculos');

// --- RELACIONES ---

// Usuarios
Usuario.belongsTo(Role, { foreignKey: 'roleId' });
Usuario.belongsTo(Carrera, { foreignKey: 'carreraId' });

// Vehículos
Vehiculo.belongsTo(Usuario, { foreignKey: 'userId' });
Usuario.hasMany(Vehiculo, { foreignKey: 'userId' });

Vehiculo.belongsTo(Color, { foreignKey: 'colorId' });
Vehiculo.belongsTo(TipoVehiculo, { foreignKey: 'tipoVehiculoId' });

// Logs (El flujo del estacionamiento)
ParkingLog.belongsTo(Vehiculo, { foreignKey: 'vehicleId' });
Vehiculo.hasMany(ParkingLog, { foreignKey: 'vehicleId' });

ParkingLog.belongsTo(ParkingCategory, { foreignKey: 'categoryId' });
ParkingCategory.hasMany(ParkingLog, { foreignKey: 'categoryId' });

module.exports = {
  sequelize,
  Usuario,
  Vehiculo,
  ParkingLog,
  ParkingCategory,
  Role,
  Carrera,
  Color,
  TipoVehiculo
};