const express = require('express');
const cors = require('cors');
const helmet = require('helmet'); // 1. Importas Helmet
const sequelize = require('./src/config/db');

// Sincronizar modelos y relaciones
require('./src/models');

const app = express();
const PORT = 3000;

// --- MIDDLEWARES DE SEGURIDAD ---
app.use(helmet()); // 2. Helmet para proteger contra vulnerabilidades comunes (XSS, clickjacking, etc.)

// --- CONFIGURACIÓN DE CORS (CORREGIDO) ---
const corsOptions = {
  origin: 'http://localhost:4321', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  allowedHeaders: ['Content-Type', 'Authorization'], 
  optionsSuccessStatus: 200 
};
app.use(cors(corsOptions)); // Cors con sus configuraciones

// Middleware para entender JSON
app.use(express.json());

// --- RUTAS ---
app.use('/api/auth', require('./src/routes/authRoutes'));
// app.use('/api/users', require('./src/routes/userRoutes'));

// Sincronización de Base de Datos
sequelize.sync({ alter: true })
  .then(() => {
    console.log('✅ Base de datos conectada y sincronizada');
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Error al conectar la base de datos:', err);
  });