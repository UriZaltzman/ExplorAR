const { DataTypes } = import('sequelize');
const sequelize = import('../db');

const Activity = sequelize.define('Activity', {
  name: { type: DataTypes.STRING, allowNull: false },
  description: DataTypes.TEXT,
  duration: DataTypes.INTEGER,
  contact: DataTypes.STRING,
  address: DataTypes.STRING,
  latitude: DataTypes.DECIMAL(9, 6),
  longitude: DataTypes.DECIMAL(9, 6),
  price: DataTypes.DECIMAL(10, 2),
  deposit: DataTypes.DECIMAL(10, 2)
});

module.exports = Activity;
