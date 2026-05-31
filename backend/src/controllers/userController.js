const { registrarUsuarioService } = require('../services/userService');

const registrarUsuario = async (req, res) => {
  try {
    const nuevoUsuario = await registrarUsuarioService(req.body);

    return res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user: nuevoUsuario
    });
  } catch (error) {
    console.error('Error en el controlador de registro:', error);
    return res.status(400).json({ message: error.message || 'Error al registrar el usuario' });
  }
};

module.exports = {
  registrarUsuario
};