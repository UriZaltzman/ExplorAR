import sequelize from './db.js';
import UserModel from './models/user.model.js';
import ActivityModel from './models/activity.model.js';
import CategoryModel from './models/category.model.js';
import DateActivityModel from './models/dateActivity.model.js';
import PhotoActivityModel from './models/photoActivity.model.js';
import ReviewModel from './models/review.model.js';
import FavoriteModel from './models/favorite.model.js';

const User = UserModel(sequelize);
const Activity = ActivityModel(sequelize);
const Category = CategoryModel(sequelize);
const DateActivity = DateActivityModel(sequelize);
const PhotoActivity = PhotoActivityModel(sequelize);
const Review = ReviewModel(sequelize);
const Favorite = FavoriteModel(sequelize);

// Relaciones
Category.hasMany(Activity);
Activity.belongsTo(Category);

Activity.hasMany(DateActivity);
DateActivity.belongsTo(Activity);

Activity.hasMany(PhotoActivity);
PhotoActivity.belongsTo(Activity);

Activity.hasMany(Review);
Review.belongsTo(Activity);

User.hasMany(Favorite);
Favorite.belongsTo(User);

Activity.hasMany(Favorite);
Favorite.belongsTo(Activity);

export {
  sequelize,
  User,
  Activity,
  Category,
  DateActivity,
  PhotoActivity,
  Review,
  Favorite
};
