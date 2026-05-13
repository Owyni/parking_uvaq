const express = require('express');
const cors = require('cors');
const sequelize = require('./src/config/db');

// Modelos
const Vehiculo = require('./src/models/Vehiculo');
const Usuario = require('./src/models/Usuario');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;

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