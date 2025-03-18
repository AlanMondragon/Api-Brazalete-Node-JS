const User = require('../models/User');
const { generateToken } = require('./jwtUtils');

// Iniciar sesión
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Buscar al usuario por email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Verificar la contraseña
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Generar el token
    const token = generateToken(user);

    // Enviar el token como respuesta
    res.json({ token, rol : user.rol });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { loginUser }; // Exportar la función