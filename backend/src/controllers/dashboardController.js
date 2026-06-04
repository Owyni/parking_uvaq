// src/controllers/dashboard.controller.js
const { Usuarios, ControlAccesos, CategoriaEspacios, Vehiculos, Roles, TipoVehiculos } = require('../models');
const { Op } = require('sequelize');

const getDashboardStats = async (req, res) => {
  try {
    // ==========================================
    // 1. MÉTRICAS GLOBALES (Las que ya tenías)
    // ==========================================
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
    
    // ==========================================
    // 2. MÉTRICAS AVANZADAS DEL DASHBOARD
    // ==========================================
    
    // Obtener vehículos actualmente en el estacionamiento (con todas sus relaciones)
    const accesosActivos = await ControlAccesos.findAll({
      where: {
        exitTime: {
          [Op.is]: null
        }
      },
      include: [
        {
          model: Vehiculos,
          include: [
            { model: Usuarios, include: [{ model: Roles }] },
            { model: TipoVehiculos } // Quita esta línea si no tienes tabla TipoVehiculos
          ]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    const vehiculosDentro = accesosActivos.length;
    const espaciosDisponibles = capacidadTotal - vehiculosDentro;
    const espaciosTotales = capacidadTotal; // Se manda para las gráficas

    // 3. Actividad Reciente (Últimos 5 movimientos, calculados por el ID para abarcar entradas/salidas)
    const ultimosMovimientos = await ControlAccesos.findAll({
      limit: 5,
      order: [['id', 'DESC']], 
      include: [{ model: Vehiculos, include: [{ model: Usuarios }] }]
    });

    const actividadReciente = ultimosMovimientos.map(mov => {
      // Si exitTime no es nulo, significa que ya salió
      const esSalida = mov.exitTime !== null; 
      return {
        tipo: esSalida ? 'Salida' : 'Entrada',
        placa: mov.Vehiculo?.placa || 'Desconocida',
        propietario: mov.Vehiculo?.Usuario?.name || 'Desconocido',
        hora: esSalida ? mov.exitTime : mov.createdAt
      };
    });

    // 4. Mapeo para la tabla principal (Vehículos actuales)
    const vehiculosEnEstacionamiento = accesosActivos.map(acceso => {
      const entrada = new Date(acceso.createdAt);
      const ahora = new Date();
      const diffMs = ahora - entrada;
      const diffHrs = Math.floor(diffMs / 3600000);
      const diffMins = Math.floor((diffMs % 3600000) / 60000);

      return {
        placa: acceso.Vehiculo?.placa || 'Desconocida',
        propietario: acceso.Vehiculo?.Usuario?.name || 'Desconocido',
        rol: acceso.Vehiculo?.Usuario?.Role?.name || 'No definido',
        tipo: acceso.Vehiculo?.TipoVehiculo?.name || 'Auto',
        horaEntrada: entrada.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }),
        duracion: `${diffHrs}h ${diffMins}min`,
        estado: diffHrs >= 3 ? 'Prolongado' : 'Activo'
      };
    });

    // 5. Distribución por Tipo de Rol
    const distribucion = { Estudiantes: 0, Docentes: 0, Administrativos: 0, Visitantes: 0 };
    
    accesosActivos.forEach(acceso => {
      const nombreRol = acceso.Vehiculo?.Usuario?.Role?.name || '';
      if (nombreRol.includes('Estudiante')) distribucion.Estudiantes++;
      else if (nombreRol.includes('Docente')) distribucion.Docentes++;
      else if (nombreRol.includes('Administrativo')) distribucion.Administrativos++;
      else distribucion.Visitantes++;
    });

    // ==========================================
    // 3. ENVÍO DEL JSON AL FRONTEND
    // ==========================================
    return res.status(200).json({
      // Datos originales que usa tu Index
      usuariosRegistrados,
      espaciosDisponibles,
      entradasHoy,
      reportesMes,
      
      // Datos nuevos que consumirá el Dashboard
      espaciosTotales,
      vehiculosDentro,
      actividadReciente,
      vehiculosEnEstacionamiento,
      distribucion
    });

  } catch (error) {
    console.error('Error calculando las estadísticas del dashboard:', error);
    return res.status(500).json({ message: 'Error interno obteniendo estadísticas' });
  }
};

module.exports = {
  getDashboardStats
};