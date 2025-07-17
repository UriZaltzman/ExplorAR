import express from 'express';
import { getAllActivities, getActivityById } from '../controllers/activity.controller.js';

const router = express.Router();

router.get('/', getAllActivities);
router.get('/:id', getActivityById);

export default router;
