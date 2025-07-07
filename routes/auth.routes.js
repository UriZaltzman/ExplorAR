const express = require('express');
const router = express.Router();
const { register, verifyEmail, login } = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/register', register);
router.post('/verify-email', verifyEmail);
router.post('/login', login);
router.get('/perfil', authMiddleware(), getUserProfile);


module.exports = router;
