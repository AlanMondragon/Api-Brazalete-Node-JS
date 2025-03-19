const jwt = require('jsonwebtoken');
require('dotenv').config(); // Cargar variables de entorno

const generateToken = (user) => {
  const payload = {
    id: user._id,
    email: user.email,
    rol: user.rol,
    edo : user.edo
  };

  const token = jwt.sign(payload, process.env.SECRETKEY, { expiresIn: '1h', algorithm: 'HS256' });

  return token;
};

module.exports = { generateToken };