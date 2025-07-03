const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Favorite = sequelize.define('Favorite', {}, { timestamps: false });

module.exports = Favorite;
