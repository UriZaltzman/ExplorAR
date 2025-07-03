const express = require('express');
const router = express.Router();
const { getAllActivities, getActivityById } = require('../controllers/activity.controller');

router.get('/', getAllActivities);
router.get('/:id', getActivityById);

module.exports = router;
