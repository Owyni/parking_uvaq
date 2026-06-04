const { Router } = require('express');
const { registrarUsuario, registrarVisitante } = require('../controllers/userController');
const { verifyAccessToken } = require('../middleware/auth');

const router = Router();

// Endpoint: POST http://localhost:3000/api/usuarios/registro
router.post('/registro', verifyAccessToken, registrarUsuario);

// Endpoint: POST http://localhost:3000/api/usuarios/visitante
router.post('/visitante', verifyAccessToken, registrarVisitante);

module.exports = router;