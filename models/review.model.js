import { DataTypes } from 'sequelize';

export default (sequelize) => {
  return sequelize.define('Review', {
    comment: DataTypes.TEXT,
    rating: {
      type: DataTypes.DECIMAL(2, 1),
      validate: {
        min: 0.5,
        max: 5
      }
    }
  });
};
