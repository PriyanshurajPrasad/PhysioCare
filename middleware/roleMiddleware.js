/**
 * Role-based Authorization Middleware
 * Restricts access based on user roles
 */

/**
 * Middleware to check if user has admin role
 * Must be used after authenticate middleware
 */
const requireAdmin = (req, res, next) => {
  // Check if user exists and has admin role
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required.'
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.'
    });
  }

  next();
};

/**
 * Middleware to check if user has specific role(s)
 * @param {string|Array} roles - Single role as string or multiple roles as array
 * @returns {Function} Middleware function
 */
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    // Convert single role to array for consistent handling
    const allowedRoles = Array.isArray(roles) ? roles : [roles];
    
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role(s): ${allowedRoles.join(', ')}`
      });
    }

    next();
  };
};

/**
 * Middleware to check if user can access their own resources
 * Allows admin to access any resource
 * @param {string} userIdParam - Parameter name containing user ID (default: 'id')
 * @returns {Function} Middleware function
 */
const requireOwnership = (userIdParam = 'id') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    // Admin can access any resource
    if (req.user.role === 'admin') {
      return next();
    }

    // Check if user is accessing their own resource
    const resourceUserId = req.params[userIdParam];
    
    if (req.user._id.toString() !== resourceUserId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only access your own resources.'
      });
    }

    next();
  };
};

/**
 * Middleware to check if user is either admin or the resource owner
 * @param {string} userIdParam - Parameter name containing user ID (default: 'userId')
 * @returns {Function} Middleware function
 */
const requireAdminOrOwnership = (userIdParam = 'userId') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    // Admin can access any resource
    if (req.user.role === 'admin') {
      return next();
    }

    // Check if user is accessing their own resource
    const resourceUserId = req.params[userIdParam];
    
    if (req.user._id.toString() !== resourceUserId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only access your own resources.'
      });
    }

    next();
  };
};

module.exports = {
  requireAdmin,
  requireRole,
  requireOwnership,
  requireAdminOrOwnership
};
