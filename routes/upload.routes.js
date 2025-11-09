import express from 'express';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import { uploadSingle, uploadMultiple, uploadImage, uploadImages } from '../controllers/upload.controller.js';

const router = express.Router();

// Ruta para subir una imagen (requiere autenticación)
router.post('/single', authenticateToken, uploadSingle, uploadImage);

// Ruta para subir múltiples imágenes (requiere autenticación)
router.post('/multiple', authenticateToken, uploadMultiple, uploadImages);

export default router;

