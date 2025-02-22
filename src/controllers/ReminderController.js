const Reminder = require('../models/Reminder');

// Crear un recordatorio
exports.createReminder = async (req, res) => {
    try {
        const reminder = new Reminder(req.body);
        reminder.edo = true; // Por defecto, el estado es true (activo)
        await reminder.save();
        res.status(201).json(reminder);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Obtener todos los recordatorios
exports.getReminders = async (req, res) => {
    try {
        const reminders = await Reminder.find().populate('id_medicamento id_usuario id_pulsera');
        res.status(200).json(reminders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener un recordatorio por ID
exports.getReminderById = async (req, res) => {
    try {
        const reminder = await Reminder.findById(req.params.id).populate('id_medicamento id_usuario id_pulsera');
        if (!reminder) {
            return res.status(404).json({ error: 'Recordatorio no encontrado' });
        }
        res.status(200).json(reminder);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Actualizar un recordatorio por ID
exports.updateReminder = async (req, res) => {
    try {
        const reminder = await Reminder.findByIdAndUpdate(req.params.id, req.body, {
            new: true, // Devuelve el documento actualizado
            runValidators: true, // Aplica las validaciones del esquema
        }).populate('id_medicamento id_usuario id_pulsera');
        if (!reminder) {
            return res.status(404).json({ error: 'Recordatorio no encontrado' });
        }
        res.status(200).json(reminder);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Desactivar un recordatorio (cambiar estado a false)
exports.deactivateReminder = async (req, res) => {
    try {
        const reminder = await Reminder.findByIdAndUpdate(
            req.params.id,
            { edo: false }, // Cambiar el estado a false
            { new: true }
        );
        if (!reminder) {
            return res.status(404).json({ error: 'Recordatorio no encontrado' });
        }
        res.status(200).json({ message: 'Recordatorio desactivado correctamente', reminder });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Eliminar un recordatorio por ID
exports.deleteReminder = async (req, res) => {
    try {
        const reminder = await Reminder.findByIdAndDelete(req.params.id);
        if (!reminder) {
            return res.status(404).json({ error: 'Recordatorio no encontrado' });
        }
        res.status(200).json({ message: 'Recordatorio eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};