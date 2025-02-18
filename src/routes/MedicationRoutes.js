const express = require('express');
const router = express.Router();
const medicationController = require('../controllers/MedicationController');

// Crear un usuario
router.post('/medication', medicationController.createMedication);

// Obtener todos los usuarios
router.get('/medication', medicationController.getAllMedication);

// Obtener un usuario por ID
router.get('/medication/:id', medicationController.findById);

// Actualizar un usuario por ID
router.put('/medication/:id', medicationController.update);

// Eliminar un usuario por ID
router.delete('/medication/:id', medicationController.deactivate);

module.exports = router;