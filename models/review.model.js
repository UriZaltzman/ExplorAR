const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Review = sequelize.define('Review', {
  comment: DataTypes.TEXT,
  rating: {
    type: DataTypes.DECIMAL(2, 1),
    validate: {
      min: 0.5,
      max: 5
    }
  }
});

module.exports = Review;
