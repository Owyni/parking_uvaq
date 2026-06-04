import { Router } from 'express';
import userRouter from './user.routes.js';
import authRouter from './auth.routes.js';
import verifyToken from '../middleware/verifyToken.js';

const router = Router();
router.use('/auth', authRouter);
router.use('/users', verifyToken, userRouter);

const express = require('express');
const router = express.Router();
const { login } = require('../controllers/authController.js');

router.post('/login', login);

module.exports = router;

export default router;