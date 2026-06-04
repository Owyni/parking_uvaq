const { registrarUsuarioService, registrarVisitanteService } = require('../services/userService');

// ==========================================
// CONTROLADOR PARA USUARIOS NORMALES
// ==========================================
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

// ==========================================
// CONTROLADOR PARA VISITANTES
// ==========================================
const registrarVisitante = async (req, res) => {
  try {
    const nuevoVisitante = await registrarVisitanteService(req.body);

    return res.status(201).json({
      message: 'Visitante y vehículo registrados exitosamente',
      user: nuevoVisitante
    });
  } catch (error) {
    console.error('Error en el controlador de registro de visitante:', error);
    return res.status(400).json({ message: error.message || 'Error al registrar el visitante' });
  }
};

module.exports = {
  registrarUsuario,
  registrarVisitante
};