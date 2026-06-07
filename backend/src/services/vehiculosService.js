const { Vehiculos, Usuarios, TipoVehiculos, Colores } = require('../models');

// Función auxiliar para obtener el usuario
const obtenerUsuarioPorMatricula = async (matricula) => {
  const user = await Usuarios.findOne({ where: { matricula } });
  if (!user) throw new Error('Usuario no encontrado en la base de datos');
  return user;
};

const obtenerVehiculosPorMatricula = async (matricula) => {
  const user = await obtenerUsuarioPorMatricula(matricula);
  const vehiculos = await Vehiculos.findAll({ where: { userId: user.id } });

  return vehiculos.map(v => ({
    id: v.id,
    placa: v.placa,
    modelo: v.modelo, // Mandamos el modelo limpio
    color: v.colorId || "Desconocido", 
    tipo: v.tipoVehiculoId || "Desconocido" 
  }));
};

const crearVehiculo = async (matricula, data) => {
  const user = await obtenerUsuarioPorMatricula(matricula);
  const tipoId = data.tipo === 'Automóvil' ? 1 : 2; 

  return await Vehiculos.create({
    placa: data.placa,
    modelo: data.modelo, // Asignación limpia y directa sin trucos
    userId: user.id,
    tipoVehiculoId: tipoId,
    colorId: 1
  });
};

const actualizarVehiculo = async (id, matricula, data) => {
  const user = await obtenerUsuarioPorMatricula(matricula);
  const vehiculo = await Vehiculos.findOne({ where: { id, userId: user.id } });
  if (!vehiculo) throw new Error('Vehículo no encontrado');

  const tipoId = data.tipo === 'Automóvil' ? 1 : 2;

  await vehiculo.update({
    placa: data.placa,
    modelo: data.modelo, // Asignación limpia
    tipoVehiculoId: tipoId,
  });

  return vehiculo;
};

const eliminarVehiculo = async (id, matricula) => {
  const user = await obtenerUsuarioPorMatricula(matricula);
  
  const vehiculo = await Vehiculos.findOne({ where: { id, userId: user.id } });
  if (!vehiculo) throw new Error('Vehículo no encontrado o no tienes permisos');

  await vehiculo.destroy();
  return true;
};

module.exports = {
  obtenerVehiculosPorMatricula,
  crearVehiculo,
  actualizarVehiculo,
  eliminarVehiculo
};