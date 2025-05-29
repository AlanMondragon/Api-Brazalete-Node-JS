const express = require('express');
const cors = require('cors');      
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const medicationRoutes = require('./routes/MedicationRoutes');
const braceletRoutes = require('./routes/BraceletRouters');
const reminderRouter = require('./routes/RedimerRouters');
const emailRouter = require('./routes/passwordRoutes');
const brazaletController = require('./controllers/BraceletController');
const { loginUser } = require('./token/authController');
const authMiddleware = require('./token/authMiddleware');

// Cargar variables de entorno desde .env
dotenv.config();
const app = express();      
const port = process.env.PORT || 3000;

// Configuración de CORS
const corsOptions = {
  origin: ['http://localhost:5173', 'https://staging.d2xulwst5g6kpq.amplifyapp.com'], 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true 
};

// Uso de CORS con las opciones configuradas
app.use(cors(corsOptions));

app.options('*', cors()); // Permitir todas las solicitudes OPTIONS


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

// ===== RUTAS PÚBLICAS =====
// Ruta de login (pública)
app.post('/login', loginUser);

// Rutas para recuperación de contraseña (públicas)
// Nota importante: Esto debe ir ANTES de las rutas protegidas
app.use('/api/password', emailRouter);

// ===== RUTAS PROTEGIDAS =====
// Rutas de usuario (pueden tener mezcla de rutas protegidas y públicas)
app.use('/api', userRoutes);

// Protejo todo
app.use('/api', authMiddleware(['admin', 'keeper']), medicationRoutes);

// Proteger las rutas de pulseras
app.use('/api', authMiddleware(['keeper','admin']), braceletRoutes);

// Para los recordatorios
app.use('/api', authMiddleware(['keeper','admin']), reminderRouter);

// Obtener el ultimo id
app.get('/brazalet/lastId', brazaletController.getLastId);

//Compartat ID
app.get('/brazalet/shareId/:id', brazaletController.shareId);

// Ruta de prueba (pública)
app.get('/', (req, res) => {
  res.send('API de usuarios con MongoDB Atlas');
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
