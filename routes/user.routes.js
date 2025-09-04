import express from 'express';
import { authenticateToken, requireAdmin } from '../middlewares/auth.middleware.js';
import {
  createUser,
  listUsers,
  getUserById,
  updateUser,
  deleteUser,
} from '../controllers/user.controller.js';

const router = express.Router();

// Administración de usuarios (solo admin)
router.get('/', authenticateToken, requireAdmin, listUsers);
router.get('/:id', authenticateToken, requireAdmin, getUserById);
router.post('/', authenticateToken, requireAdmin, createUser);
router.put('/:id', authenticateToken, requireAdmin, updateUser);
router.delete('/:id', authenticateToken, requireAdmin, deleteUser);

export default router;


