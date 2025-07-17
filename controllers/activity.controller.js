const { Activity, Category, PhotoActivity, DateActivity } = import('../models');
const { Op } = import('sequelize');

// Listado + filtros
const getAllActivities = async (req, res) => {
  try {
    const { name, category } = req.query;
    const where = {};

    if (name) {
      where.name = { [Op.iLike]: `%${name}%` };
    }

    if (category) {
      where.categoryId = category;
    }

    const activities = await Activity.findAll({
      where,
      include: [Category, PhotoActivity]
    });

    res.json(activities);
  } catch (err) {
    res.status(500).json({ message: 'Error loading activities' });
  }
};

// Ficha completa
const getActivityById = async (req, res) => {
  try {
    const activity = await Activity.findByPk(req.params.id, {
      include: [Category, DateActivity, PhotoActivity]
    });

    if (!activity) return res.status(404).json({ message: 'Activity not found' });

    res.json(activity);
  } catch (err) {
    res.status(500).json({ message: 'Error loading activity' });
  }
};

module.exports = {
  getAllActivities,
  getActivityById
};
