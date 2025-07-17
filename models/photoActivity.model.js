import { DataTypes } from 'sequelize';

export default (sequelize) => {
  return sequelize.define('PhotoActivity', {
    url: { type: DataTypes.TEXT, allowNull: false }
  });
};
