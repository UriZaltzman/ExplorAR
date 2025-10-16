import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { User, VerificacionEmail } from '../models/index.js';
import { sendVerificationEmail } from '../utils/sendVerificationCode.js';
import { Op } from 'sequelize';

// Registro de usuario
export const registerUser = async (req, res) => {
  try {
  const { nombre, apellido, email, password, dni } = req.body;

    // Validaciones
  if (!nombre || !apellido || !email || !password || !dni) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@gmail\.com$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'El email debe ser de Gmail (@gmail.com)' });
    }

    // Validar DNI (8 caracteres)
    if (dni.length !== 8) {
      return res.status(400).json({ message: 'El DNI debe tener exactamente 8 caracteres' });
    }

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { dni }]
      }
    });

    if (existingUser) {
      return res.status(400).json({ message: 'El email o DNI ya están registrados' });
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
    const newUser = await User.create({
      nombre,
      apellido,
      email,
      password: hashedPassword,
      dni,
      role: 'user',
      // Email verification disabled: mark as verified by default
      // is_email_verified: false
      is_email_verified: true
    });
    
    // Email verification disabled (commented out block)
    // const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    // const expirationDate = new Date();
    // expirationDate.setHours(expirationDate.getHours() + 24); // 24 horas
    // await VerificacionEmail.create({ user_id: newUser.id, codigo: verificationCode, fecha_expiracion: expirationDate });
    // try { await sendVerificationEmail(email, verificationCode); } catch (emailError) { console.error('Error sending verification email:', emailError); }

    // Responder sin requerir verificación
    res.status(201).json({
      message: 'Usuario registrado exitosamente. Ya puedes iniciar sesión.',
      userId: newUser.id
    });
  } catch (error) {
    console.error('Error in registerUser:', error);
    res.status(500).json({ message: 'Error en el registro', error: error.message });
  }
};

// Login de usuario
export const loginUser = async (req, res) => {
  try {
  const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email y contraseña son obligatorios' });
    }

    // Buscar usuario
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Email verification disabled (allow login without verifying email)
    // if (!user.is_email_verified) {
    //   return res.status(401).json({ 
    //     message: 'Debes verificar tu email antes de iniciar sesión',
    //     needsVerification: true,
    //     userId: user.id
    //   });
    // }

    // Generar token JWT
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login exitoso',
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error in loginUser:', error);
    res.status(500).json({ message: 'Error en el login', error: error.message });
  }
};

// Verificar email
export const verifyEmail = async (req, res) => {
  try {
    // Email verification disabled (endpoint no-op)
    // Original logic commented out. This endpoint is kept for compatibility
    // and now returns success without processing a code.
    return res.json({ message: 'Verificación de email deshabilitada temporalmente' });
  } catch (error) {
    console.error('Error in verifyEmail:', error);
    res.status(500).json({ message: 'Error al verificar email', error: error.message });
  }
};

// Verificar email sin código (solo para desarrollo)
export const verifyEmailDev = async (req, res) => {
  try {
    // Email verification disabled (endpoint no-op)
    return res.json({ message: 'Verificación deshabilitada (modo desarrollo)' });
  } catch (error) {
    console.error('Error in verifyEmailDev:', error);
    res.status(500).json({ message: 'Error al verificar email', error: error.message });
  }
};

// Reenviar código de verificación
export const resendVerificationCode = async (req, res) => {
  try {
    // Email verification disabled (endpoint no-op)
    return res.json({ message: 'Reenvío de verificación deshabilitado' });
  } catch (error) {
    console.error('Error in resendVerificationCode:', error);
    res.status(500).json({ message: 'Error al reenviar código', error: error.message });
  }
};

// Olvidé mi contraseña
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email es obligatorio' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Generar código de reset
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expirationDate = new Date();
    expirationDate.setHours(expirationDate.getHours() + 1); // 1 hora

    // Crear verificación de reset
    await VerificacionEmail.create({
      user_id: user.id,
      codigo: resetCode,
      fecha_expiracion: expirationDate
    });

    // Enviar email de reset
    try {
      await sendVerificationEmail(email, resetCode, 'reset');
      const responseBody = { message: 'Email de recuperación enviado' };
      if (process.env.NODE_ENV !== 'production') {
        responseBody.resetCode = resetCode;
      }
      res.json(responseBody);
    } catch (emailError) {
      console.error('Error sending reset email:', emailError);
      res.status(500).json({ message: 'Error al enviar email de recuperación' });
    }
  } catch (error) {
    console.error('Error in forgotPassword:', error);
    res.status(500).json({ message: 'Error al procesar solicitud', error: error.message });
  }
};

// Resetear contraseña
export const resetPassword = async (req, res) => {
  try {
    const { email, codigo, newPassword } = req.body;

    if (!email || !codigo || !newPassword) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Verificar código
    const verification = await VerificacionEmail.findOne({
      where: {
        user_id: user.id,
        codigo,
        usado: false,
        fecha_expiracion: {
          [Op.gt]: new Date()
        }
      }
    });

    if (!verification) {
      return res.status(400).json({ message: 'Código inválido o expirado' });
    }

    // Marcar como usado
    await verification.update({ usado: true });

    // Actualizar contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await user.update({ password: hashedPassword });

    res.json({ message: 'Contraseña actualizada exitosamente' });
  } catch (error) {
    console.error('Error in resetPassword:', error);
    res.status(500).json({ message: 'Error al resetear contraseña', error: error.message });
  }
};

// Obtener perfil del usuario
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.userId, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    res.status(500).json({ message: 'Error al obtener perfil', error: error.message });
  }
};

// Actualizar perfil del usuario
export const updateUserProfile = async (req, res) => {
  try {
    const { nombre, apellido } = req.body;

    const user = await User.findByPk(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Solo permitir actualizar nombre y apellido
    const updateData = {};
    if (nombre) updateData.nombre = nombre;
    if (apellido) updateData.apellido = apellido;

    await user.update(updateData);

    res.json({
      message: 'Perfil actualizado exitosamente',
      user: {
        id: user.id,
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error in updateUserProfile:', error);
    res.status(500).json({ message: 'Error al actualizar perfil', error: error.message });
  }
};

// Login con Google
export const googleLogin = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ message: 'Token de Google es requerido' });
    }

    // Verificar el token con Google
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const { email, name, picture, sub: googleId } = payload;

    // Buscar usuario existente por email o google_id
    let user = await User.findOne({
      where: {
        [Op.or]: [{ email }, { google_id: googleId }]
      }
    });

    if (!user) {
      // Crear nuevo usuario
      const [nombre, apellido] = name.split(' ');
      
      user = await User.create({
        nombre: nombre || name,
        apellido: apellido || '',
        email,
        google_id: googleId,
        profile_image_url: picture,
        role: 'user',
        is_email_verified: true, // Google ya verifica el email
        dni: `G${googleId.slice(-8)}` // DNI temporal basado en Google ID
      });
    } else {
      // Actualizar información de Google si es necesario
      if (!user.google_id) {
        await user.update({
          google_id: googleId,
          profile_image_url: picture,
          is_email_verified: true
        });
      }
    }

    // Generar JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
        nombre: user.nombre,
        apellido: user.apellido
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login con Google exitoso',
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        role: user.role,
        profile_image_url: user.profile_image_url
      }
    });

  } catch (error) {
    console.error('Error in googleLogin:', error);
    
    if (error.message.includes('Invalid token')) {
      return res.status(401).json({ message: 'Token de Google inválido' });
    }
    
    res.status(500).json({ message: 'Error en login con Google', error: error.message });
  }
};
