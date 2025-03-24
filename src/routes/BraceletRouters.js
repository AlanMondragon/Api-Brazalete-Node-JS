const express = require('express');
const router = express.Router();
const brazaletController = require('../controllers/brazaletController');

// Crear una pulsera
router.post('/brazalet', brazaletController.createbrazalet);

// Obtener todas las pulseras
router.get('/brazalet', brazaletController.getbrazalets);

// Obtener una pulsera por ID
router.get('/brazalet/:id', brazaletController.getbrazaletById);

// Actualizar una pulsera por ID
router.put('/brazalet/:id', brazaletController.updatebrazalet);

// Desactivar una pulsera por ID
router.delete('/brazalet/:id', brazaletController.deactivatebrazalet);

module.exports = router;