const express = require('express');
const router = express.Router();
const { register, verifyEmail, login, createActivity } = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/register', register);
router.post('/verify-email', verifyEmail);
router.post('/login', login);
router.get('/perfil', authMiddleware(), getUserProfile);
router.post('/', authMiddleware, createActivity);


module.exports = router;
