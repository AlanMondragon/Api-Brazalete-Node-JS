const express = require('express');
const router = express.Router();
const brazaletController = require('../controllers/BraceletController');

// Crear una pulsera
router.post('/brazalet', brazaletController.createBracelet);

// Obtener todas las pulseras
router.get('/brazalet', brazaletController.getBracelets);

//Obtener brazalete por id de Usuario
router.get('/brazalet/user/:id', brazaletController.getBraceletByIdUser)

// Obtener una pulsera por ID
router.get('/brazalet/:id', brazaletController.getBraceletById);

// Actualizar una pulsera por ID
router.put('/brazalet/update/:id', brazaletController.updateBracelet);

// Desactivar una pulsera por ID
router.get('/brazalet/desativate/:id', brazaletController.deactivateBracelet);

module.exports = router;