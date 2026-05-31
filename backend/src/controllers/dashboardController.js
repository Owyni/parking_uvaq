const { Usuarios, ControlAccesos, CategoriaEspacios } = require('../models');
const { Op } = require('sequelize');

const getDashboardStats = async (req, res) => {
  try {
    const usuariosRegistrados = await Usuarios.count();

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    
    const entradasHoy = await ControlAccesos.count({
      where: {
        createdAt: {
          [Op.gte]: startOfDay
        }
      }
    });

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const reportesMes = await ControlAccesos.count({
      where: {
        createdAt: {
          [Op.gte]: startOfMonth
        }
      }
    });

    const capacidadTotal = await CategoriaEspacios.sum('totalCapacity') || 0;
    
    const vehiculosDentro = await ControlAccesos.count({
      where: {
        updatedAt: {
          [Op.is]: null
        }
      }
    });

    const espaciosDisponibles = capacidadTotal - vehiculosDentro;

    // Envío el JSON armado exactamente como el frontend lo espera
    return res.status(200).json({
      usuariosRegistrados,
      espaciosDisponibles,
      entradasHoy,
      reportesMes
    });

  } catch (error) {
    console.error('Error calculando las estadísticas del dashboard:', error);
    return res.status(500).json({ message: 'Error interno obteniendo estadísticas' });
  }
};

module.exports = {
  getDashboardStats
};