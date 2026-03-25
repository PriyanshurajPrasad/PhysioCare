const Service = require('../models/Service');
const Testimonial = require('../models/Testimonial');
const Contact = require('../models/Contact');
const { asyncHandler } = require('../middleware/errorMiddleware');
const { body, validationResult } = require('express-validator');
const sseManager = require('../utils/sseManager');

/**
 * Get all active services
 * @route GET /api/services
 * @access Public
 */
const getServices = asyncHandler(async (req, res) => {
  const { search, page = 1, limit = 10 } = req.query;

  let services;

  if (search) {
    // Search services by title or description
    services = await Service.search(search)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
  } else {
    // Get only active services
    services = await Service.findActive()
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
  }

  // Get total count for pagination
  const total = search 
    ? await Service.countDocuments({
        $and: [
          { isActive: true },
          {
            $or: [
              { title: { $regex: search, $options: 'i' } },
              { description: { $regex: search, $options: 'i' } }
            ]
          }
        ]
      })
    : await Service.countDocuments({ isActive: true });

  res.json({
    success: true,
    data: {
      services,
      pagination: {
        current: parseInt(page),
        pageSize: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
});

/**
 * Get a specific service by ID
 * @route GET /api/services/:id
 * @access Public
 */
const getServiceById = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);

  if (!service) {
    return res.status(404).json({
      success: false,
      message: 'Service not found'
    });
  }

  // Only return active services for public access
  if (!service.isActive) {
    return res.status(404).json({
      success: false,
      message: 'Service not available'
    });
  }

  res.json({
    success: true,
    data: {
      service
    }
  });
});

/**
 * Get all approved testimonials
 * @route GET /api/testimonials
 * @access Public
 */
const getTestimonials = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, rating } = req.query;

  // Build query
  const query = { isApproved: true };
  
  if (rating) {
    query.rating = parseInt(rating);
  }

  // Pagination
  const skip = (page - 1) * limit;

  // Find approved testimonials with pagination
  const testimonials = await Testimonial.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  // Get total count for pagination info
  const total = await Testimonial.countDocuments(query);

  // Get rating statistics
  const ratingStats = await Testimonial.getRatingStats();

  res.json({
    success: true,
    data: {
      testimonials,
      ratingStats,
      pagination: {
        current: parseInt(page),
        pageSize: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
});

/**
 * Create a new testimonial
 * @route POST /api/testimonials
 * @access Public
 */
const createTestimonial = asyncHandler(async (req, res) => {
  // Validate request body
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const {
    patientName,
    review,
    rating,
    service,
    treatmentDate
  } = req.body;

  const testimonial = await Testimonial.create({
    patientName,
    review,
    rating,
    service,
    treatmentDate: treatmentDate ? new Date(treatmentDate) : undefined,
    isApproved: false // New testimonials need admin approval
  });

  res.status(201).json({
    success: true,
    message: 'Testimonial submitted successfully. It will be visible after admin approval.',
    data: {
      testimonial
    }
  });
});

/**
 * Submit contact form
 * @route POST /api/contact
 * @access Public
 */
const createContact = asyncHandler(async (req, res) => {
  // Validate request body
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const {
    name,
    email,
    phone,
    message,
    subject,
    priority
  } = req.body;

  const contact = await Contact.create({
    name,
    email,
    phone,
    message,
    subject,
    priority: priority || 'medium',
    status: 'new',
    isRead: false
  });

  console.log('📧 New contact created:', {
    id: contact._id,
    name: contact.name,
    email: contact.email,
    subject: contact.subject
  });

  // Emit SSE event to admin dashboard
  try {
    // Note: In a real app, you'd get the admin ID from the contact assignment
    // For now, we'll emit to all connected admins
    sseManager.emitNewMessage({
      _id: contact._id,
      adminId: 'broadcast', // Broadcast to all admins
      name: contact.name,
      email: contact.email,
      subject: contact.subject,
      createdAt: contact.createdAt
    });
  } catch (error) {
    console.error('❌ Failed to emit SSE event:', error);
  }

  res.status(201).json({
    success: true,
    message: 'Contact form submitted successfully. We will get back to you soon.',
    data: {
      contact: {
        id: contact._id,
        name: contact.name,
        email: contact.email,
        subject: contact.subject,
        createdAt: contact.createdAt
      }
    }
  });
});

/**
 * Get rating statistics
 * @route GET /api/testimonials/stats
 * @access Public
 */
const getTestimonialStats = asyncHandler(async (req, res) => {
  const stats = await Testimonial.getRatingStats();

  res.json({
    success: true,
    data: {
      stats
    }
  });
});

/**
 * Get featured testimonials (highest rated)
 * @route GET /api/testimonials/featured
 * @access Public
 */
const getFeaturedTestimonials = asyncHandler(async (req, res) => {
  const { limit = 5 } = req.query;

  // Get highest rated approved testimonials
  const testimonials = await Testimonial.find({ isApproved: true })
    .sort({ rating: -1, createdAt: -1 })
    .limit(parseInt(limit));

  res.json({
    success: true,
    data: {
      testimonials
    }
  });
});

/**
 * Search services
 * @route GET /api/services/search
 * @access Public
 */
const searchServices = asyncHandler(async (req, res) => {
  const { q: query, page = 1, limit = 10 } = req.query;

  if (!query) {
    return res.status(400).json({
      success: false,
      message: 'Search query is required'
    });
  }

  const services = await Service.search(query)
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  const total = await Service.countDocuments({
    $and: [
      { isActive: true },
      {
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } }
        ]
      }
    ]
  });

  res.json({
    success: true,
    data: {
      services,
      query,
      pagination: {
        current: parseInt(page),
        pageSize: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
});

// Validation rules
const createTestimonialValidation = [
  body('patientName')
    .trim()
    .notEmpty()
    .withMessage('Patient name is required')
    .isLength({ max: 50 })
    .withMessage('Patient name cannot exceed 50 characters'),
  
  body('review')
    .trim()
    .notEmpty()
    .withMessage('Review is required')
    .isLength({ max: 1000 })
    .withMessage('Review cannot exceed 1000 characters'),
  
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be an integer between 1 and 5'),
  
  body('service')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Service name cannot exceed 100 characters'),
  
  body('treatmentDate')
    .optional()
    .isISO8601()
    .withMessage('Please enter a valid treatment date')
    .custom(value => {
      const date = new Date(value);
      if (date > new Date()) {
        throw new Error('Treatment date cannot be in the future');
      }
      return true;
    })
];

const createContactValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 50 })
    .withMessage('Name cannot exceed 50 characters'),
  
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(),
  
  body('phone')
    .optional()
    .matches(/^[+]?[\d\s-()]+$/)
    .withMessage('Please enter a valid phone number'),
  
  body('message')
    .trim()
    .notEmpty()
    .withMessage('Message is required')
    .isLength({ max: 2000 })
    .withMessage('Message cannot exceed 2000 characters'),
  
  body('subject')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Subject cannot exceed 100 characters'),
  
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be one of: low, medium, high')
];

module.exports = {
  getServices,
  getServiceById,
  getTestimonials,
  createTestimonial,
  createContact,
  getTestimonialStats,
  getFeaturedTestimonials,
  searchServices,
  createTestimonialValidation,
  createContactValidation
};
