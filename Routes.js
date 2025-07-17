import express from 'express';
import activityRoutes from './routes/activity.routes.js';
import authRoutes from './routes/auth.routes.js';

const router = express.Router();

router.use('/activities', activityRoutes);
router.use('/auth', authRoutes);

export default router;
