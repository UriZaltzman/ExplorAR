const { DataTypes } = import('sequelize');
const sequelize = import('../db');

const DateActivity = sequelize.define('DateActivity', {
  date: { type: DataTypes.DATEONLY },
  startTime: { type: DataTypes.TIME }
});

module.exports = DateActivity;
