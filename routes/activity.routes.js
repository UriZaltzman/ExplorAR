const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const { getAllActivities, getActivityById } = require('../controllers/activity.controller');

router.get('/', getAllActivities);
router.get('/:id', getActivityById);



router.post('/', authMiddleware, createActivity);


module.exports = router;
