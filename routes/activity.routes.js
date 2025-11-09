import express from 'express';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import { getActivities, getActivityById, createActivity, updateActivity, deleteActivity } from '../controllers/activity.controller.js';

const router = express.Router();

// Rutas públicas
router.get('/', getActivities);
router.get('/:id', getActivityById);

// Rutas protegidas (solo admin)
router.post('/', authenticateToken, createActivity);
router.put('/:id', authenticateToken, updateActivity);
router.delete('/:id', authenticateToken, deleteActivity);

export default router;
