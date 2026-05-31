const { Router } = require('express');
const { registrarUsuario } = require('../controllers/userController');
const { verifyAccessToken } = require('../middleware/auth');

const router = Router();

// Endpoint: POST http://localhost:3000/api/usuarios/registro
router.post('/registro', verifyAccessToken, registrarUsuario);

module.exports = router;