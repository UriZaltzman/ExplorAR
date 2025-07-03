const express = require('express');
const router = express.Router();

const activityRoutes = require('./routes/activity.routes');
const authRoutes = require('./routes/auth.routes');

router.use('/activities', activityRoutes);
router.use('/auth', authRoutes);

module.exports = router;
