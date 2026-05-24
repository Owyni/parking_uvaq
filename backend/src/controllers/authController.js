const { User, Role } = require('../models');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
  try {
    const { matricula } = req.body;

    if (!matricula) {
      return res.status(400).json({ message: 'La matrícula es obligatoria.' });
    }

    // Buscar al usuario e incluir su rol para saber si es Administrador o Alumno
    const user = await User.findOne({ 
      where: { matricula },
      include: [{ model: Role, as: 'Role' }] // Ajusta el alias según tu index.js de models
    });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado en el sistema UVAQ.' });
    }

    // Crear el token firmado con la palabra secreta de tu .env
    const token = jwt.sign(
      { 
        id: user.id, 
        matricula: user.matricula,
        role: user.Role ? user.Role.name : 'Estudiante' 
      },
      process.env.SECRET_WORD, // Usando tu variable actual
      { expiresIn: '24h' } // El token expira en 1 día
    );

    return res.status(200).json({
      message: 'Autenticación exitosa.',
      token,
      user: {
        name: user.name,
        role: user.Role ? user.Role.name : 'Estudiante'
      }
    });

  } catch (error) {
    console.error('Error en el login:', error);
    return res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

module.exports = { login };