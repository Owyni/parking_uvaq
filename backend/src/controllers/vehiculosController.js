const vehiculosService = require('../services/vehiculosService');

const getMisVehiculos = async (req, res) => {
  try {
    // req.matricula viene del token decodificado en auth.js
    const vehiculos = await vehiculosService.obtenerVehiculosPorMatricula(req.matricula);
    res.status(200).json(vehiculos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createVehiculo = async (req, res) => {
  try {
    const vehiculo = await vehiculosService.crearVehiculo(req.matricula, req.body);
    res.status(201).json(vehiculo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateVehiculo = async (req, res) => {
  try {
    const { id } = req.params;
    const vehiculoActualizado = await vehiculosService.actualizarVehiculo(id, req.matricula, req.body);
    res.status(200).json(vehiculoActualizado);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteVehiculo = async (req, res) => {
  try {
    const { id } = req.params;
    await vehiculosService.eliminarVehiculo(id, req.matricula);
    res.status(200).json({ message: 'Vehículo eliminado correctamente' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getMisVehiculos,
  createVehiculo,
  updateVehiculo,
  deleteVehiculo
};