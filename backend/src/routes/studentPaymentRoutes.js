const { Router } = require('express');
const {
  createCheckoutSession,
  getCheckoutStatus
} = require('../controllers/studentPaymentController');

const router = Router();

// Public registration is deliberately separate from the admin-only user creation route.
router.post('/checkout', createCheckoutSession);
router.get('/status', getCheckoutStatus);

module.exports = router;
