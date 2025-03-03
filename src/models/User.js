const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const userSchema = new mongoose.Schema({
  _id: { type: Number },
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
  edo: {
    type: Boolean,
    required: [true, "El estado es obligatorio"],
    default: true
  },
  /*
    0 = Pendientes
    1 = Aceptados
    2 = Rechazados
  */
  edoReq: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

userSchema.plugin(AutoIncrement, { 
  inc_field: '_id', 
  id: 'user_seq', // Nombre único para la secuencia de User
  start_seq: 1 
});
module.exports = mongoose.model('User', userSchema);