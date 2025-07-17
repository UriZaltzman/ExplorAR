const sequelize = require('./db');

const User = require('./models/user.model');
const Activity = require('./models/activity.model');
const Category = require('./models/category.model');
const DateActivity = require('./models/dateActivity.model');
const PhotoActivity = require('./models/photoActivity.model');
const Review = require('./models/review.model');
const Favorite = require('./models/favorite.model');

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

module.exports = {
  sequelize,
  User,
  Activity,
  Category,
  DateActivity,
  PhotoActivity,
  Review,
  Favorite
};
