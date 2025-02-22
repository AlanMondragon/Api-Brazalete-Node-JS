const mongoose = require('mongoose');

const braceletSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "El nombre es necesario"]
    },
    ipAddress: {
        type: String,
        required: [true, "La ip es necesaria"]
    },
    ipAddress2: {
        type: String,
        required: [true, "La direccion ip 2 es necesaria"]
    },
    edo: {
        type: Boolean,
        required: [true, "El estado es necesario"]
    }
});

module.exports = mongoose.model('Bracelet', braceletSchema);