const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * Admin Schema for Physiotherapy Clinic
 * Manages admin authentication and authorization
 */
const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please enter a valid email address'
    ]
  },
  passwordHash: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  role: {
    type: String,
    default: 'admin',
    enum: ['admin']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: null
  }
}, {
  timestamps: true,
  collection: 'admins'  // Explicitly set collection name
});

/**
 * Match password method
 */
adminSchema.methods.matchPassword = async function(plainPassword) {
  try {
    console.log('🔐 Comparing password for admin:', this.email);
    return await bcrypt.compare(plainPassword, this.passwordHash);
  } catch (error) {
    console.error('❌ Password comparison error:', error);
    throw error;
  }
};

/**
 * Generate auth token
 */
adminSchema.methods.generateAuthToken = function() {
  try {
    console.log('🔑 Generating token for admin:', this.email);
    const token = jwt.sign(
      { 
        id: this._id,
        email: this.email,
        role: this.role 
      },
      process.env.JWT_SECRET,
      { 
        expiresIn: process.env.JWT_EXPIRE || '7d' 
      }
    );
    return token;
  } catch (error) {
    console.error('❌ Token generation error:', error);
    throw error;
  }
};

// Remove passwordHash from JSON output
adminSchema.methods.toJSON = function() {
  const adminObject = this.toObject();
  delete adminObject.passwordHash;
  return adminObject;
};

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
