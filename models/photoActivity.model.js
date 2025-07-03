const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const PhotoActivity = sequelize.define('PhotoActivity', {
  url: { type: DataTypes.TEXT, allowNull: false }
});

module.exports = PhotoActivity;
