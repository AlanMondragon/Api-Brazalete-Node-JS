const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const braceletSchema = new mongoose.Schema({
    _id: { type: Number }, // Definir _id como Number para que sea autoincremental
    // Otros campos del esquema Bracelet
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    descripcion: {
        type: String,
        required: [true, 'La descripción es obligatoria']
    },
    edo: {
        type: Boolean,
        required: [true, 'El estado es obligatorio']
    }
}, { timestamps: true });

// Aplicar el plugin con un nombre único para la secuencia
braceletSchema.plugin(AutoIncrement, { 
    inc_field: '_id', 
    id: 'bracelet_seq', // Nombre único para la secuencia de Bracelet
    start_seq: 1 
});

module.exports = mongoose.model('Bracelet', braceletSchema);