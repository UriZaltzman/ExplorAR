import express from 'express';
import activityRoutes from './routes/activity.routes.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import restaurantRoutes from './routes/restaurant.routes.js';
import favoriteRoutes from './routes/favorite.routes.js';
import reviewRoutes from './routes/review.routes.js';
import testRoutes from './routes/test.routes.js';
import uploadRoutes from './routes/upload.routes.js';

const router = express.Router();

// Rutas principales (en español)
router.use('/actividades', activityRoutes);
router.use('/autenticacion', authRoutes);
router.use('/usuarios', userRoutes);
router.use('/restaurantes', restaurantRoutes);
router.use('/favoritos', favoriteRoutes);
router.use('/resenas', reviewRoutes);
router.use('/pruebas', testRoutes);
router.use('/upload', uploadRoutes);

export default router;
