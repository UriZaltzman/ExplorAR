const express = import('express');
const router = express.Router();
const { 
  registerUser, 
  loginUser, 
  forgotPassword, 
  resetPassword, 
  googleLogin 
} = import('../controllers/auth.controller');
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
module.exports = router;