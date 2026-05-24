//importaciones de las rutas y verificacion de token
import { Router } from 'express';
import userRouter from './user.routes.js';
import authRouter from './auth.routes.js';
import verifyToken from '../middleware/verifyToken.js';

const router = Router();
router.use('/auth', authRouter);
router.use('/users', verifyToken, userRouter);

const express = require('express');
const router = express.Router();
const { login } = require('../controllers/authController');

router.post('/login', login);

module.exports = router;


//aqui importas el userRouter para que ya acceda a las rutas

export default router;