const express = import('express');
const router = express.Router();

const activityRoutes = import('./routes/activity.routes');
const authRoutes = import('./routes/auth.routes');

router.use('/activities', activityRoutes);
router.use('/auth', authRoutes);

module.exports = router;
