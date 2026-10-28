const { loginAdminService } = require('../services/authService');

const login = async (req, res) => {
  try {
    const { correo, contrasena } = req.body;
    if (!correo || !contrasena) {
      return res.status(400).json({ message: 'El correo y la contraseña son obligatorios.' });
    }
    const authData = await loginAdminService(correo, contrasena);
    return res.status(200).json({
      message: 'Autenticación exitosa.',
      token: authData.token,
      user: authData.user
    });
  } catch (error) {
    console.error('Error en el login:', error);
    if (error.message.includes('Credenciales incorrectas') ||
        error.message.includes('Acceso restringido') ||
        error.message.includes('Pago pendiente')) {
      return res.status(401).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

module.exports = { login };
