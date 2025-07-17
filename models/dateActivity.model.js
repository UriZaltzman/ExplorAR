import { DataTypes } from 'sequelize';

export default (sequelize) => {
  return sequelize.define('DateActivity', {
    date: { type: DataTypes.DATEONLY },
    startTime: { type: DataTypes.TIME }
  });
};
