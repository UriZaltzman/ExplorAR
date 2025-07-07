const jwt = require('jsonwebtoken');

const authMiddleware = (requireAdmin = false) => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: 'Token requerido' });
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; 
      if (requireAdmin && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Acceso denegado: solo administradores' });
      }

      next();
    } catch (err) {
      return res.status(403).json({ message: 'Token inválido' });
    }
  };
};

module.exports = authMiddleware;
