import express from 'express';
import {
  registerUser,
  loginUser,
  verifyEmail,
  verifyEmailDev,
  resendVerificationCode,
  forgotPassword,
  resetPassword,
  getUserProfile,
  updateUserProfile,
  googleLogin
} from '../controllers/auth.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Rutas públicas
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/verify-email', verifyEmail);
router.post('/verify-email-dev', verifyEmailDev); // Solo para desarrollo
router.post('/resend-verification', resendVerificationCode);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/google-login', googleLogin);

// Rutas protegidas
router.get('/profile', authenticateToken, getUserProfile);
router.put('/profile', authenticateToken, updateUserProfile);

export default router;