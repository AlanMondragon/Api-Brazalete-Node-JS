const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../token/authMiddleware');

// Crear un usuario: ruta pública, sin verificación de token
router.post('/users', userController.createUser);

// Obtener todos los usuarios activos
router.get('/keepers', authMiddleware(['admin', 'keeper']), userController.getUsers);

//Lista de keepers
router.get('/users/listKeepers', authMiddleware(['admin', 'keeper']), userController.getLisKeeper)

//Cuidadores aceptados
router.get('/users/listKeeperss', authMiddleware(['admin', 'keeper']), userController.getListDenyKeeper)

// Obtener un usuario por ID: 'admin' y 'keeper' pueden acceder
router.get('/user/:id', authMiddleware(['admin', 'keeper']), userController.getUserById);

// AQceptar solicitud del cuidador
router.get('/acepKeep/:id', authMiddleware(['admin']), userController.acceptRequest);

// Actualizar un usuario por ID: solo 'admin' puede actualizar
router.put('/users/:id', authMiddleware(['admin', 'keeper']), userController.updateUser);

// Eliminar (desactivar) un usuario: solo 'admin' puede eliminar
router.put('/users/deactivate/:id', authMiddleware(['admin']), userController.deactivateUser);

// Rechazar la solicitud de un Keeper
router.get('/users/deny/:id', authMiddleware(['admin']), userController.denyRequest);

module.exports = router;
