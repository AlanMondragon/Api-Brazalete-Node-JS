const express = require('express');
const router = express.Router();
const medicationController = require('../controllers/MedicationController');

// Crear un usuario
router.post('/medication', medicationController.createMedication);

// Obtener todos los usuarios
router.get('/medication', medicationController.getAllMedication);

//Obtener todos los medicamentos inactivos
router.get('/medications/deactivated', medicationController.getAllMedicationDesativate)

// Obtener un usuario por ID
router.get('/medication/:id', medicationController.findById);

// Actualizar un usuario por ID
router.put('/medication/:id', medicationController.update);

// Eliminar un usuario por ID
router.put('/medication/desactivate/:id', medicationController.deactivate);

// Activar medicamento por ID
router.get('/medication/activate/:id', medicationController.reactivate)
module.exports = router;