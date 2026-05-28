const express = require('express');
const router = express.Router();
const { registerUserWithVehicle } = require('../controllers/userController');
const { verifyAdminToken } = require('../middlewares/authMiddleware');

// La ruta primero pasa por verifyAdminToken. Si el token falla, ahí se detiene.
router.post('/register', verifyAdminToken, registerUserWithVehicle);

module.exports = router;