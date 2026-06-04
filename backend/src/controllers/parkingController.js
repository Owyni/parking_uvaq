const { ControlAccesos, Vehiculos } = require('../models');
const { Op } = require('sequelize');

const registrarEntrada = async (req, res) => {
  try {
    const { vehiculoId, observations } = req.body;

    if (!vehiculoId) {
      return res.status(400).json({ message: 'El ID o Placa del vehículo es requerido.' });
    }

    let vehiculo = null;
    const stringId = String(vehiculoId).trim();

    if (/^\d+$/.test(stringId)) {
      vehiculo = await Vehiculos.findByPk(parseInt(stringId, 10));
    }
    
    if (!vehiculo) {
      vehiculo = await Vehiculos.findOne({ 
        where: { 
          placa: { [Op.like]: `%${stringId}%` } 
        } 
      });
    }

    if (!vehiculo) {
      return res.status(404).json({ message: 'Vehículo no encontrado en el sistema. Verifica el ID o Placa.' });
    }

    // 1. CORRECCIÓN AQUÍ: Usamos vehicleId
    const accesoActivo = await ControlAccesos.findOne({
      where: { 
        vehicleId: vehiculo.id, 
        exitTime: null 
      }
    });

    if (accesoActivo) {
      return res.status(400).json({ message: `El vehículo con placa ${vehiculo.placa} ya se encuentra dentro.` });
    }

    // 2. CORRECCIÓN AQUÍ: Usamos vehicleId
    const nuevoAcceso = await ControlAccesos.create({
      vehicleId: vehiculo.id,
      entryTime: new Date(),
      observations: observations || ''
    });

    return res.status(201).json({ 
      message: 'Entrada registrada exitosamente', 
      acceso: nuevoAcceso 
    });

  } catch (error) {
    console.error('❌ Error exacto en registrarEntrada:', error);
    return res.status(500).json({ message: 'Error interno del servidor al procesar la entrada.' });
  }
};

const registrarSalida = async (req, res) => {
  try {
    const { placa } = req.body;

    const vehiculo = await Vehiculos.findOne({ where: { placa } });
    if (!vehiculo) {
      return res.status(404).json({ message: 'Vehículo no encontrado con esa placa.' });
    }

    // 3. CORRECCIÓN AQUÍ TAMBIÉN: Usamos vehicleId para que la salida no falle
    const accesoActivo = await ControlAccesos.findOne({
      where: { 
        vehicleId: vehiculo.id, 
        exitTime: null 
      }
    });

    if (!accesoActivo) {
      return res.status(400).json({ message: 'Este vehículo no registra ninguna entrada activa.' });
    }

    accesoActivo.exitTime = new Date();
    await accesoActivo.save();

    return res.status(200).json({ 
      message: 'Salida registrada correctamente', 
      acceso: accesoActivo 
    });

  } catch (error) {
    console.error('❌ Error exacto en registrarSalida:', error);
    return res.status(500).json({ message: 'Error interno al procesar la salida.' });
  }
};

module.exports = {
  registrarEntrada,
  registrarSalida
};