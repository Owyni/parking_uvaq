const express = require('express');
const router = express.Router();
const { 
  getMisVehiculos, 
  createVehiculo, 
  updateVehiculo, 
  deleteVehiculo 
} = require('../controllers/vehiculosController');
const { verifyAccessToken } = require('../middleware/auth');

router.use(verifyAccessToken);

router.get('/mis-vehiculos', getMisVehiculos);
router.post('/', createVehiculo);
router.put('/:id', updateVehiculo);
router.delete('/:id', deleteVehiculo);

module.exports = router;