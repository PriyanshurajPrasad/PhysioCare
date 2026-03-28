const jwt = require('jsonwebtoken');

/**
 * Generate JWT token
 * @param {string} adminId - Admin ID
 * @param {string} role - User role
 * @returns {string} JWT token
 */
const generateToken = (adminId, role = 'admin') => {
  return jwt.sign(
    { id: adminId, role: role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

module.exports = { generateToken };
