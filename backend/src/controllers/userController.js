const { User, Vehicle } = require('../models');
const jwt = require('jsonwebtoken');

const registerUserWithVehicle = async (req, res) => {
  try {
    const { name, matricula, correo, roleId, carreraId, plate, model, colorId, tipoVehiculoId } = req.body;

    // 1. Validaciones de campos
    if (!name || !matricula || !correo || !plate) {
      return res.status(400).json({ message: 'Faltan campos obligatorios (Nombre, Matrícula, Correo o Placa).' });
    }

    // 2. Validaciones de duplicados
    const existingUser = await User.findOne({ where: { matricula } });
    if (existingUser) {
      return res.status(400).json({ message: 'La matrícula ya se encuentra registrada.' });
    }

    const existingVehicle = await Vehicle.findOne({ where: { plate } });
    if (existingVehicle) {
      return res.status(400).json({ message: 'La placa vehicular ya está registrada en el sistema.' });
    }

    // 3. Crear el registro en la Base de Datos
    const newUser = await User.create({
      name,
      matricula,
      correo,
      roleId,
      carreraId
    });

    const newVehicle = await Vehicle.create({
      plate,
      model,
      colorId,
      tipoVehiculoId,
      userId: newUser.id // Vinculación mediante FK
    });

    // 4. Generar el API Token para el nuevo usuario
    // Guardamos su ID y su Matrícula dentro del token
    const userToken = jwt.sign(
      { id: newUser.id, matricula: newUser.matricula },
      process.env.JWT_SECRET,
      { expiresIn: '30d' } // El token expira en 30 días
    );

    // 5. Enviar respuesta con el token incluido
    return res.status(201).json({
      message: 'Usuario y vehículo registrados exitosamente.',
      token: userToken, // El frontend de Astro guardará este token
      data: {
        user: newUser,
        vehicle: newVehicle
      }
    });

  } catch (error) {
    console.error('Error en registerUserWithVehicle:', error);
    return res.status(500).json({ message: 'Error interno del servidor al registrar el usuario.' });
  }
};

module.exports = {
  registerUserWithVehicle
};