const { Usuarios, Roles } = require('../models');
const bcrypt = require('bcryptjs');
const { generateAccessToken } = require('../middleware/auth');

const loginAdminService = async (correo, contrasena) => {
  const user = await Usuarios.findOne({
    where: { correo },
    include: [{ model: Roles }]
  });

  if (!user) {
    throw new Error('Credenciales incorrectas. Verifica tu información.');
  }

  const roleName = user.Role ? user.Role.name : (user.Roles ? user.Roles.name : 'Estudiante');

  // Permitimos el acceso a Administradores y Estudiantes
  if (roleName == 'Visitante') {
    throw new Error('Acceso restringido. Rol no autorizado para ingresar al sistema.');
  }

  // Comparar la contraseña enviada con la encriptada en la BD
  const isMatch = await bcrypt.compare(contrasena, user.contrasena);
  if (!isMatch) {
    throw new Error('Credenciales incorrectas. Verifica tu información.');
  }

  // Ahora sí es admon :v, así que llamamos a la función importada correctamente
  const token = generateAccessToken({
    matricula: user.matricula,
    name: user.name,
    role: roleName
  });

  // Retornamos el objeto estructurado para el controlador
  return {
    token,
    user: {
      name: user.name,
      correo: user.correo,
      role: roleName
    }
  };
};

module.exports = { loginAdminService };