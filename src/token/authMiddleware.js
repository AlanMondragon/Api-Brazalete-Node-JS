const jwt = require('jsonwebtoken');

const authMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    // Obtener el token del header 'Authorization'
    const token = req.header('Authorization');

    // Verificar si el token existe
    if (!token) {
      return res.status(401).json({ message: 'Acceso denegado, token no proporcionado' });
    }

    try {
      // Verificar y decodificar el token
      const decoded = jwt.verify(token.replace('Bearer ', ''), 'Ubuntu_Servlet');

      // Verificar si el rol del usuario está permitido
      if (!allowedRoles.includes(decoded.rol)) {
        return res.status(403).json({ message: 'Acceso denegado, no tienes permiso' });
      }

      // Adjuntar la información del usuario al objeto `req` para usarla en las rutas protegidas
      req.user = decoded;

      // Continuar con la siguiente función (controlador)
      next();
    } catch (error) {
      // Si el token es inválido o ha expirado
      res.status(400).json({ message: 'Token inválido' });
    }
  };
};

module.exports = authMiddleware;