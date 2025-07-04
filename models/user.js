const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  phone_number: { type: String, required: true, unique: true }, // User's mobile number
  name: { type: String, required: true }, // User's name
  preferred_language: { type: String, default: 'en' }, // Language preference
  email: { type: String, unique: true }, // Optional email for password login
  password: { type: String, select: false }, // Hashed password
  user_type: {
    type: String,
    enum: ['farmer', 'expert', 'admin'],
    default: 'farmer'
  },
  is_verified: { type: Boolean, default: false }, // OTP verified
  last_login: { type: Date }, // Last login timestamp
  otp_code: { type: String, default: null }, // Temporary OTP storage
  permissions: [{
    resource: String,
    actions: [String]
  }], // Custom permissions for granular RBAC
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: [Number],
    address: String
  }, // GeoJSON for precise location
}, {
  timestamps: true
});

// Pre-save hook to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to generate JWT token with user details
userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign({
    _id: this._id,
    user_type: this.user_type,
    permissions: this.permissions
  }, process.env.JWT_SECRET, {
    expiresIn: '24h'
  });
  return token;
};

// Static method to get user permissions
userSchema.statics.getPermissions = function(userId) {
  return this.findById(userId).select('permissions');
};

// Static method to check if user has permission
userSchema.statics.hasPermission = async function(userId, resource, action) {
  const user = await this.findById(userId);
  if (!user) return false;
  
  const permission = user.permissions.find(p => 
    p.resource === resource && p.actions.includes(action)
  );
  
  return !!permission;
};

module.exports = mongoose.model('User', userSchema);