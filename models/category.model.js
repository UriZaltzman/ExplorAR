import { DataTypes } from 'sequelize';

export default (sequelize) => {
  return sequelize.define('Category', {
    name: { type: DataTypes.STRING, allowNull: false }
  });
};
