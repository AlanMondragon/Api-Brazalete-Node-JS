const express = require('express');
const router = express.Router();
const reminderController = require('../controllers/ReminderController');

// Crear un recordatorio
router.post('/reminder', reminderController.createReminder);

// Obtener todos los recordatorios
router.get('/reminder', reminderController.getReminders);

// Obtener un recordatorio por ID
router.get('/reminder/:id', reminderController.getReminderById);

// Actualizar un recordatorio por ID
router.put('/reminder/:id', reminderController.updateReminder);

// Desactivar un recordatorio por ID
router.put('/reminder/:id/deactivate', reminderController.deactivateReminder);

// Eliminar un recordatorio por ID
router.delete('/reminder/:id', reminderController.deleteReminder);

module.exports = router;