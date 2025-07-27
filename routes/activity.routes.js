import express from 'express';
import {
  getActivities,
  getActivityById,
  createActivity,
  updateActivity,
  deleteActivity,
  getCategories
} from '../controllers/activity.controller.js';
import { authenticateToken, requireAdmin, optionalAuth } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Rutas públicas (con autenticación opcional para favoritos)
router.get('/', optionalAuth, getActivities);
router.get('/categories', getCategories);
router.get('/:id', optionalAuth, getActivityById);

// Rutas protegidas (solo admin)
router.post('/', authenticateToken, requireAdmin, createActivity);
router.put('/:id', authenticateToken, requireAdmin, updateActivity);
router.delete('/:id', authenticateToken, requireAdmin, deleteActivity);

export default router;
