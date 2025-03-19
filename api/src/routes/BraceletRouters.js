const express = require('express');
const router = express.Router();
const braceletController = require('../controllers/BraceletController');

// Crear una pulsera
router.post('/bracelet', braceletController.createBracelet);

// Obtener todas las pulseras
router.get('/bracelet', braceletController.getBracelets);

// Obtener una pulsera por ID
router.get('/bracelet/:id', braceletController.getBraceletById);

// Actualizar una pulsera por ID
router.put('/bracelet/:id', braceletController.updateBracelet);

// Desactivar una pulsera por ID
router.delete('/bracelet/:id', braceletController.deactivateBracelet);

module.exports = router;