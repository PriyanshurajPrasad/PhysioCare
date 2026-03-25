const jwt = require('jsonwebtoken');

/**
 * Generate JWT token for user authentication
 * @param {string} id - User ID to include in token payload
 * @param {string} role - User role to include in token payload
 * @returns {string} JWT token
 */
const generateToken = (id, role) => {
  // Get JWT secret from environment variables
  const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_for_development';
  
  // Get JWT expiration time from environment variables (default to 30 days)
  const JWT_EXPIRE = process.env.JWT_EXPIRE || '30d';

  // Create token payload
  const payload = {
    id,
    role
  };

  // Generate and return JWT token
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRE
  });
};

/**
 * Verify JWT token and return decoded payload
 * @param {string} token - JWT token to verify
 * @returns {object} Decoded token payload
 */
const verifyToken = (token) => {
  const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_for_development';
  
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

module.exports = {
  generateToken,
  verifyToken
};
