const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Usuarios = sequelize.define('Usuarios', {
  name: { type: DataTypes.STRING, allowNull: false },
  matricula: { type: DataTypes.STRING, allowNull: false, unique: true },
  correo: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
  contrasena: { type: DataTypes.STRING, allowNull: false },
  roleId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'Roles', key: 'id' } },
  carreraId: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'Carreras', key: 'id' } },
  paymentStatus: {
    type: DataTypes.ENUM('not_required', 'pending', 'paid', 'failed'),
    allowNull: false,
    defaultValue: 'not_required'
  },
  stripeCheckoutSessionId: { type: DataTypes.STRING, allowNull: true, unique: true },
  stripePaymentIntentId: { type: DataTypes.STRING, allowNull: true },
  paidAt: { type: DataTypes.DATE, allowNull: true }
}, { freezeTableName: true });

module.exports = Usuarios;
