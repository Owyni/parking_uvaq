const { Usuarios } = require('../models');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');

const registrarUsuarioService = async (userData) => {
  // Extraigo las variables del formulario 
  const { name, matricula, correo, contrasena, roleId, carreraId } = userData;

  // Valido que los campos requeridos no vengan vacíos
  if (!name || !matricula || !correo || !contrasena || !roleId) {
    throw new Error('Todos los campos obligatorios deben ser completados.');
  }

  const usuarioExistente = await Usuarios.findOne({
    where: {
      [Op.or]: [{ matricula }, { correo }]
    }
  });

  if (usuarioExistente) {
    throw new Error('La matrícula o el correo electrónico ya se encuentran registrados.');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(contrasena, salt);

  const datosInsertar = {
    name: name.trim(),
    matricula: matricula.trim(),
    correo: correo.trim().toLowerCase(),
    contrasena: hashedPassword,
    roleId: parseInt(roleId, 10),
    carreraId: carreraId ? parseInt(carreraId, 10) : null // Si no aplica, mandamos null limpio [cite: 1066]
  };

  const nuevoUsuario = await Usuarios.create(datosInsertar);

  // Retornamos el JSON sin la contraseña por seguridad
  const { contrasena: _, ...usuarioLimpio } = nuevoUsuario.toJSON();
  return usuarioLimpio;
};

module.exports = {
  registrarUsuarioService
};