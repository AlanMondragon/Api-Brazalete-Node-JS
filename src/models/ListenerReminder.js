const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const ListenerReminderSchema = new mongoose.Schema({
    _id: { type: Number },
    inicio: { type: Date },
    fin: { type: Date },
    id_reminder : {type : Number, requiered : [true, "El id del recordatorio es necesario"]},
    nombre_paciente: { type: String, required: true },
    cronico: { type: Boolean, required: true },
    timeout: {type: Number ,required: false},
}, { timestamps: true });

ListenerReminderSchema.plugin(AutoIncrement, { 
    inc_field: '_id', 
    id: 'ListenerReminder_seq',
    start_seq: 1 
});

module.exports = mongoose.model('ListenerReminder', ListenerReminderSchema);
