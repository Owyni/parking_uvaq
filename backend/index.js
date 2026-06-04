const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const sequelize = require('./src/config/db');

require('./src/models');

const app = express();
const PORT = 3000;

// --- MIDDLEWARES DE SEGURIDAD ---
app.use(helmet()); // Helmet para proteger contra vulnerabilidades comunes (XSS, clickjacking, etc.)

// --- CONFIGURACIÓN DE CORS ---
const corsOptions = {
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  allowedHeaders: ['Content-Type', 'Authorization'], 
  optionsSuccessStatus: 200 
};

app.use(cors(corsOptions)); // Cors con sus configuraciones

// Middleware para entender JSON
app.use(express.json()); 

// --- RUTAS ---
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/usuarios', require('./src/routes/userRoutes'));
app.use('/api/dashboard', require('./src/routes/dashboardRoutes'));

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