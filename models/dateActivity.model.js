const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const DateActivity = sequelize.define('DateActivity', {
  date: { type: DataTypes.DATEONLY },
  startTime: { type: DataTypes.TIME }
});

module.exports = DateActivity;
