import express from 'express';
import { registerUser, loginUser, forgotPassword, resetPassword, googleLogin, verifyEmail, resendVerificationCode, verifyEmailDev } from '../controllers/auth.controller.js';

const router = express.Router();

// Registro y autenticación
router.post('/registro', registerUser);
router.post('/login', loginUser);
router.post('/google-login', googleLogin);

// Verificación de email
router.post('/verificar-email', verifyEmail);
router.post('/reenviar-codigo', resendVerificationCode);
router.post('/verificar-email-dev', verifyEmailDev);

// Recuperar/Resetear contraseña
router.post('/recuperar-password', forgotPassword);
router.post('/resetear-password', resetPassword);

export default router;