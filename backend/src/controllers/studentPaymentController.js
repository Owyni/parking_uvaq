const Stripe = require('stripe');
const { Usuarios } = require('../models');
const { createPendingStudent } = require('../services/studentRegistrationService');

const stripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    const error = new Error('Stripe no está configurado en el servidor.');
    error.statusCode = 503;
    throw error;
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY);
};

const createCheckoutSession = async (req, res) => {
  let user;
  try {
    const client = stripe();
    const price = Number(process.env.STUDENT_REGISTRATION_PRICE_MXN);
    if (!Number.isSafeInteger(price) || price < 1) {
      return res.status(503).json({
        message: 'Configura STUDENT_REGISTRATION_PRICE_MXN con el importe en pesos enteros (MXN).'
      });
    }

    // Create a pending student first; access remains blocked until the webhook confirms payment.
    user = await createPendingStudent(req.body);
    const frontendUrl = (process.env.FRONTEND_URL || 'http://localhost:4321').replace(/\/$/, '');

    const session = await client.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: user.correo,
      client_reference_id: String(user.id),
      metadata: {
        userId: String(user.id),
        role: 'Estudiante',
        purpose: 'student_registration'
      },
      line_items: [{
        quantity: 1,
        price_data: {
          currency: 'mxn',
          unit_amount: price * 100,
          product_data: { name: 'Registro de estudiante - UVAQ Parking' }
        }
      }],
      success_url: `${frontendUrl}/pago-estudiante?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}/pago-estudiante?cancelled=1`
    }, {
      idempotencyKey: `student-registration-${user.id}`
    });

    await user.update({ stripeCheckoutSessionId: session.id });
    return res.status(201).json({ checkoutUrl: session.url });
  } catch (error) {
    console.error('Error creando Checkout de estudiante:', error);
    if (user) {
      try { await user.destroy(); } catch (cleanupError) {
        console.error('No se pudo limpiar el usuario pendiente:', cleanupError);
      }
    }
    return res.status(error.statusCode || 500).json({
      message: error.statusCode ? error.message : 'No se pudo iniciar el pago. Intenta nuevamente.'
    });
  }
};

const handleStripeWebhook = async (req, res) => {
  let event;
  try {
    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      return res.status(503).send('Stripe webhook secret is not configured.');
    }
    const client = stripe();
    event = client.webhooks.constructEvent(
      req.body,
      req.headers['stripe-signature'],
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  try {
    if (event.type === 'checkout.session.completed' ||
        event.type === 'checkout.session.async_payment_succeeded') {
      const session = event.data.object;
      if (session.metadata?.purpose !== 'student_registration') {
        return res.json({ received: true });
      }
      // For delayed payment methods, only unlock access when payment_status is paid.
      if (session.payment_status !== 'paid') return res.json({ received: true });

      const userId = Number.parseInt(session.metadata.userId, 10);
      if (!Number.isInteger(userId)) return res.status(400).send('Missing student metadata.');

      const user = await Usuarios.findByPk(userId);
      if (user && user.paymentStatus !== 'paid' &&
          user.stripeCheckoutSessionId === session.id) {
        await user.update({
          paymentStatus: 'paid',
          stripePaymentIntentId: typeof session.payment_intent === 'string'
            ? session.payment_intent : null,
          paidAt: new Date()
        });
      }
    } else if (event.type === 'checkout.session.async_payment_failed') {
      const session = event.data.object;
      if (session.metadata?.purpose === 'student_registration') {
        const userId = Number.parseInt(session.metadata.userId, 10);
        if (Number.isInteger(userId)) {
          const user = await Usuarios.findByPk(userId);
          if (user && user.paymentStatus === 'pending' &&
              user.stripeCheckoutSessionId === session.id) {
            await user.update({ paymentStatus: 'failed' });
          }
        }
      }
    }

    return res.json({ received: true });
  } catch (error) {
    console.error('Error procesando webhook Stripe:', error);
    return res.status(500).json({ message: 'No se pudo procesar el evento.' });
  }
};

const getCheckoutStatus = async (req, res) => {
  try {
    const client = stripe();
    const sessionId = String(req.query.session_id || '');
    if (!sessionId || !sessionId.startsWith('cs_')) {
      return res.status(400).json({ message: 'session_id no válido.' });
    }
    const session = await client.checkout.sessions.retrieve(sessionId);
    if (session.metadata?.purpose !== 'student_registration') {
      return res.status(404).json({ message: 'No se encontró este registro.' });
    }
    return res.json({
      paymentStatus: session.payment_status,
      status: session.status
    });
  } catch (error) {
    console.error('Error consultando estado de pago:', error);
    return res.status(400).json({ message: 'No se pudo consultar el estado del pago.' });
  }
};

module.exports = { createCheckoutSession, handleStripeWebhook, getCheckoutStatus };
