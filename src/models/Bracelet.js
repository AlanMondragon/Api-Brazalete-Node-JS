const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const braceletSchema = new mongoose.Schema({
    _id: { type: Number }, 
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    ip_mqtt: {
        type: String,
        required: [true, 'La ipMqtt es obligatoria']
    },
    edo: {
        type: Boolean,
        required: [true, 'El estado es obligatorio']
    },
    id_user : {
        type : Number,
        requierd : [true, "El id del usuario es requerida"]
    }
}, { timestamps: true });

braceletSchema.plugin(AutoIncrement, { 
    inc_field: '_id', 
    id: 'bracelet_seq',
    start_seq: 1 
});

module.exports = mongoose.model('Bracelet', braceletSchema);