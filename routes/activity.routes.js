import express from 'express';
import { getActivities, getActivityById } from '../controllers/activity.controller.js';

const router = express.Router();

// Listar actividades de forma clara
router.get('/', getActivities);
router.get('/:id', getActivityById);

export default router;
