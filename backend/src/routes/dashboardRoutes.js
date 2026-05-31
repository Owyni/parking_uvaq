const { Router } = require('express');
const { getDashboardStats } = require('../controllers/dashboardController');
const { verifyAccessToken } = require('../middleware/auth');

const router = Router();

router.get('/stats', verifyAccessToken, getDashboardStats);

module.exports = router;