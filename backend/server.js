const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Connect to database
const connectDB = require('./config/database');
connectDB();

// Import routes
const healthRoutes = require('./routes/healthRoutes');
const publicRoutes = require('./routes/publicRoutes');
const adminAuthRoutes = require('./routes/adminAuthRoutes');
const adminRoutes = require('./routes/adminRoutes');
const contactRoutes = require('./routes/contactRoutes');
const aboutRoutes = require('./routes/aboutRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

// Import middleware
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

// Initialize Express app
const app = express();

// CORS Configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) {
      return callback(null, true);
    }

    // Define allowed origins
    const allowedOrigins = [
      // Development origins
      'http://localhost:5173',
      'http://localhost:5174', 
      'http://localhost:5175',
      'http://localhost:3000',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:5174',
      'http://127.0.0.1:5175',
      'http://127.0.0.1:3000',
      // Environment-specific origins
      ...(process.env.CLIENT_URL ? [process.env.CLIENT_URL] : []),
      ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : []),
      ...(process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : [])
    ];

    // Check if origin is explicitly allowed
    if (allowedOrigins.includes(origin)) {
      console.log('✅ CORS: Origin explicitly allowed:', origin);
      return callback(null, true);
    }

    // Allow localhost origins (any port)
    if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
      console.log('✅ CORS: Localhost origin allowed:', origin);
      return callback(null, true);
    }

    // Allow any Vercel deployment
    if (origin.endsWith('.vercel.app')) {
      console.log('✅ CORS: Vercel origin allowed:', origin);
      return callback(null, true);
    }

    // Allow any origin in development
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ CORS: Development mode - origin allowed:', origin);
      return callback(null, true);
    }

    // Log blocked origins for debugging
    console.log('❌ CORS: Origin blocked:', origin);
    console.log('📋 Allowed origins:', allowedOrigins);
    
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With',
    'Accept',
    'Origin',
    'Access-Control-Request-Method',
    'Access-Control-Request-Headers'
  ],
  optionsSuccessStatus: 200, // Some legacy browsers choke on 204
  preflightContinue: false,
  maxAge: 86400 // Cache preflight for 24 hours
};

// Log CORS configuration on startup
console.log('🌐 CORS Configuration:');
console.log('   • Environment:', process.env.NODE_ENV || 'development');
console.log('   • CLIENT_URL:', process.env.CLIENT_URL || 'not set');
console.log('   • FRONTEND_URL:', process.env.FRONTEND_URL || 'not set');
console.log('   • ALLOWED_ORIGINS:', process.env.ALLOWED_ORIGINS || 'not set');
console.log('   • Credentials:', corsOptions.credentials);
console.log('   • Methods:', corsOptions.methods.join(', '));
console.log('   • Headers:', corsOptions.allowedHeaders.join(', '));

// Middleware
app.use(cors(corsOptions));

// Response time middleware
app.use((req, res, next) => {
  const start = Date.now();
  
  // Store response time in a local variable for logging
  res.on('finish', () => {
    const duration = Date.now() - start;
    
    // Log slow requests
    if (duration > 5000) { // Log requests taking more than 5 seconds
      console.log('🐌 Slow request detected:', {
        method: req.method,
        url: req.originalUrl,
        duration: `${duration}ms`,
        userAgent: req.get('User-Agent'),
        ip: req.ip
      });
    }
  });
  
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api', publicRoutes);
app.use('/api/admin/auth', adminAuthRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', contactRoutes);
app.use('/api', aboutRoutes);
app.use('/api', reviewRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  const healthCheck = {
    status: 'OK', 
    message: 'Backend server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 4500,
    database: 'connected', // This would be more sophisticated in production
    memory: process.memoryUsage(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || '1.0.0',
    routes: {
      adminAuth: '/api/admin/auth/*',
      admin: '/api/admin/*',
      public: '/api/*',
      health: '/api/health'
    }
  };
  
  console.log('🏥 Health check accessed:', {
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: healthCheck.timestamp
  });
  
  res.status(200).json(healthCheck);
});

// Debug endpoint for admin auth
app.get('/api/debug/admin-auth', (req, res) => {
  const debugInfo = {
    message: 'Admin auth debug endpoint',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    backendURL: process.env.NODE_ENV === 'production' ? 
      'https://physiocare-backend-ov2z.onrender.com' : 
      'http://localhost:4500',
    headers: req.headers,
    routes: {
      login: 'POST /api/admin/auth/login',
      register: 'POST /api/admin/auth/register',
      profile: 'GET /api/admin/auth/me'
    },
    cors: {
      origin: req.get('Origin'),
      allowedOrigins: ['http://localhost:5173', 'https://*.vercel.app'],
      credentials: true
    }
  };
  
  console.log('🔍 Admin auth debug accessed:', debugInfo);
  res.status(200).json(debugInfo);
});

// Error handling middleware (must be last)
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 4500;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

module.exports = app;
