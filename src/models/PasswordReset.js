const mongoose = require('mongoose');

const passwordResetSchema = new mongoose.Schema({
  userId: {
    type: Number,
    required: true,
    ref: 'User'
  },
  token: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600 
  },
  expiresAt: { type: Date, required: true }, 

});

module.exports = mongoose.model('PasswordReset', passwordResetSchema);