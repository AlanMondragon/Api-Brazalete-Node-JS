const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const reminderSchema = new mongoose.Schema({
    _id: { type: Number },
    inicio: {
        type: Date,
    },
    fin: {
        type: Date
    },
    time : {
        type: Number,
    }
    ,
    nombre_paciente: {
        type: String,
        required: [true, "El nombre del paciente es necesario"],
    },
    cronico: {
        type: Boolean,
        required: [true, "El campo crónico es necesario"],
    },
    id_medicamento: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Medication', // Referencia al modelo de medicamento
        required: [true, "El ID del medicamento es necesario"],
    },
    id_usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Referencia al modelo de usuario
        required: [true, "El ID del usuario es necesario"],
    },
    id_pulsera: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bracelet', // Referencia al modelo de pulsera
        required: [true, "El ID de la pulsera es necesario"],
    },
    edo: {
        type: Boolean,
        required: [true, "El estado es obligatorio"]
    }
}, { timestamps: true }); 


reminderSchema.plugin(AutoIncrement, { 
    inc_field: '_id', 
    id: 'reminder_seq', // Nombre único para la secuencia de Reminder
    start_seq: 1 
});
module.exports = mongoose.model('Reminder', reminderSchema);