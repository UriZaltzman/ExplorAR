import express from 'express';
import {
  createActivityReview,
  createRestaurantReview,
  getActivityReviews,
  getRestaurantReviews,
  updateReview,
  deleteReview,
  getUserReviews
} from '../controllers/review.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Rutas públicas (para ver reseñas)
router.get('/activities/:actividadturistica_id', getActivityReviews);
router.get('/restaurants/:restaurante_id', getRestaurantReviews);

// Rutas protegidas (requieren autenticación)
router.use(authenticateToken);

// Crear reseñas
router.post('/activities', createActivityReview);
router.post('/restaurants', createRestaurantReview);

// Gestionar reseñas propias
router.put('/:review_id', updateReview);
router.delete('/:review_id', deleteReview);
router.get('/user', getUserReviews);

export default router; 