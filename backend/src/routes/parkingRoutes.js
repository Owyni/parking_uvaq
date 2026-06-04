const express = require('express');
const router = express.Router();
const { registrarEntrada, registrarSalida } = require('../controllers/parkingController');

// Cuando el frontend haga un POST a /api/parking/entrada, se ejecutará este controlador
router.post('/entrada', registrarEntrada);
router.put('/salida', registrarSalida);

module.exports = router;