const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes'); 
const userRoutes = require('./userRoutes'); 
const vehiculosRoutes = require('./vehiculosRoutes'); 

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/vehiculos', vehiculosRoutes);

module.exports = router;