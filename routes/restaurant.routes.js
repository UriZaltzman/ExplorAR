import express from 'express';
import { authenticateToken, optionalAuth } from '../middlewares/auth.middleware.js';
import {
  getRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  getRestaurantCategories,
} from '../controllers/restaurant.controller.js';

const router = express.Router();

// Rutas públicas (con auth opcional para favoritos)
router.get('/', optionalAuth, getRestaurants);
router.get('/categories', getRestaurantCategories);
router.get('/:id', optionalAuth, getRestaurantById);

// Rutas protegidas (solo admin)
router.post('/', authenticateToken, createRestaurant);
router.put('/:id', authenticateToken, updateRestaurant);
router.delete('/:id', authenticateToken, deleteRestaurant);

export default router;


