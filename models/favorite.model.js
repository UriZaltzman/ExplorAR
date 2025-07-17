import { DataTypes } from 'sequelize';

export default (sequelize) => {
  return sequelize.define('Favorite', {}, { timestamps: false });
};
