const { DataTypes } = import('sequelize');
const sequelize = import('../db');

const Category = sequelize.define('Category', {
  name: { type: DataTypes.STRING, allowNull: false }
});

module.exports = Category;
