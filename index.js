const express = require('express');
const cors = require('cors');
const sequelize = require('./src/config/db');

// Modelos
const Vehiculo = require('./src/models/Vehiculos');
const Usuario = require('./src/models/Usuarios');
const ParkingLog = require('./src/models/ControlAccesos');
const ParkingCategory = require('./src/models/CategoriaEspacios');
const Role = require('./src/models/Roles');
const Carrera = require('./src/models/Carreras');
const Color = require('./src/models/Colores');
const TipoVehiculo = require('./src/models/TipoVehiculos');

// Sincronizar modelos y relaciones
require('./src/models');

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