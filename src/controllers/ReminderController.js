const Reminder = require('../models/Reminder');
const mqtt = require('mqtt')
const { ObjectId } = require("mongodb"); // Importar ObjectId

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

// Todos
exports.getRemindersWithDetails = async (req, res) => {
    try {
      const reminders = await Reminder.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "id_usuario",
            foreignField: "_id",
            as: "usuario"
          }
        },
        { $unwind: "$usuario" },
        {
          $lookup: {
            from: "medications",
            localField: "id_medicamento",
            foreignField: "_id",
            as: "medicamentos"
          }
        },
        { $unwind: "$medicamentos" },
        {
          $lookup: {
            from: "bracelets",
            localField: "id_pulsera",
            foreignField: "_id",
            as: "brazaletes"
          }
        },
        { $unwind: "$brazaletes" },
        {
          $project: {
            nombre_paciente: 1,
            "medicamentos.nombre": 1,
            "usuario.name": 1,
            "usuario.rol": 1,
            inicio: 1,
            fin: 1,
            cronico: 1,
            _id: 0
          }
        }
      ]);
  
      res.status(200).json(reminders);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error en la consulta de recordatorios" });
    }
  };

  // Recordatorios por Usuario Id
  exports.getRemindersByUserId = async (req, res) => {
    try {
      const userId = req.params.userId; // Obtener el ID desde la URL
  
      // Verificar si el ID proporcionado es válido
      if (!ObjectId.isValid(userId)) {
        return res.status(400).json({ error: "ID de usuario no válido" });
      }
  
      const reminders = await Reminder.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "id_usuario",
            foreignField: "_id",
            as: "usuario"
          }
        },
        { $unwind: "$usuario" },
        {
          $match: { "usuario._id": new ObjectId(userId) } // Convertir el string a ObjectId
        },
        {
          $lookup: {
            from: "medications",
            localField: "id_medicamento",
            foreignField: "_id",
            as: "medicamentos"
          }
        },
        { $unwind: "$medicamentos" },
        {
          $lookup: {
            from: "bracelets",
            localField: "id_pulsera",
            foreignField: "_id",
            as: "brazaletes"
          }
        },
        { $unwind: "$brazaletes" },
        {
          $project: {
            nombre_paciente: 1,
            "medicamentos.nombre": 1,
            "usuario.name": 1,
            "usuario.rol": 1,
            inicio: 1,
            fin: 1,
            cronico: 1,
            _id: 0
          }
        }
      ]);
  
      res.status(200).json(reminders);
    } catch (error) {
      console.error("Error en la consulta de recordatorios:", error);
      res.status(500).json({ error: "Error en la consulta de recordatorios" });
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