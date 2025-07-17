const { DataTypes } = import('sequelize');
const sequelize = import('../db');

const User = sequelize.define('User', {
  name: DataTypes.STRING,
  lastName: DataTypes.STRING,
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: DataTypes.STRING,
  dni: { type: DataTypes.STRING(8), allowNull: false },
  role: { type: DataTypes.ENUM('user', 'admin'), defaultValue: 'user' }
});

module.exports = User;
