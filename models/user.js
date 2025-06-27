const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // added jwt require statement

const userSchema = new mongoose.Schema({
  phone_number: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  preferred_language: { type: String, default: 'en' },
  user_type: { 
    type: String, 
    enum: ['farmer', 'expert', 'admin'], 
    default: 'farmer' 
  },
  is_verified: { type: Boolean, default: false },
  last_login: { type: Date },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Method to generate JWT token
userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: '24h'
  });
  return token;
};

module.exports = mongoose.model('User', userSchema);