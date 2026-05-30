const { ParkingLog, CategoriaEspacios } = require('../models');

const getDashboardStats = async (req, res) => {
  try {
    // 1. Obtener todas las categorías y sus capacidades totales
    const categorias = await CategoriaEspacios.findAll();

    // 2. Contar cuántos vehículos están ADENTRO actualmente (exitTime es NULL)
    const ocupadosTotal = await ParkingLog.count({
      where: { exitTime: null }
    });

    // 3. Calcular la capacidad total sumando todas las categorías
    const capacidadTotal = categorias.reduce((sum, cat) => sum + (cat.totalCapacity || 0), 0);

    // 4. Calcular espacios disponibles globales
    const disponiblesTotal = capacidadTotal - ocupadosTotal;

    // 5. Obtener un desglose por cada categoría (Alumnos, Docentes, etc.)
    const desgloseCategorias = await Promise.all(
      categorias.map(async (cat) => {
        const ocupadosCat = await ParkingLog.count({
          where: { categoryId: cat.id, exitTime: null }
        });
        return {
          id: cat.id,
          name: cat.name,
          total: cat.totalCapacity,
          ocupados: ocupadosCat,
          disponibles: cat.totalCapacity - ocupadosCat
        };
      })
    );

    // 6. Responder con las estadísticas calculadas
    return res.status(200).json({
      capacidadTotal,
      ocupadosTotal,
      disponiblesTotal,
      categorias: desgloseCategorias
    });

  } catch (error) {
    console.error('Error al obtener estadísticas del dashboard:', error);
    return res.status(500).json({ message: 'Error al calcular estadísticas del estacionamiento.' });
  }
};

module.exports = { getDashboardStats };