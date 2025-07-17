const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// Asumimos que tenés un modelo User
const { User } = require('../models');

// Registro de usuario normal
const registerUser = async (req, res) => {
  const { nombre, apellido, email, password, dni } = req.body;

  if (!nombre || !apellido || !email || !password || !dni) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'El email ya está registrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      nombre,
      apellido,
      email,
      password: hashedPassword,
      dni,
      role: 'user'
    });

    res.status(201).json({ message: 'Usuario registrado', userId: newUser.id });
  } catch (error) {
    res.status(500).json({ message: 'Error en el registro', error });
  }
};

// Login normal
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Error al iniciar sesión', error });
  }
};

// Login con Google (mock de ejemplo)
const googleLogin = async (req, res) => {
  const { email, nombre, apellido } = req.body;

  try {
    let user = await User.findOne({ where: { email } });

    if (!user) {
      user = await User.create({
        nombre,
        apellido,
        email,
        password: null, // no necesita password
        dni: null,
        role: 'user'
      });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Error en login con Google', error });
  }
};

// Olvidé mi contraseña (enviar email con token simulación)
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'Email no encontrado' });
    }

    // simulamos un token de recuperación
    const resetToken = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    // Acá deberías enviar el token por email. Por ahora lo devolvemos:
    res.json({ message: 'Token de recuperación generado', resetToken });
  } catch (error) {
    res.status(500).json({ message: 'Error al generar token', error });
  }
};

// Resetear contraseña
const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: 'Contraseña actualizada con éxito' });
  } catch (error) {
    res.status(500).json({ message: 'Token inválido o expirado', error });
  }
};

module.exports = {
  registerUser,
  loginUser,
  googleLogin,
  forgotPassword,
  resetPassword
};
