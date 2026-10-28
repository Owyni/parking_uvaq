const { Usuarios, Roles } = require('../models');
const bcrypt = require('bcryptjs');
const { generateAccessToken } = require('../middleware/auth');

const loginAdminService = async (correo, contrasena) => {
  const user = await Usuarios.findOne({ where: { correo }, include: [{ model: Roles }] });
  if (!user) throw new Error('Credenciales incorrectas. Verifica tu información.');

  const roleName = user.Role ? user.Role.name : (user.Roles ? user.Roles.name : 'Estudiante');
  if (roleName === 'Visitante') {
    throw new Error('Acceso restringido. Rol no autorizado para ingresar al sistema.');
  }
  if (roleName === 'Estudiante' && user.paymentStatus !== 'paid') {
    throw new Error('Pago pendiente. Completa el pago de registro antes de iniciar sesión.');
  }

  const isMatch = await bcrypt.compare(contrasena, user.contrasena);
  if (!isMatch) throw new Error('Credenciales incorrectas. Verifica tu información.');

  const token = generateAccessToken({ matricula: user.matricula, name: user.name, role: roleName });
  return { token, user: { name: user.name, correo: user.correo, role: roleName } };
};

module.exports = { loginAdminService };
