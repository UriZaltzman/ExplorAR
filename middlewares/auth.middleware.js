import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ message: 'Token de acceso requerido' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Verificar que el usuario existe
    const user = await User.findByPk(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    // Agregar información del usuario al request
    req.user = {
      userId: user.id,
      email: user.email,
      role: user.role,
      nombre: user.nombre,
      apellido: user.apellido
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Token inválido' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expirado' });
    }
    console.error('Error in authenticateToken:', error);
    res.status(500).json({ message: 'Error de autenticación' });
  }
};

// Middleware para verificar si es admin
export const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Acceso denegado. Se requieren permisos de administrador.' });
  }
  next();
};

// Middleware opcional para autenticación (no falla si no hay token)
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      const user = await User.findByPk(decoded.userId);
      
      if (user) {
        req.user = {
          userId: user.id,
          email: user.email,
          role: user.role,
          nombre: user.nombre,
          apellido: user.apellido
        };
      }
    }

    next();
  } catch (error) {
    // Si hay error en el token, simplemente continuar sin usuario
    next();
  }
};
