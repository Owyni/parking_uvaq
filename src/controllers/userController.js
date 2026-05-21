const { User, Vehicle } = require('../models');

const registerUserWithVehicle = async (req, res) => {
  try {
    const { name, matricula, correo, roleId, carreraId, plate, model, colorId, tipoVehiculoId } = req.body;

    if (!name || !matricula || !correo || !plate) {
      return res.status(400).json({ message: 'Faltan campos obligatorios (Nombre, Matrícula, Correo o Placa).' });
    }

    const existingUser = await User.findOne({ where: { matricula } });
    if (existingUser) {
      return res.status(400).json({ message: 'La matrícula ya se encuentra registrada.' });
    }

    const existingVehicle = await Vehicle.findOne({ where: { plate } });
    if (existingVehicle) {
      return res.status(400).json({ message: 'La placa vehicular ya está registrada en el sistema.' });
    }

  } catch (error) {
    console.error('Error en registerUserWithVehicle:', error);
    return res.status(500).json({ message: 'Error interno del servidor al registrar el usuario.' });
  }
};

module.exports = {
  registerUserWithVehicle
};