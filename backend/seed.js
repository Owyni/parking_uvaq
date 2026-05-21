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

    await Roles.bulkCreate([
      { name: 'Estudiante' },
      { name: 'Docente' },
      { name: 'Visitante' },
      { name: 'Administrativo' }
    ], { ignoreDuplicates: true });

    await Colores.bulkCreate([
      { name: 'Blanco' }, { name: 'Negro' }, { name: 'Gris' }, 
      { name: 'Rojo' }, { name: 'Azul' }
    ], { ignoreDuplicates: true });

    await Carreras.bulkCreate([
        { name: 'Sistemas Computacionales' },
        { name: 'Derecho' },
        { name: 'Medicina' },
        { name: 'Arquitectura' }
    ], { ignoreDuplicates: true });

    await CategoriaEspacios.bulkCreate([
      { name: 'Alumnos', totalCapacity: 200 },
      { name: 'Docentes', totalCapacity: 50 },
      { name: 'Oficiales', totalCapacity: 15 }
    ], { ignoreDuplicates: true });

    console.log('✅ ¡Base de datos sembrada con éxito!');
    process.exit();
  } catch (error) {
    console.error('❌ Error al sembrar:', error);
    process.exit(1);
  }
};

startSeeding();