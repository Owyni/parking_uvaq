// seed.js
const bcrypt = require('bcryptjs');
const { 
  sequelize, 
  Roles, 
  Carreras, 
  Colores, 
  CategoriaEspacios,
  Usuarios 
} = require('./src/models');

const startSeeding = async () => {
  try {
    await sequelize.authenticate();
    console.log('📦 Conexión establecida para el sembrado...');

    // 1. Vaciamos las tablas y reiniciamos los IDs antes de sembrar
    await sequelize.query('TRUNCATE TABLE "Usuarios" RESTART IDENTITY CASCADE;'); // Limpieza de usuarios
    await sequelize.query('TRUNCATE TABLE "Roles" RESTART IDENTITY CASCADE;');
    await sequelize.query('TRUNCATE TABLE "Colores" RESTART IDENTITY CASCADE;');
    await sequelize.query('TRUNCATE TABLE "Carreras" RESTART IDENTITY CASCADE;');
    await sequelize.query('TRUNCATE TABLE "CategoriaEspacios" RESTART IDENTITY CASCADE;');
    console.log('🧹 Tablas limpiadas y contadores reiniciados.');

    // 2. Insertamos los roles de forma limpia
    await Roles.bulkCreate([
      { name: 'Administrador' }, // ID 1
      { name: 'Estudiante' },    // ID 2
      { name: 'Docente' },       // ID 3
      { name: 'Visitante' },     // ID 4
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

    // 3. ENCRIPTACIÓN Y CREACIÓN DEL PRIMER ADMINISTRADOR
    const contraseñaEncriptada = await bcrypt.hash('admin123', 10);

    await Usuarios.create({
      name: 'Administrador Principal UVAQ',
      matricula: 'ADMIN01',
      correo: 'admin@uvaq.edu.mx',
      contrasena: contraseñaEncriptada, // El hash seguro
      roleId: 1,                        // ID del rol 'Administrador'
      carreraId: null
    });

    console.log('✅ ¡Base de datos sembrada y Administrador creado con éxito!');
    console.log('🧑‍💻 Credenciales de prueba -> Correo: admin@uvaq.edu.mx | Password: admin123');
    process.exit();
  } catch (error) {
    console.error('❌ Error al sembrar:', error);
    process.exit(1);
  }
};

startSeeding();