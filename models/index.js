import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

import UserModel from './user.model.js';
import ActivityModel from './activity.model.js';
const User = UserModel(sequelize);
const Activity = ActivityModel(sequelize);
User.hasMany(Activity, { foreignKey: 'userId' });
Activity.belongsTo(User, { foreignKey: 'userId' });
export {
  sequelize,
  User,
  Activity,
};
