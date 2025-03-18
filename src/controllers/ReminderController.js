const Reminder = require('../models/Reminder');
const mqtt = require('mqtt')
const { ObjectId } = require("mongodb"); // Importar ObjectId
const moment = require('moment');

const MQTT_BROKER = "mqtt://34.239.121.96:1883"; // Cambia a la IP de tu broker si está en otro servidor
const MQTT_TOPIC = "reminders/notify"; // Tema MQTT para notificar

const client = mqtt.connect(MQTT_BROKER);

client.on("connect", () => {
  console.log("📡 Conectado a MQTT Broker!");
});

client.on("error", (err) => {
  console.error("🚨 Error en MQTT:", err);
});



client.subscribe("reminders/confirm", (err) => {
  if (err) {
    console.error("❌ Error al suscribirse al tema MQTT");
  } else {
    console.log("📥 Suscrito a reminders/confirm");
  }
});

client.on("message", (topic, message) => {
  console.log(`📩 Mensaje recibido en ${topic}:`, message.toString());
});


//Crear recordatorio
exports.createReminder = async (req, res) => {
  try {
      const reminder = new Reminder(req.body);
      reminder.edo = true; // Estado activo
      await reminder.save();

      // 📌 Consultar directamente el nombre del medicamento con `aggregate()`
      const reminderWithMed = await Reminder.aggregate([
          { $match: { _id: reminder._id } },
          {
              $lookup: {
                  from: "medications",
                  localField: "id_medicamento",
                  foreignField: "_id",
                  as: "medicamento"
              }
          },
          { $unwind: "$medicamento" },
          {
              $project: {
                  nombre_paciente: 1,
                  nombre_medicamento: "$medicamento.nombre",
                  inicio: 1,
                  fin: 1,
                  time: 1 // Intervalo de tomas en horas
              }
          }
      ]);

      if (!reminderWithMed.length) {
          return res.status(404).json({ error: "Recordatorio no encontrado" });
      }

      // 📅 Calcular la cantidad de tomas basado en `time`
      const inicio = moment(reminderWithMed[0].inicio);
      const fin = moment(reminderWithMed[0].fin);
      const intervaloHoras = reminderWithMed[0].time || 9; // `time` del modelo define el intervalo

      const diferenciaHoras = fin.diff(inicio, 'hours'); // Diferencia total en horas
      const totalTomas = Math.floor(diferenciaHoras / intervaloHoras) + 1; // Se suma 1 para incluir la primera toma

      // 📡 Publicar mensaje MQTT con la cantidad de tomas
      const message = JSON.stringify({
          ...reminderWithMed[0],
          total_tomas: totalTomas
      });

      client.publish(MQTT_TOPIC, message, { qos: 1 }, (err) => {
          if (err) {
              console.error("❌ Error al publicar en MQTT:", err);
          } else {
              console.log("✅ Mensaje MQTT enviado:", message);
          }
      });

      res.status(201).json({
          ...reminderWithMed[0],
          total_tomas: totalTomas
      });

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
            cronico: 1
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
            cronico: 1
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