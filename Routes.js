import express from 'express';
import activityRoutes from './routes/activity.routes.js';
import authRoutes from './routes/auth.routes.js';
import favoriteRoutes from './routes/favorite.routes.js';
import reviewRoutes from './routes/review.routes.js';
import testRoutes from './routes/test.routes.js';

const router = express.Router();

// Rutas principales
router.use('/activities', activityRoutes);
router.use('/auth', authRoutes);
router.use('/favorites', favoriteRoutes);
router.use('/reviews', reviewRoutes);
router.use('/test', testRoutes);

export default router;
