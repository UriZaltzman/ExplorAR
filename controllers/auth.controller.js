const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { sendVerificationCode } = require('../utils/sendVerificationCode');

const register = async (req, res) => {
  const { firstName, lastName, email, password, dni } = req.body;

  if (!email.endsWith('@gmail.com')) {
    return res.status(400).json({ message: 'El mail debe ser de gmail' });
  }

  const hashed = await bcrypt.hash(password, 10);
  const code = Math.floor(1000 + Math.random() * 9000).toString(); // código 4 dígitos

  const user = await User.create({
    firstName, lastName, email, password: hashed, dni, verificationCode: code
  });

  // Enviar código por consola (simulado)
  sendVerificationCode(email, code);

  res.status(201).json({ message: 'Usuario registrado, verifique su email' });
};

const verifyEmail = async (req, res) => {
  const { email, code } = req.body;

  const user = await User.findOne({ where: { email } });

  if (!user || user.verificationCode !== code) {
    return res.status(400).json({ message: 'Código inválido' });
  }

  user.emailVerified = true;
  user.verificationCode = null;
  await user.save();

  res.json({ message: 'Email verificado con éxito' });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });

  if (!user || !user.emailVerified) {
    return res.status(403).json({ message: 'Usuario no encontrado o no verificado' });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(403).json({ message: 'Credenciales incorrectas' });

  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET);
  res.json({ token });
};
