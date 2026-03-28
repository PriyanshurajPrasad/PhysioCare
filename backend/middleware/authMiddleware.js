const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';

// @desc    Generate JWT Token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, JWT_SECRET, {
    expiresIn: JWT_EXPIRE,
  });
};

// @desc    Protect routes - verify JWT token
const protect = async (req, res, next) => {
  let token;

  // Check for token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];
      console.log('🔍 Token found:', token.substring(0, 20) + '...');

      // Verify token
      const decoded = jwt.verify(token, JWT_SECRET);
      console.log('🔍 Token decoded:', decoded);

      // Get admin from the token
      const Admin = require('../models/Admin');
      const admin = await Admin.findById(decoded.id);

      if (!admin) {
        console.log('❌ Admin not found for ID:', decoded.id);
        return res.status(401).json({
          success: false,
          message: 'Admin not found'
        });
      }

      console.log('✅ Admin authenticated:', admin.email);
      req.admin = admin;
      req.user = admin; // Keep for compatibility
      req.tokenRole = decoded.role; // Store role from token
      next();
    } catch (error) {
      console.error('❌ Token verification error:', error);
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token failed'
      });
    }
  }

  if (!token) {
    console.log('❌ No token provided');
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token'
    });
  }
};

// @desc    Admin only middleware
const adminOnly = (req, res, next) => {
  // Check both the user role and token role
  const userRole = req.admin?.role || req.user?.role;
  const tokenRole = req.tokenRole;

  if (userRole === 'admin' && tokenRole === 'admin') {
    next();
  } else {
    console.log('❌ Admin access denied - User role:', userRole, 'Token role:', tokenRole);
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin only.'
    });
  }
};

module.exports = {
  generateToken,
  protect,
  adminOnly
};
