const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose); // Importar y configurar

const medicationSchema = new mongoose.Schema({
    _id: { type: Number }, // Definir _id como Number para que sea autoincremental
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    description: {
        type: String,
        required: [true, 'La descripcion es obligatoria']
    },
    edo: {
        type: Boolean,
        required: [true, "Es necesario el estado"]
    }
}, { timestamps: true }); // Opcional: agregar timestamps

// Aplicar el plugin para auto-incrementar el campo _id, iniciando en 1
medicationSchema.plugin(AutoIncrement, { inc_field: '_id', start_seq: 1 });

module.exports = mongoose.model('Medication', medicationSchema);