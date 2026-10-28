const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const sequelize = require('./src/config/db');

require('./src/models');

const app = express();
const PORT = Number(process.env.PORT || 3000);

app.use(helmet());

const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:4321')
  .split(',')
  .map((origin) => origin.trim().replace(/\/$/, ''));
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Origen no permitido por CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
}));

// Stripe requires the unparsed body to verify the webhook signature.
app.post(
  '/api/payments/stripe/webhook',
  express.raw({ type: 'application/json' }),
  require('./src/controllers/studentPaymentController').handleStripeWebhook
);

app.use(express.json());

app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/usuarios', require('./src/routes/userRoutes'));
app.use('/api/payments/stripe', require('./src/routes/studentPaymentRoutes'));
app.use('/api/dashboard', require('./src/routes/dashboardRoutes'));
app.use('/api/parking', require('./src/routes/parkingRoutes'));

sequelize.sync({ alter: true })
  .then(() => {
    console.log('✅ Base de datos conectada y sincronizada');
    app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('❌ Error al conectar la base de datos:', err);
    process.exitCode = 1;
  });
