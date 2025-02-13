const mongoose = require('mongoose');

const medicationSchema = new mongoose.Schema({

    nombre : {
        type : String,
        required : [true, 'El nombre es obligatorio'],
        unique : true
    },
    description  : {
        type : String,
        required : [true, 'La descripcion es obligatoria']
    }

})

module.exports = mongoose.model('Medications', medicationSchema);