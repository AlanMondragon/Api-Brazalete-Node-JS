const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

const generateToken = (user) => {
  const payload = {
    id: user._id,
    email: user.email,
    rol: user.rol
  };

  //Para que se genere y el tiempo de duración
  const token = jwt.sign(payload, process.env.SECRETKEY , { expiresIn: '1h' });

  return token;
};

module.exports = { generateToken }; // Exportar la función