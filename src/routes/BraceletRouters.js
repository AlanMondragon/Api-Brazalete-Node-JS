const express = require('express');
const router = express.Router();
const brazaletController = require('../controllers/braceletController');
const brazaletController = require('../controllers/BraceletController');

// Crear una pulsera
router.post('/brazalet', brazaletController.createBracelet);
router.post('/brazalet', brazaletController.createBracelet);

// Obtener todas las pulseras
router.get('/brazalet', brazaletController.getBracelets);
router.get('/brazalet', brazaletController.getBracelets);

// Obtener una pulsera por ID
router.get('/brazalet/:id', brazaletController.getBraceletById);
router.get('/brazalet/:id', brazaletController.getBraceletById);

// Actualizar una pulsera por ID
router.put('/brazalet/:id', brazaletController.updateBracelet);
router.put('/brazalet/:id', brazaletController.updateBracelet);

// Desactivar una pulsera por ID
router.delete('/brazalet/:id', brazaletController.deactivateBracelet);
router.delete('/brazalet/:id', brazaletController.deactivateBracelet);

module.exports = router;