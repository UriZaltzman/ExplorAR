import express from 'express';
import { registerUser, loginUser, forgotPassword, resetPassword, googleLogin } from '../controllers/auth.controller.js';

const router = express.Router();

// Registro normal
router.post('/register', registerUser);
// Login normal
router.post('/login', loginUser);
// Login con Google
router.post('/google-login', googleLogin);
// Recuperar contraseña
router.post('/forgot-password', forgotPassword);
// Resetear contraseña (update de la contraseña con el token enviado al email)
router.post('/reset-password', resetPassword);

export default router;