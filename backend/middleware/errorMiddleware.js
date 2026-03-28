const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Enhanced error logging
  console.error('===============================================');
  console.error('ERROR HANDLER - ERROR DETAILS');
  console.error('===============================================');
  console.error('Request URL:', req.originalUrl);
  console.error('Request Method:', req.method);
  console.error('Request Body:', JSON.stringify(req.body, null, 2));
  console.error('Headers:', JSON.stringify(req.headers, null, 2));
  console.error('Error Name:', err.name);
  console.error('Error Message:', err.message);
  console.error('Error Code:', err.code);
  console.error('Error Status:', err.statusCode);
  console.error('Full Error:', JSON.stringify(err, null, 2));
  console.error('Stack Trace:', err.stack);
  console.error('===============================================');

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = { message, statusCode: 404 };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = field === 'email' ? 'Email already exists' : 'Duplicate field value entered';
    error = { message, statusCode: 409 };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(error => ({
      field: error.path,
      message: error.message,
      value: error.value
    }));
    error = { 
      message: 'Validation failed',
      errors: errors,
      statusCode: 400 
    };
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    error = { message, statusCode: 401 };
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired';
    error = { message, statusCode: 401 };
  }

  // Default error
  const statusCode = error.statusCode || err.statusCode || 500;
  const message = error.message || 'Internal Server Error';

  const response = {
    success: false,
    message: message,
    ...(error.errors && { errors: error.errors }),
    ...(process.env.NODE_ENV === 'development' && { 
      stack: err.stack,
      originalError: err,
      requestBody: req.body,
      requestHeaders: req.headers
    })
  };

  console.error('Final Error Response:', JSON.stringify(response, null, 2));
  console.error('===============================================');

  res.status(statusCode).json(response);
};

const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

module.exports = {
  asyncHandler,
  errorHandler,
  notFound
};
