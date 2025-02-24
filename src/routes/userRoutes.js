const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../token/authMiddleware');

// Crear un usuario: ruta pública, sin verificación de token
router.post('/users', userController.createUser);

// Obtener todos los usuarios: 'admin' y 'keeper' pueden acceder
router.get('/users', authMiddleware(['admin', 'keeper']), userController.getUsers);

// Obtener un usuario por ID: 'admin' y 'keeper' pueden acceder
router.get('/users/:id', authMiddleware(['admin', 'keeper']), userController.getUserById);

// Actualizar un usuario por ID: solo 'admin' puede actualizar
router.put('/users/:id', authMiddleware(['admin']), userController.updateUser);

// Eliminar (desactivar) un usuario: solo 'admin' puede eliminar
router.delete('/users/:id', authMiddleware(['admin']), userController.deleteUser);

module.exports = router;
