import express from 'express';
import { testConnection, testCreateUser } from '../controllers/test.controller.js';

const router = express.Router();

router.get('/db-test', testConnection);
router.post('/create-user', testCreateUser);

export default router; 