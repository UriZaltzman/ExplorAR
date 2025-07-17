const { DataTypes } = import('sequelize');
const sequelize = import('../db');

const Favorite = sequelize.define('Favorite', {}, { timestamps: false });

module.exports = Favorite;
