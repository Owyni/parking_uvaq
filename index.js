const express = require('express');
const cors = require('cors');
const sequelize = require('./src/config/db');

// Sincronizar modelos y relaciones
require('./src/models');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;

// --- CONFIGURACIÓN DE CORS ---
const corsOptions = {
  origin: 'http://localhost:4321', // URL exacta donde corre tu frontend de Astro
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos para el estacionamiento
  allowedHeaders: ['Content-Type', 'Authorization'], // Encabezados que permites recibir
  optionsSuccessStatus: 200 // Algunas versiones de navegadores antiguos fallan con el 204
};

app.use(cors(corsOptions));
app.use(express.json());

sequelize.sync({ alter: true })
  .then(() => {
    console.log('Base de datos conectada y sincronizada');
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Error al conectar la base de datos:', err);
  });