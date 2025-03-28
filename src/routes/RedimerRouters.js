const express = require('express');
const router = express.Router();
const reminderController = require('../controllers/ReminderController');
const Reminder = require('../models/Reminder');

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

// Ruta para obtener los recordatorios con detalles de usuario, medicamento y pulsera
router.get("/reminders", reminderController.getRemindersWithDetails);

// Ruta para obtener recordatorios por ID de usuario
router.get("/reminders/user/:userId", reminderController.getRemindersByUserId);

//Recordatorios con tiempo de espera por id de usuario
router.get("/reminders/timeout/:userId", reminderController.getRemindersByUserIdWithTimeout)

//Recordatorios con tiempo de espera por id de usuario
router.get("/reminders/timeout", reminderController.getRemindersWithTimeout)

//Recordatorios con tiempo de espera por id de usuario
router.get("/reminders/hystory/:id", reminderController.getHistoryReminderByIdReminder)

module.exports = router;