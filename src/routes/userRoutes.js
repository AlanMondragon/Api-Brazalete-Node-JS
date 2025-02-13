const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Crear un usuario
router.post('/users', userController.createUser);

// Obtener todos los usuarios
router.get('/users', userController.getUsers);

// Obtener un usuario por ID
router.get('/users/:id', userController.getUserById);

// Actualizar un usuario por ID
router.put('/users/:id', userController.updateUser);

// Eliminar un usuario por ID
router.delete('/users/:id', userController.deleteUser);

module.exports = router;