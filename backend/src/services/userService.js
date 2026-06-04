const { Usuarios, Vehiculos, Colores, Roles } = require('../models');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');

// ==========================================================
// 1. REGISTRO NORMAL (Alumnos, Docentes, Administrativos)
// ==========================================================
const registrarUsuarioService = async (userData) => {
  const { name, matricula, correo, contrasena, roleId, carreraId, placa, tipoVehiculoId, modelo, color } = userData;

  if (!name || !matricula || !correo || !contrasena || !roleId) {
    throw new Error('Todos los campos obligatorios del usuario deben ser completados.');
  }

  const usuarioExistente = await Usuarios.findOne({
    where: { [Op.or]: [{ matricula: matricula.trim() }, { correo: correo.trim().toLowerCase() }] }
  });

  if (usuarioExistente) {
    throw new Error('La matrícula o el correo ya están registrados.');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(contrasena, salt);

  const nuevoUsuario = await Usuarios.create({
    name: name.trim(),
    matricula: matricula.trim(),
    correo: correo.trim().toLowerCase(),
    contrasena: hashedPassword,
    roleId: parseInt(roleId, 10),
    carreraId: carreraId ? parseInt(carreraId, 10) : null
  });

  // Vehículo Opcional
  if (placa && placa.trim() !== '') {
    const vehiculoExistente = await Vehiculos.findOne({ where: { placa: placa.trim().toUpperCase() } });
    if (vehiculoExistente) throw new Error(`El usuario fue creado, pero la placa ${placa} ya pertenece a otro vehículo.`);
    if (!tipoVehiculoId) throw new Error('Especifique el Tipo de Vehículo.');

    let idColorEncontrado = null;
    if (color) {
      try {
        const colorDb = await Colores.findOne({ where: { name: { [Op.iLike]: color.trim() } } });
        if (colorDb) idColorEncontrado = colorDb.id;
      } catch (e) { }
    }

    await Vehiculos.create({
      placa: placa.trim().toUpperCase(),
      modelo: modelo ? modelo.trim() : 'No especificado',
      tipoVehiculoId: parseInt(tipoVehiculoId, 10),
      userId: nuevoUsuario.id,
      colorId: idColorEncontrado
    });
  }

  const { contrasena: _, ...usuarioLimpio } = nuevoUsuario.toJSON();
  return usuarioLimpio;
};

// ==========================================================
// 2. REGISTRO EXCLUSIVO DE VISITANTES
// ==========================================================
const registrarVisitanteService = async (visitanteData) => {
  // 🔑 CORRECCIÓN: Desestructuración limpia y directa del objeto de datos
  const { name, placa, tipoVehiculoId, modelo, color } = visitanteData;

  // Para un visitante, exigimos el coche y el nombre
  if (!name || !placa || !tipoVehiculoId) {
    throw new Error('El nombre, placa y tipo de vehículo son obligatorios para registrar un visitante.');
  }

  // Validamos que el vehículo no esté ya adentro
  const vehiculoExistente = await Vehiculos.findOne({ where: { placa: placa.trim().toUpperCase() } });
  if (vehiculoExistente) {
    throw new Error(`La placa ${placa} ya se encuentra registrada en el sistema.`);
  }

  // Buscamos dinámicamente el ID del rol "Visitante" en la BD
  const rolVisitante = await Roles.findOne({ where: { name: { [Op.iLike]: '%visitante%' } } });
  if (!rolVisitante) {
    throw new Error('Error crítico: El rol de "Visitante" no existe en la base de datos.');
  }

  // Generamos los placeholders obligatorios de PostgreSQL
  const timestamp = Date.now();
  const matriculaFake = `VIS-${timestamp}`;
  const correoFake = `visitante_${timestamp}@uvaq.edu.mx`;
  const contrasenaFake = `visitor_${timestamp}`;

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(contrasenaFake, salt);

  // 1. Creamos al visitante con el nombre correcto y limpio
  const nuevoVisitante = await Usuarios.create({
    name: name.trim(),
    matricula: matriculaFake,
    correo: correoFake,
    contrasena: hashedPassword,
    roleId: rolVisitante.id,
    carreraId: null // Visitantes no tienen carrera
  });

  // 2. Resolvemos el color
  let idColorEncontrado = null;
  if (color) {
    try {
      const colorDb = await Colores.findOne({ where: { name: { [Op.iLike]: color.trim() } } });
      if (colorDb) idColorEncontrado = colorDb.id;
    } catch (e) { }
  }

  // 3. Creamos el vehículo
  await Vehiculos.create({
    placa: placa.trim().toUpperCase(),
    modelo: modelo ? modelo.trim() : 'No especificado',
    userId: nuevoVisitante.id,
    tipoVehiculoId: parseInt(tipoVehiculoId, 10),
    colorId: idColorEncontrado
  });

  const { contrasena: _, ...visitanteLimpio } = nuevoVisitante.toJSON();
  return visitanteLimpio;
};

module.exports = {
  registrarUsuarioService,
  registrarVisitanteService // Exportamos la nueva función
};