const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'El nombre es obligatorio'] 
  },
  email: { 
    type: String, 
    required: [true, 'El email es obligatorio'], 
    unique: true 
  },
  phone: { 
    type: String, 
    required: [true, 'El teléfono es obligatorio'] 
  },
  rol: { 
    type: String, 
    required: [true, 'El rol es obligatorio'],
    enum: {
      values: ["admin", "keeper"],
      message: 'El rol debe ser "admin" o "keeper"'
    }
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);