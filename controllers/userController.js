const Appointment = require('../models/Appointment');
const { asyncHandler } = require('../middleware/errorMiddleware');
const { body, validationResult } = require('express-validator');

/**
 * Create a new appointment
 * @route POST /api/user/appointment
 * @access Private
 */
const createAppointment = asyncHandler(async (req, res) => {
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
    phone,
    problemDescription,
    preferredDate,
    preferredTime
  } = req.body;

  // Create appointment with authenticated user's ID
  const appointment = await Appointment.create({
    userId: req.user.id,
    patientName,
    phone,
    problemDescription,
    preferredDate: new Date(preferredDate),
    preferredTime,
    status: 'pending'
  });

  // Populate user information for response
  const populatedAppointment = await Appointment.findById(appointment._id)
    .populate('userId', 'name email phone');

  res.status(201).json({
    success: true,
    message: 'Appointment created successfully',
    data: {
      appointment: populatedAppointment
    }
  });
});

/**
 * Get current user's appointments
 * @route GET /api/user/my-appointments
 * @access Private
 */
const getMyAppointments = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 10 } = req.query;

  // Build query
  const query = { userId: req.user.id };
  
  if (status) {
    query.status = status;
  }

  // Pagination
  const skip = (page - 1) * limit;

  // Find appointments with pagination
  const appointments = await Appointment.find(query)
    .populate('userId', 'name email phone')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  // Get total count for pagination info
  const total = await Appointment.countDocuments(query);

  res.json({
    success: true,
    data: {
      appointments,
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
 * Get a specific appointment by ID
 * @route GET /api/user/appointment/:id
 * @access Private
 */
const getAppointmentById = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id)
    .populate('userId', 'name email phone');

  if (!appointment) {
    return res.status(404).json({
      success: false,
      message: 'Appointment not found'
    });
  }

  // Check if user owns this appointment or is admin
  if (appointment.userId._id.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. You can only view your own appointments.'
    });
  }

  res.json({
    success: true,
    data: {
      appointment
    }
  });
});

/**
 * Update appointment (only allowed for pending appointments)
 * @route PUT /api/user/appointment/:id
 * @access Private
 */
const updateAppointment = asyncHandler(async (req, res) => {
  // Validate request body
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    return res.status(404).json({
      success: false,
      message: 'Appointment not found'
    });
  }

  // Check if user owns this appointment
  if (appointment.userId.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. You can only update your own appointments.'
    });
  }

  // Only allow updates if appointment is still pending
  if (appointment.status !== 'pending') {
    return res.status(400).json({
      success: false,
      message: 'Cannot update appointment. It has already been processed.'
    });
  }

  const {
    patientName,
    phone,
    problemDescription,
    preferredDate,
    preferredTime
  } = req.body;

  // Update appointment
  const updatedAppointment = await Appointment.findByIdAndUpdate(
    req.params.id,
    {
      patientName,
      phone,
      problemDescription,
      preferredDate: new Date(preferredDate),
      preferredTime
    },
    { new: true, runValidators: true }
  ).populate('userId', 'name email phone');

  res.json({
    success: true,
    message: 'Appointment updated successfully',
    data: {
      appointment: updatedAppointment
    }
  });
});

/**
 * Cancel appointment
 * @route DELETE /api/user/appointment/:id
 * @access Private
 */
const cancelAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    return res.status(404).json({
      success: false,
      message: 'Appointment not found'
    });
  }

  // Check if user owns this appointment
  if (appointment.userId.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. You can only cancel your own appointments.'
    });
  }

  // Only allow cancellation if appointment is pending or approved
  if (['completed', 'cancelled'].includes(appointment.status)) {
    return res.status(400).json({
      success: false,
      message: 'Cannot cancel appointment. It has already been completed or cancelled.'
    });
  }

  // Update appointment status to cancelled
  appointment.status = 'cancelled';
  await appointment.save();

  res.json({
    success: true,
    message: 'Appointment cancelled successfully',
    data: {
      appointment
    }
  });
});

/**
 * Get appointment statistics for current user
 * @route GET /api/user/appointment-stats
 * @access Private
 */
const getAppointmentStats = asyncHandler(async (req, res) => {
  const stats = await Appointment.aggregate([
    {
      $match: { userId: req.user._id }
    },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);

  const result = {
    pending: 0,
    approved: 0,
    completed: 0,
    cancelled: 0,
    total: 0
  };

  stats.forEach(stat => {
    result[stat._id] = stat.count;
    result.total += stat.count;
  });

  res.json({
    success: true,
    data: {
      stats: result
    }
  });
});

// Validation rules
const createAppointmentValidation = [
  body('patientName')
    .trim()
    .notEmpty()
    .withMessage('Patient name is required')
    .isLength({ max: 50 })
    .withMessage('Patient name cannot exceed 50 characters'),
  
  body('phone')
    .notEmpty()
    .withMessage('Phone number is required')
    .matches(/^[+]?[\d\s-()]+$/)
    .withMessage('Please enter a valid phone number'),
  
  body('problemDescription')
    .trim()
    .notEmpty()
    .withMessage('Problem description is required')
    .isLength({ max: 500 })
    .withMessage('Problem description cannot exceed 500 characters'),
  
  body('preferredDate')
    .isISO8601()
    .withMessage('Please enter a valid date')
    .custom(value => {
      const date = new Date(value);
      if (date <= new Date()) {
        throw new Error('Preferred date must be in the future');
      }
      return true;
    }),
  
  body('preferredTime')
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Please enter a valid time in HH:MM format (24-hour)')
];

const updateAppointmentValidation = [
  body('patientName')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Patient name cannot be empty')
    .isLength({ max: 50 })
    .withMessage('Patient name cannot exceed 50 characters'),
  
  body('phone')
    .optional()
    .matches(/^[+]?[\d\s-()]+$/)
    .withMessage('Please enter a valid phone number'),
  
  body('problemDescription')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Problem description cannot be empty')
    .isLength({ max: 500 })
    .withMessage('Problem description cannot exceed 500 characters'),
  
  body('preferredDate')
    .optional()
    .isISO8601()
    .withMessage('Please enter a valid date')
    .custom(value => {
      const date = new Date(value);
      if (date <= new Date()) {
        throw new Error('Preferred date must be in the future');
      }
      return true;
    }),
  
  body('preferredTime')
    .optional()
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Please enter a valid time in HH:MM format (24-hour)')
];

module.exports = {
  createAppointment,
  getMyAppointments,
  getAppointmentById,
  updateAppointment,
  cancelAppointment,
  getAppointmentStats,
  createAppointmentValidation,
  updateAppointmentValidation
};
