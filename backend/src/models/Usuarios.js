const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Usuarios = sequelize.define('Usuarios', {
  name: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  matricula: { 
    type: DataTypes.STRING, 
    allowNull: false, 
    unique: true 
  },
  correo: { 
    type: DataTypes.STRING, 
    allowNull: false, 
    unique: true, 
    validate: { 
      isEmail: true 
    } 
  },
  // ¡Agregamos la contraseña!
  contrasena: {
    type: DataTypes.STRING,
    allowNull: false
  },
  // Agregamos la llave foránea para vincularlo con la tabla Roles
  roleId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Roles',
      key: 'id'
    }
  },
  // Agregamos la llave foránea para vincularlo con la tabla Carreras
  carreraId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Carreras',
      key: 'id'
    }
  }
}, { 
  freezeTableName: true 
});

module.exports = Usuarios;