const express = require('express');
const router = express.Router();
const brazaletController = require('../controllers/braceletController');

// Crear una pulsera
router.post('/brazalet', brazaletController.createBracelet);

// Obtener todas las pulseras
router.get('/brazalet', brazaletController.getBracelets);

// Obtener una pulsera por ID
router.get('/brazalet/:id', brazaletController.getBraceletById);

// Actualizar una pulsera por ID
router.put('/brazalet/:id', brazaletController.updateBracelet);

// Desactivar una pulsera por ID
router.delete('/brazalet/:id', brazaletController.deactivateBracelet);

module.exports = router;