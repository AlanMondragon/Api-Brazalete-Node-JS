const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const reminderSchema = new mongoose.Schema({
    _id: { type: Number },
    inicio: { type: Date },
    fin: { type: Date },
    time: { type: Number }, // Duración en horas
    nombre_paciente: { type: String, required: true },
    cronico: { type: Boolean, required: true },
    id_medicamento: { type: Number, required: true }, // Cambiar de ObjectId a Number
    id_usuario: { type: Number, required: true }, // Cambiar de ObjectId a Number
    timeout: {type: Number ,required: false},
    id_pulsera: { type: Number, required: true }, // Cambiar de ObjectId a Number
    edo: { type: Boolean, required: true }
}, { timestamps: true });

reminderSchema.plugin(AutoIncrement, { 
    inc_field: '_id', 
    id: 'reminder_seq',
    start_seq: 1 
});

module.exports = mongoose.model('Reminder', reminderSchema);
