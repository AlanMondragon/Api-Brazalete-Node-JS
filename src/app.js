const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const medicationRoutes = require('./routes/MedicationRoutes');
const { loginUser } = require('./token/authController');
const authMiddleware = require('./token/authMiddleware'); // Importar el middleware

// Cargar variables de entorno desde .env
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware para parsear JSON
app.use(express.json());

// Conectar a MongoDB
const dbUser = process.env.DBUSER;
const dbPassword = process.env.DBPASSWORD;
const dbHostname = process.env.DBHOSTNAME;
const dbName = process.env.DBNAME;

const mongoUri = `mongodb+srv://${dbUser}:${dbPassword}@${dbHostname}/${dbName}?retryWrites=true&w=majority`;

mongoose.connect(mongoUri)
  .then(() => console.log('Conectado a MongoDB Atlas'))
  .catch((err) => console.error('Error conectando a MongoDB:', err));

// Ruta de login (pública)
app.post('/login', loginUser);

// Protejo todo
app.use('/brazalete', authMiddleware(['admin']), userRoutes); // Proteger todas las rutas de usuarios
app.use('/brazalete', authMiddleware(['admin', 'keeper']), medicationRoutes); // Proteger todas las rutas de medicamentos

// Ruta de prueba (pública)
app.get('/', (req, res) => {
  res.send('API de usuarios con MongoDB Atlas');
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});