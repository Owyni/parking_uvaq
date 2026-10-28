# Integración de Stripe para el registro de estudiantes

## Flujo

1. El estudiante completa el formulario público de registro.
2. El backend crea el usuario con `paymentStatus=pending` y genera una Checkout Session de Stripe.
3. El navegador redirige al Checkout alojado por Stripe.
4. El webhook firmado `checkout.session.completed` marca al alumno como `paid` únicamente cuando Stripe informa `payment_status=paid`.
5. El inicio de sesión rechaza a los estudiantes que todavía no tengan el pago confirmado.

El endpoint administrativo existente `POST /api/usuarios/registro` sigue protegido por JWT. Este nuevo flujo público usa `POST /api/payments/stripe/checkout`.

## Configuración

1. Instala dependencias desde `backend`: `npm install`.
2. Copia `.env.example` a `.env` y configura la conexión PostgreSQL, `JWT_SECRET`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STUDENT_REGISTRATION_PRICE_MXN` y `FRONTEND_URL`.
3. Inicia el backend con `npm run dev`.
4. En desarrollo instala Stripe CLI y reenvía eventos: `stripe listen --forward-to localhost:3000/api/payments/stripe/webhook`. Copia el secreto `whsec_...` que entrega el CLI a `STRIPE_WEBHOOK_SECRET`.
5. En el Dashboard de Stripe usa claves de prueba y la tarjeta de prueba documentada por Stripe. No uses claves live hasta terminar las pruebas de extremo a extremo.

## API

- `POST /api/payments/stripe/checkout`: recibe `name`, `matricula`, `correo`, `contrasena` y opcionalmente `carreraId`. Devuelve `checkoutUrl`.
- `GET /api/payments/stripe/status?session_id=cs_...`: consulta el estado de la Checkout Session. No concede acceso por sí solo; la base de datos solo se habilita por webhook.

El importe lo fija exclusivamente el servidor a partir de `STUDENT_REGISTRATION_PRICE_MXN`; nunca se acepta del navegador. La clave secreta vive solo en backend. El webhook valida la firma con el cuerpo HTTP sin parsear.

## Importante antes de producción

- Confirma con la administración de la UVAQ el importe real, qué incluye y la política de reembolso.
- Despliega con HTTPS, configura el webhook de producción y guarda sus secretos en el gestor de variables de entorno del host.
- Revisa retención de registros incompletos y elimina los datos personales de intentos abandonados según la política institucional.
- En esta primera versión se acepta tarjeta mediante Checkout. Otros métodos pueden liquidarse de forma asíncrona; el acceso solo se activa al confirmar el pago.
- La sincronización `sequelize.sync({ alter: true })` está en el arranque actual del proyecto; para producción, usa migraciones versionadas revisadas y respaldos antes de cambiar el esquema.
