const { loginAdminService } = require('../services/authService');

const login = async (req, res) => {
  try {
    const { correo, contrasena } = req.body;

    if (!correo || !contrasena) {
      return res.status(400).json({ message: 'El correo y la contraseña son obligatorios.' });
    }

    // Llamamos al servicio que valida credenciales y rol
    const authData = await loginAdminService(correo, contrasena);

    // Ruta exacta que mi front-end espera para guardar el token y la info del usuario en el localStorage
    return res.status(200).json({
      message: 'Autenticación exitosa.',
      token: authData.token,
      user: authData.user
    });

  } catch (error) {
    console.error('Error en el login:', error);
    
    // Filtramos los errores controlados que lanzamos desde el servicio
    if (error.message.includes('Credenciales incorrectas') || error.message.includes('Acceso restringido')) {
      return res.status(401).json({ message: error.message });
    }
    
    // Error de servidor (ej. base de datos caída)
    return res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

module.exports = { login };