const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const { asyncHandler } = require('../middleware/errorMiddleware');
const { validationResult } = require('express-validator');
const { generateToken } = require('../utils/jwt');

/**
 * Register new admin
 * @route POST /api/admin/auth/register
 * @access Public
 */
const registerAdmin = asyncHandler(async (req, res) => {
  try {
    console.log('👤 Admin registration request:', req.body);

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('❌ Validation errors:', errors.array());
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, email, password, confirmPassword } = req.body;

    // Check if passwords match
    if (password !== confirmPassword) {
      console.log('❌ Passwords do not match');
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match'
      });
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ 
      email: email.toLowerCase() 
    });

    if (existingAdmin) {
      console.log('❌ Admin already exists:', email);
      return res.status(409).json({
        success: false,
        message: 'Admin already exists'
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);
    console.log('🔐 Password hashed for admin:', email);

    // Create new admin
    const admin = new Admin({
      name: name.trim(),
      email: email.toLowerCase(),
      passwordHash,
      role: 'admin'
    });

    await admin.save();
    console.log('✅ Admin registered successfully:', email);

    // Generate token with role
    const token = generateToken(admin._id, admin.role);

    res.status(201).json({
      success: true,
      message: 'Admin registered successfully',
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      },
      token
    });
  } catch (error) {
    console.error('❌ Admin registration error:', error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Admin already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * Login admin
 * @route POST /api/admin/auth/login
 * @access Public
 */
const loginAdmin = asyncHandler(async (req, res) => {
  try {
    console.log('🔐 Admin login request:', {
      email: req.body.email,
      hasPassword: !!req.body.password
    });

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('❌ Validation errors:', errors.array());
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      console.log('❌ Missing email or password');
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find admin by email
    console.log('🔍 Admin login request email:', email);
    const admin = await Admin.findOne({ email: email.toLowerCase() });
    console.log('🔍 Admin found:', !!admin);
    
    if (admin) {
      console.log('🔍 Admin details:', {
        id: admin._id,
        email: admin.email,
        hasPasswordHash: !!admin.passwordHash,
        isActive: admin.isActive
      });
    }

    if (!admin) {
      console.log('❌ Admin not found:', email);
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    // Check if admin is active
    if (!admin.isActive) {
      console.log('❌ Admin account is inactive:', email);
      return res.status(401).json({
        success: false,
        message: 'Account is inactive'
      });
    }

    // Compare password
    console.log('🔍 Comparing password for admin:', email);
    console.log('🔍 Input password length:', password.length);
    console.log('🔍 Stored passwordHash length:', admin.passwordHash.length);
    
    const isMatch = await admin.matchPassword(password);
    console.log('🔍 Password compare result:', isMatch);

    if (!isMatch) {
      console.log('❌ Password mismatch for admin:', email);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Generate token with role
    const token = generateToken(admin._id, admin.role);

    console.log('✅ Admin logged in successfully:', email);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        lastLogin: admin.lastLogin
      },
      token
    });
  } catch (error) {
    console.error('❌ Admin login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * Get admin profile
 * @route GET /api/admin/auth/me
 * @access Private
 */
const getAdminProfile = asyncHandler(async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    res.json({
      success: true,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        lastLogin: admin.lastLogin,
        createdAt: admin.createdAt
      }
    });
  } catch (error) {
    console.error('❌ Get admin profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

/**
 * Debug admin
 * @route GET /api/admin/auth/debug-admin
 * @access Private
 */
const debugAdmin = asyncHandler(async (req, res) => {
  try {
    console.log('🔍 Debug admin request');
    res.json({
      success: true,
      message: 'Debug endpoint working',
      admin: req.admin,
      headers: req.headers
    });
  } catch (error) {
    console.error('❌ Debug admin error:', error);
    res.status(500).json({
      success: false,
      message: 'Debug error',
      error: error.message
    });
  }
});

module.exports = {
  registerAdmin,
  loginAdmin,
  getAdminProfile,
  debugAdmin
};
