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

// Público: listar usuarios y obtener por ID
router.get('/', listUsers);
router.get('/:id', getUserById);

// Crear usuario administrador (público bajo pedido del cliente)
router.post('/crear-admin', async (req, res, next) => {
  // Inyecta role = 'admin' y delega a createUser
  req.body.role = 'admin';
  return createUser(req, res, next);
});

// Administración (opcional, protegidas)
router.post('/', authenticateToken, requireAdmin, createUser);
router.put('/:id', authenticateToken, requireAdmin, updateUser);
router.delete('/:id', authenticateToken, requireAdmin, deleteUser);

export default router;


