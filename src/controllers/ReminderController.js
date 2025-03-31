const Reminder = require('../models/Reminder');
const ListenerReminder = require('./../models/ListenerReminder')
const mqtt = require('mqtt')
const dotenv = require('dotenv');
const moment = require('moment');
dotenv.config();

const MQTT_BROKER = process.env.MQTTIP;
let MQTT_TOPIC = "reminders/notify"; 
const client = mqtt.connect(MQTT_BROKER);

client.on("connect", () => {
  console.log("📡 Conectado a MQTT Broker!");
});

client.on("error", (err) => {
  console.error("Error en MQTT:", err);
});

client.subscribe("reminders/confirm/#", (err) => {
  if (err) {
    console.error("Error al suscribirse al tema MQTT");
  } else {
    console.log("Suscrito a reminders/confirm");
  }
});

async function updateTimes(id, tiempo) {
  const timeWait = parseInt(tiempo)
  try {
    const reminder = await Reminder.findByIdAndUpdate(
      id,
      {
        $set: { timeout: timeWait }
      },
      { new: true } 
    );
  
    if(reminder.timeout === null){
      const listeerreminder = await ListenerReminder.updateOne({
        id_reminder : id,
      },
        {
          $set: { timeout: timeWait }
        },
        { new: true } 
      );
    }else {
      
    // Crear y guardar el listener
    const newListener = new ListenerReminder({
      inicio: reminder.inicio,
      fin: reminder.fin,
      id_reminder: reminder._id,
      nombre_paciente: reminder.nombre_paciente,
      cronico: reminder.cronico,
      timeout: reminder.timeout,
    });

    await newListener.save();
    }

    if (!reminder) {
      throw new Error("Reminder no encontrado"); 
    }
  
    console.log("Reminder actualizado:", reminder);
    return reminder;
  } catch (error) {
    console.error("Error al actualizar el reminder:", error.message);
    throw error; 
  }
}

// Listener del mensaje
client.on("message", async (topic, message) => {
  try {
    console.log(`Mensaje recibido en ${topic}:`, message.toString());

    const id_pulsera = topic.substring(18);
    const fullMessage = message.toString();
    const time = fullMessage.substring(5);

    console.log("Tiempo en segundos:", time);
    console.log("ID Pulsera:", id_pulsera);

    // Llamar a la función de actualización
    await updateTimes(id_pulsera, time)( () => {
      console.log("se logro xddd")
    });
  } catch (error) {
    console.error("Error al procesar mensaje MQTT:", error);
  }
});

//Creacion de recordatorios
exports.createReminder = async (req, res) => {
  try {

    // Crear y guardar el reminder
    const reminder = new Reminder({
      ...req.body,
      edo: true,
    });
    await reminder.save();

    console.log(reminder._id)

    // Crear y guardar el listener
    const newListener = new ListenerReminder({
      inicio: reminder.inicio,
      fin: reminder.fin,
      id_reminder: reminder._id,
      nombre_paciente: reminder.nombre_paciente,
      cronico: reminder.cronico,
      timeout: reminder.timeout,
    });
    await newListener.save();

    // Obtener datos completos del reminder con medicamento
    const [reminderWithMed] = await Reminder.aggregate([
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
          time: 1,
          id_pulsera: 1
          }
      }
    ]);

    if (!reminderWithMed) {
      return res.status(404).json({ error: "Recordatorio no encontrado" });
    }

    // Calcular total de tomas
    const inicio = new Date(reminderWithMed.inicio);
    const fin = new Date(reminderWithMed.fin);
    const intervaloHoras = reminderWithMed.time || 9;
    
    const diferenciaMs = fin - inicio;
    const diferenciaHoras = diferenciaMs / (1000 * 60 * 60);
    const totalTomas = Math.floor(diferenciaHoras / intervaloHoras) + 1;

    // Preparar y enviar mensaje MQTT
    const message = JSON.stringify({
      ...reminderWithMed,
      total_tomas: totalTomas
    });
    
    const topic = MQTT_TOPIC + reminderWithMed.id_pulsera;

    client.publish(topic, message, { qos: 1 }, (err) => {
      if (err) {
        console.error("❌ Error al publicar en MQTT:", err);
        // Considera registrar el error pero no fallar la operación completa
      } else {
        console.log("✅ Mensaje MQTT enviado:", message);
      }
    });

    res.status(201).json({
      ...reminderWithMed,
      total_tomas: totalTomas
    });

    console.log(newListener)

  } catch (error) {
    console.error("Error en createReminder:", error);
    res.status(500).json({ error: error.message });
  }
};

//Listado de historico por recordatorio (Peticion del Pelon)
exports.getHistoryReminderByIdReminder = async (req, res) =>{
  try {
    const id = parseInt(req.params.id)
    const listenerReminders = await ListenerReminder.find({
      id_reminder: id,
      timeout: { $exists: true } 
    });

    res.status(200).json(listenerReminders)

  } catch (error) {
    res.status(400).json({ error : error.message })
  }
}

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
      const userId = parseInt(req.params.userId);
  
  
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
          $match: { "usuario._id": userId }
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
        res.status(500).json({ error: "Error interno del servidor al buscar recordatorios" });
    }
};


  // Recordatorios por Usuario Id con tiempo de espera
  exports.getRemindersByUserIdWithTimeout = async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
  
  
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
          $match: { "usuario._id": userId }
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
        { $match: { timeout: { $exists: true } } },
        {
          $project: {
            nombre_paciente: 1,
            "medicamentos.nombre": 1,
            "usuario.name": 1,
            "usuario.rol": 1,
            inicio: 1,
            fin: 1,
            cronico: 1,
            timeout : 1
          }
        }
      ]);
  
      res.status(200).json(reminders);
    } catch (error) {
        console.error("Error en la consulta de recordatorios:", error);
        res.status(500).json({ error: "Error interno del servidor al buscar recordatorios" });
    }
};


// Recordatorios con tiempo de espera
exports.getRemindersWithTimeout = async (req, res) => {
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
      { $match: { timeout: { $exists: true } } },
      {
        $project: {
          nombre_paciente: 1,
          "medicamentos.nombre": 1,
          "usuario.name": 1,
          "usuario.rol": 1,
          inicio: 1,
          fin: 1,
          cronico: 1,
          timeout : 1
        }
      }
    ]);

    res.status(200).json(reminders);
  } catch (error) {
      console.error("Error en la consulta de recordatorios:", error);
      res.status(500).json({ error: "Error interno del servidor al buscar recordatorios" });
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
      const reminder = await Reminder.findByIdAndUpdate(
          req.params.id, 
          req.body, 
          {
              new: true, 
              runValidators: true, 
          }
      ).populate('id_medicamento id_usuario id_pulsera');

      if (!reminder) {
          return res.status(404).json({ error: 'Recordatorio no encontrado' });
      }

      res.status(200).json(reminder);

      const topic = MQTT_TOPIC + reminder.id_pulsera;
      const message = reminder;

      client.publish(topic, message, { qos: 1 }, (err) => {
          if (err) {
              console.error("❌ Error al publicar en MQTT:", err);
          } else {
              console.log("✅ Mensaje de update MQTT enviado:", message);
          }
      });

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