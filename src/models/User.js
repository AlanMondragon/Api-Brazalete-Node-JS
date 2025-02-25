const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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
  password: { 
    type: String, 
    required: [true, 'La contraseña es obligatoria'] 
  },
  rol: { 
    type: String, 
    required: [true, 'El rol es obligatorio'],
    enum: {
      values: ["admin", "keeper"],
      message: 'El rol debe ser "admin" o "keeper"'
    }
  },
  edo : {
    type : Boolean,
    required : [true, "El estado es obligatorio"]
  }
}, { timestamps: true });

// Hashear la contraseña antes de guardar el usuario
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // Si no se modifica la contraseña, no hacer nada
  const salt = await bcrypt.genSalt(10); // Generar un salt
  this.password = await bcrypt.hash(this.password, salt); // Hashear la contraseña
  next();
});

// Método para comparar contraseñas
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password); // Comparar contraseñas hasheadas
};

// No devolver la contraseña en las respuestas JSON
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

module.exports = mongoose.model('User', userSchema);