const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  const payload = {
    id: user._id,
    email: user.email,
    rol: user.rol
  };

  //Para que se genere y el tiempo de duración
  const token = jwt.sign(payload, 'Ubuntu_Servlet', { expiresIn: '1h' });

  return token;
};

module.exports = { generateToken }; // Exportar la función