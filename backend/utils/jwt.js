const jwt = require('jsonwebtoken');

/**
 * Generate JWT token
 * @param {string} adminId - Admin ID
 * @returns {string} JWT token
 */
const generateToken = (adminId) => {
  return jwt.sign(
    { id: adminId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

module.exports = { generateToken };
