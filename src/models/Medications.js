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
    },
    edo : {
        type : Boolean,
        required : [true, "Es necesario el estado"]
    }

})

module.exports = mongoose.model('Medication', medicationSchema);