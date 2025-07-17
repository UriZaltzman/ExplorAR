const sequelize = import('./db');

const User = import('./models/user.model');
const Activity = import('./models/activity.model');
const Category = import('./models/category.model');
const DateActivity = import('./models/dateActivity.model');
const PhotoActivity = import('./models/photoActivity.model');
const Review = import('./models/review.model');
const Favorite = import('./models/favorite.model');

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
