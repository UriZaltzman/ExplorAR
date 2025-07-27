import express from 'express';
import {
  addActivityToFavorites,
  removeActivityFromFavorites,
  getUserFavorites,
  addRestaurantToFavorites,
  removeRestaurantFromFavorites
} from '../controllers/favorite.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// Rutas para actividades favoritas
router.post('/activities', addActivityToFavorites);
router.delete('/activities/:actividadturistica_id', removeActivityFromFavorites);

// Rutas para restaurantes favoritos
router.post('/restaurants', addRestaurantToFavorites);
router.delete('/restaurants/:restaurante_id', removeRestaurantFromFavorites);

// Obtener todos los favoritos del usuario
router.get('/', getUserFavorites);

export default router; 