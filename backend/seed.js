// seed.js
const { 
  sequelize, 
  Roles, 
  Carreras, 
  Colores, 
  CategoriaEspacios 
} = require('./src/models');

const startSeeding = async () => {
  try {
    await sequelize.authenticate();
    console.log('📦 Conexión establecida para el sembrado...');

    // 1. Vaciamos las tablas y reiniciamos los IDs antes de sembrar
    await sequelize.query('TRUNCATE TABLE "Roles" RESTART IDENTITY CASCADE;');
    await sequelize.query('TRUNCATE TABLE "Colores" RESTART IDENTITY CASCADE;');
    await sequelize.query('TRUNCATE TABLE "Carreras" RESTART IDENTITY CASCADE;');
    await sequelize.query('TRUNCATE TABLE "CategoriaEspacios" RESTART IDENTITY CASCADE;');
    console.log('🧹 Tablas limpiadas y contadores reiniciados.');

    // 2. Insertamos los datos de forma limpia y directa
    await Roles.bulkCreate([
      { name: 'Estudiante' },
      { name: 'Docente' },
      { name: 'Visitante' },
      { name: 'Administrativo' }
    ]);

    await Colores.bulkCreate([
      { name: 'Blanco' }, { name: 'Negro' }, { name: 'Gris' }, 
      { name: 'Rojo' }, { name: 'Azul' }
    ]);

    await Carreras.bulkCreate([
        { name: 'Sistemas Computacionales' },
        { name: 'Derecho' },
        { name: 'Medicina' },
        { name: 'Arquitectura' }
    ]);

    await CategoriaEspacios.bulkCreate([
      { name: 'Alumnos', totalCapacity: 200 },
      { name: 'Docentes', totalCapacity: 50 },
      { name: 'Oficiales', totalCapacity: 15 }
    ]);

    console.log('✅ ¡Base de datos sembrada con éxito desde cero!');
    process.exit();
  } catch (error) {
    console.error('❌ Error al sembrar:', error);
    process.exit(1);
  }
};

startSeeding();