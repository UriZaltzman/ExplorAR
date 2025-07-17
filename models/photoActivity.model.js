const { DataTypes } = import('sequelize');
const sequelize = import('../db');

const PhotoActivity = sequelize.define('PhotoActivity', {
  url: { type: DataTypes.TEXT, allowNull: false }
});

module.exports = PhotoActivity;
