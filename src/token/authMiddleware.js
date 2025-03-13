const jwt = require('jsonwebtoken');
require('dotenv').config(); // Cargar variables de entorno

const authMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      return res.status(401).json({ message: 'Acceso denegado, token no proporcionado' });
    }

    // Extraer el token correctamente eliminando "Bearer "
    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Token no válido' });
    }

    try {
      // Verificar y decodificar el token con el algoritmo correcto
      const decoded = jwt.verify(token, process.env.SECRETKEY, { algorithms: ['HS256'] });

      // Verificar si el rol del usuario está permitido
      if (!allowedRoles.includes(decoded.rol)) {
        return res.status(403).json({ message: 'Acceso denegado, no tienes permiso' });
      }

      // Adjuntar la información del usuario al objeto req
      req.user = decoded;
      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expirado, inicia sesión de nuevo' });
      } else if (error.name === 'JsonWebTokenError') {
        return res.status(400).json({ message: 'Token inválido' });
      }
      return res.status(500).json({ message: 'Error en la autenticación' });
    }
  };
};

module.exports = authMiddleware;