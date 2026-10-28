const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const { Usuarios, Roles, Vehiculos, Colores } = require('../models');

const normalize = (value) => String(value || '').trim();

const getStudentRole = async () => {
  const role = await Roles.findOne({ where: { name: { [Op.iLike]: 'Estudiante' } } });
  if (!role) throw new Error('No existe el rol Estudiante en la base de datos.');
  return role;
};

const createPendingStudent = async (payload, checkoutSessionId) => {
  const name = normalize(payload.name);
  const matricula = normalize(payload.matricula);
  const correo = normalize(payload.correo).toLowerCase();
  const contrasena = String(payload.contrasena || '');
  const carreraId = payload.carreraId ? Number.parseInt(payload.carreraId, 10) : null;

  if (!name || !matricula || !correo || !contrasena) {
    const error = new Error('Nombre, matrícula, correo y contraseña son obligatorios.');
    error.statusCode = 400;
    throw error;
  }
  if (contrasena.length < 8) {
    const error = new Error('La contraseña debe tener al menos 8 caracteres.');
    error.statusCode = 400;
    throw error;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
    const error = new Error('El correo no tiene un formato válido.');
    error.statusCode = 400;
    throw error;
  }

  const role = await getStudentRole();
  const existing = await Usuarios.findOne({
    where: { [Op.or]: [{ matricula }, { correo }] }
  });
  if (existing) {
    const error = new Error('La matrícula o el correo ya están registrados.');
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(contrasena, 12);
  const user = await Usuarios.create({
    name,
    matricula,
    correo,
    contrasena: hashedPassword,
    roleId: role.id,
    carreraId: Number.isInteger(carreraId) ? carreraId : null,
    paymentStatus: 'pending',
    stripeCheckoutSessionId: checkoutSessionId || null
  });

  return user;
};

const attachOptionalVehicle = async (user, payload) => {
  const placa = normalize(payload.placa).toUpperCase();
  const tipoVehiculoId = payload.tipoVehiculoId ? Number.parseInt(payload.tipoVehiculoId, 10) : null;
  if (!placa && !tipoVehiculoId) return;
  if (!placa || !tipoVehiculoId) {
    const error = new Error('Para registrar vehículo, indica placa y tipo de vehículo.');
    error.statusCode = 400;
    throw error;
  }

  const existingVehicle = await Vehiculos.findOne({ where: { placa } });
  if (existingVehicle) {
    const error = new Error('La placa ya está registrada.');
    error.statusCode = 409;
    throw error;
  }

  let colorId = null;
  const colorName = normalize(payload.color);
  if (colorName) {
    const color = await Colores.findOne({ where: { name: { [Op.iLike]: colorName } } });
    colorId = color ? color.id : null;
  }

  await Vehiculos.create({
    placa,
    modelo: normalize(payload.modelo) || 'No especificado',
    tipoVehiculoId,
    userId: user.id,
    colorId
  });
};

module.exports = { createPendingStudent, attachOptionalVehicle };
