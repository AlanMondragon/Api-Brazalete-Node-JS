const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const medicationRoutes = require('./routes/MedicationRoutes');
const braceletRoutes = require('./routes/BraceletRouters')
const reminderRouter = require('./routes/RedimerRouters')
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

app.use('/api', userRoutes);

// Protejo todo
app.use('/api', authMiddleware(['admin', 'keeper']), medicationRoutes); // Proteger todas las rutas de medicamentos

// Proteger las rutas de pulseras
app.use('/api', authMiddleware(['keeper','admin']), braceletRoutes);

// Para los recordatorios
app.use('/api',authMiddleware(['keeper','admin']), reminderRouter);

// Ruta de prueba (pública)
app.get('/', (req, res) => {
  res.send('API de usuarios con MongoDB Atlas');
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});


//linea cambio bro