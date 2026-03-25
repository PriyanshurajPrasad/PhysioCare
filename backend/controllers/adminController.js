const Admin = require('../models/Admin');
const Appointment = require('../models/Appointment');
const Service = require('../models/Service');
const Testimonial = require('../models/Testimonial');
const Contact = require('../models/Contact');
const About = require('../models/About');
const mongoose = require('mongoose');
const { asyncHandler } = require('../middleware/errorMiddleware');
const { body, validationResult } = require('express-validator');
const emailService = require('../utils/emailService');

/**
 * Get single contact by ID
 * @route GET /api/admin/contacts/:id
 * @access Admin
 */
const getContactById = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    return res.status(404).json({
      success: false,
      message: 'Contact message not found'
    });
  }

  res.json({
    success: true,
    data: {
      contact
    }
  });
});

/**
 * Update contact status
 * @route PATCH /api/admin/contacts/:id/status
 * @route PATCH /api/admin/messages/:id/resolve
 * @access Admin
 */
const updateContactStatus = asyncHandler(async (req, res) => {
  const { status } = req.body || {};
  
  // If this is a resolve request, set status to resolved automatically
  if (req.originalUrl.includes('/resolve')) {
    const resolvedStatus = 'resolved';
    
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      });
    }

    contact.status = resolvedStatus;
    await contact.save();

    res.json({
      success: true,
      message: 'Contact status updated successfully',
      data: {
        contact
      }
    });
    return;
  }

  if (!['new', 'in-progress', 'resolved'].includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid status. Must be: new, in-progress, or resolved'
    });
  }

  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    return res.status(404).json({
      success: false,
      message: 'Contact message not found'
    });
  }

  contact.status = status;
  await contact.save();

  res.json({
    success: true,
    message: 'Contact status updated successfully',
    data: {
      contact
    }
  });
});

/**
 * Delete contact
 * @route DELETE /api/admin/contacts/:id
 * @access Admin
 */
const deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    return res.status(404).json({
      success: false,
      message: 'Contact message not found'
    });
  }

  await Contact.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: 'Contact message deleted successfully'
  });
});

/**
 * Delete appointment
 * @route DELETE /api/admin/appointments/:id
 * @access Admin
 */
const deleteAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    return res.status(404).json({
      success: false,
      message: 'Appointment not found'
    });
  }

  await Appointment.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: 'Appointment deleted successfully'
  });
});

/**
 * Create appointment
 * @route POST /api/admin/appointments
 * @access Admin
 */
const createAppointment = asyncHandler(async (req, res) => {
  console.log('📅 CREATE APPOINTMENT HIT');
  console.log('📋 Request body:', JSON.stringify(req.body, null, 2));
  console.log('🔑 Admin object:', JSON.stringify(req.admin, null, 2));
  console.log('🔑 Admin ID:', req.admin?.id);
  console.log('🔑 Admin email:', req.admin?.email);

  // Validate request body
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('❌ Validation errors:', JSON.stringify(errors.array(), null, 2));
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.path || err.param,
        message: err.msg,
        value: err.value
      }))
    });
  }

  // Helper function to normalize optional fields
  const normalizeOptionalField = (value) => {
    if (!value || value === '' || value === 'none' || value === 'null' || value === 'undefined') {
      return null;
    }
    return value;
  };

  const normalizeId = (value) => {
    if (!value || value === '' || value === 'none' || value === 'null' || value === 'undefined') {
      return null;
    }
    return value;
  };

  const {
    messageId,
    patientName,
    patientEmail,
    patientPhone,
    serviceName,
    serviceId,
    appointmentDate,
    appointmentTime,
    mode,
    notes
  } = req.body;

  console.log('📊 Extracted fields:', {
    messageId,
    patientName,
    patientEmail,
    patientPhone,
    serviceName,
    serviceId,
    appointmentDate,
    appointmentTime,
    mode,
    notes
  });

  // Normalize optional IDs and fields
  const normalizedMessageId = normalizeId(messageId);
  const normalizedServiceId = normalizeId(serviceId);
  const normalizedPatientPhone = normalizeOptionalField(patientPhone);
  const normalizedServiceName = normalizeOptionalField(serviceName);
  const normalizedNotes = normalizeOptionalField(notes);

  console.log('🔧 Normalized fields:', {
    normalizedMessageId,
    normalizedServiceId,
    normalizedPatientPhone,
    normalizedServiceName,
    normalizedNotes
  });

  try {
    // If messageId is provided, fetch the contact message to get email
    let contactEmail = patientEmail;
    let contactName = patientName;
    let contactPhone = normalizedPatientPhone;

    if (normalizedMessageId) {
      console.log('🔍 Looking up contact:', normalizedMessageId);
      const contact = await Contact.findById(normalizedMessageId);
      if (!contact) {
        console.log('❌ Contact not found:', normalizedMessageId);
        return res.status(404).json({
          success: false,
          message: 'Contact message not found'
        });
      }

      // Use contact details if not provided in request
      contactEmail = contactEmail || contact.email;
      contactName = contactName || contact.name;
      contactPhone = contactPhone || contact.phone;

      console.log('📧 Using contact details:', {
        email: contactEmail,
        name: contactName,
        phone: contactPhone
      });
    }

    // Parse and validate date
    let parsedDate;
    try {
      console.log('📅 Parsing appointment date:', appointmentDate);
      
      // Support multiple date formats
      if (/^\d{4}-\d{2}-\d{2}$/.test(appointmentDate)) {
        // YYYY-MM-DD format (HTML5 date input)
        parsedDate = new Date(appointmentDate);
      }
      else if (/^\d{2}-\d{2}-\d{4}$/.test(appointmentDate)) {
        // DD-MM-YYYY format
        const [day, month, year] = appointmentDate.split('-');
        parsedDate = new Date(`${year}-${month}-${day}`);
      }
      else if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(appointmentDate)) {
        // MM/DD/YYYY format
        const [month, day, year] = appointmentDate.split('/');
        parsedDate = new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
      }
      else {
        throw new Error(`Unsupported date format: ${appointmentDate}. Use DD-MM-YYYY or YYYY-MM-DD`);
      }
      
      if (isNaN(parsedDate.getTime())) {
        throw new Error(`Invalid date: ${appointmentDate}`);
      }
      
      console.log('✅ Parsed date successfully:', parsedDate.toISOString());
    } catch (dateError) {
      console.error('❌ Date parsing error:', dateError.message);
      return res.status(400).json({
        success: false,
        message: 'Invalid appointment date format',
        error: dateError.message
      });
    }

    // Create appointment
    console.log('🔨 Building appointment data object...');
    const appointmentData = {
      messageId: normalizedMessageId,
      patientName: contactName,
      patientEmail: contactEmail,
      patientPhone: contactPhone,
      serviceName: normalizedServiceName,
      serviceId: normalizedServiceId,
      appointmentDate: parsedDate,
      appointmentTime,
      mode: mode || 'clinic',
      notes: normalizedNotes,
      createdByAdminId: req.admin.id
    };

    console.log('📊 Processed appointment data:', JSON.stringify(appointmentData, null, 2));

    console.log('💾 Saving appointment to database...');
    const appointment = await Appointment.create(appointmentData);
    console.log('✅ Appointment saved successfully:', appointment._id);

    // Send email notification (non-blocking)
    let emailResult = { success: false, error: 'Email service not available' };
    try {
      console.log('📧 Sending appointment confirmation email via Resend...');
      
      // Use the new clean interface
      emailResult = await emailService.sendAppointmentConfirmationEmail({
        to: appointment.patientEmail,
        patientName: appointment.patientName,
        appointmentDate: appointment.appointmentDate,
        appointmentTime: appointment.appointmentTime,
        mode: appointment.mode,
        notes: appointment.notes
      });
      
      if (emailResult.success && emailResult.accepted) {
        console.log('✅ Email request accepted by provider:', emailResult.messageId);
        await appointment.markEmailSent();
      } else {
        console.log('⚠️ Email request failed or not accepted:', emailResult.error);
        // Don't fail the appointment creation due to email issues
      }
    } catch (emailError) {
      console.error('❌ Resend service error:', emailError.message);
      emailResult = { success: false, error: emailError.message };
      // Continue with appointment creation even if email fails
    }

    // Populate related data for response (non-blocking)
    let populatedAppointment;
    try {
      console.log('🔄 Populating appointment data...');
      populatedAppointment = await Appointment.findById(appointment._id)
        .populate('messageId', 'name email phone subject')
        .populate('serviceId', 'title')
        .populate('createdByAdminId', 'name email');
      console.log('✅ Appointment populated successfully');
    } catch (populateError) {
      console.error('⚠️ Population failed:', populateError.message);
      // Use original appointment if population fails
      populatedAppointment = appointment;
    }

    console.log('✅ Appointment created successfully:', {
      id: appointment._id,
      patientName: appointment.patientName,
      emailSent: emailResult.success
    });

    // Build response message based on email status
    let responseMessage;
    if (emailResult.success && emailResult.accepted) {
      responseMessage = 'Appointment created and email sent successfully';
    } else if (emailResult.success) {
      responseMessage = 'Appointment created and email request accepted';
    } else {
      responseMessage = 'Appointment created successfully, but email failed';
    }

    // Build response with email status
    const responseData = {
      appointment: populatedAppointment,
      email: {
        sent: emailResult.success,
        accepted: emailResult.accepted || false,
        messageId: emailResult.messageId || null,
        error: emailResult.success ? null : emailResult.error
      }
    };

    console.log('📤 Sending success response...');
    res.status(201).json({
      success: true,
      message: responseMessage,
      data: responseData
    });
    console.log('✅ Response sent successfully');
    
  } catch (error) {
    console.error('❌ FATAL ERROR - Appointment creation failed:');
    console.error('❌ Error name:', error.name);
    console.error('❌ Error message:', error.message);
    console.error('❌ Error stack:', error.stack);
    console.error('❌ Request body was:', JSON.stringify(req.body, null, 2));
    console.error('❌ Admin ID was:', req.admin?.id);
    
    // Handle specific error types with detailed responses
    if (error.name === 'ValidationError') {
      // Mongoose validation error
      console.error('❌ Mongoose Validation Error Details:', Object.values(error.errors));
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: Object.values(error.errors).map(err => ({
          field: err.path,
          message: err.message,
          value: err.value
        }))
      });
    }
    
    if (error.name === 'CastError') {
      // Mongoose cast error (e.g., invalid ObjectId)
      console.error('❌ Mongoose Cast Error - Invalid ObjectId format');
      return res.status(400).json({
        success: false,
        message: 'Invalid data format',
        error: error.message,
        field: error.path
      });
    }
    
    if (error.name === 'MongoServerError' || error.name === 'MongoError') {
      // MongoDB specific errors
      console.error('❌ MongoDB Server Error:', error.code);
      return res.status(500).json({
        success: false,
        message: 'Database operation failed',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Database error'
      });
    }
    
    if (error.message && error.message.includes('required')) {
      // Required field missing
      console.error('❌ Required field missing error');
      return res.status(400).json({
        success: false,
        message: 'Required field is missing',
        error: error.message
      });
    }
    
    // Generic error with detailed info in development
    console.error('❌ Generic error - returning 500');
    res.status(500).json({
      success: false,
      message: 'Failed to create appointment',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      debugId: Date.now() // For tracking in logs
    });
  }
});

/**
 * Get email service status
 * @route GET /api/admin/email-status
 * @access Admin
 */
const getEmailStatus = asyncHandler(async (req, res) => {
  const status = emailService.getStatus();
  
  console.log('📧 Email service status requested:', status);
  
  res.json({
    success: true,
    message: 'Email service status retrieved',
    data: {
      emailService: status,
      timestamp: new Date().toISOString(),
      notes: status.enabled ? 
        'Email service is enabled and ready to send appointment confirmations' :
        'Email service is disabled - appointments will work but emails will not be sent'
    }
  });
});

/**
 * Test email functionality
 * @route POST /api/admin/test-email
 * @access Admin
 */
const testEmail = asyncHandler(async (req, res) => {
  const { to = 'test@example.com' } = req.body;
  
  console.log('🧪 Testing Resend email functionality...');
  console.log('📧 Test recipient:', to);
  
  try {
    // Test email sending using the new clean interface
    const emailResult = await emailService.sendAppointmentConfirmationEmail({
      to: to,
      patientName: 'Test Patient',
      appointmentDate: new Date('2026-03-10'),
      appointmentTime: '14:30',
      mode: 'clinic',
      notes: 'This is a test appointment confirmation'
    });
    
    console.log('📧 Test email result:', emailResult);
    
    if (emailResult.success) {
      res.json({
        success: true,
        message: 'Test email sent successfully',
        email: {
          sent: true,
          accepted: emailResult.accepted || false,
          messageId: emailResult.messageId,
          recipient: to,
          providerResponse: emailResult.providerResponse || null
        }
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Test email failed',
        email: {
          sent: false,
          accepted: false,
          error: emailResult.error,
          recipient: to
        }
      });
    }
  } catch (error) {
    console.error('❌ Test email error:', error);
    res.status(500).json({
      success: false,
      message: 'Test email failed',
      error: error.message
    });
  }
});

/**
 * Get all services
 * @route GET /api/admin/services
 * @access Admin
 */
const getServices = asyncHandler(async (req, res) => {
  const services = await Service.find().sort({ createdAt: -1 });

  res.json({
    success: true,
    data: {
      services
    }
  });
});

/**
 * Get single service by ID
 * @route GET /api/admin/services/:id
 * @access Admin
 */
const getServiceById = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);

  if (!service) {
    return res.status(404).json({
      success: false,
      message: 'Service not found'
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
 * Get About content
 * @route GET /api/admin/about
 * @access Admin
 */
const getAbout = asyncHandler(async (req, res) => {
  const about = await About.findOne();

  if (!about) {
    // Create default about if none exists
    const defaultAbout = await About.create({
      title: 'About PhysioCare Clinic',
      description: 'Professional physiotherapy services',
      mission: 'To provide the best care',
      vision: 'To be the leading clinic'
    });
    
    return res.json({
      success: true,
      data: {
        about: defaultAbout
      }
    });
  }

  res.json({
    success: true,
    data: {
      about
    }
  });
});

/**
 * Update About content
 * @route PUT /api/admin/about
 * @access Admin
 */
const updateAbout = asyncHandler(async (req, res) => {
  const { title, description, mission, vision, history } = req.body;

  let about = await About.findOne();

  if (!about) {
    about = await About.create({
      title,
      description,
      mission,
      vision,
      history
    });
  } else {
    about.title = title || about.title;
    about.description = description || about.description;
    about.mission = mission || about.mission;
    about.vision = vision || about.vision;
    about.history = history || about.history;
    
    await about.save();
  }

  res.json({
    success: true,
    message: 'About content updated successfully',
    data: {
      about
    }
  });
});

/**
 * Get dashboard statistics
 * @route GET /api/admin/dashboard
 * @access Admin
 */
const getDashboard = asyncHandler(async (req, res) => {
  console.log('📊 Dashboard stats requested by admin:', req.admin.email);
  
  // Get counts for various entities
  const [
    totalAppointments,
    totalServices,
    totalTestimonials,
    totalContacts,
    pendingAppointments,
    pendingTestimonials,
    unreadContacts
  ] = await Promise.all([
    Appointment.countDocuments(),
    Service.countDocuments({ isActive: true }),
    Testimonial.countDocuments(),
    Contact.countDocuments(),
    Appointment.countDocuments({ status: 'pending' }),
    Testimonial.countDocuments({ isApproved: false }),
    Contact.countDocuments({ isRead: false })
  ]);

  // Get today's messages
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayMessages = await Contact.countDocuments({
    createdAt: { $gte: today }
  });

  // Get latest messages
  const latestMessages = await Contact.find()
    .sort({ createdAt: -1 })
    .limit(10)
    .select('name email subject createdAt isRead');

  console.log('📊 Dashboard stats calculated:', {
    totalMessages: totalContacts,
    unreadMessages: unreadContacts,
    todayMessages,
    latestMessagesCount: latestMessages.length
  });

  res.json({
    success: true,
    stats: {
      totalMessages: totalContacts,
      unreadMessages: unreadContacts,
      todayMessages,
      latestMessages: latestMessages
    }
  });
});

/**
 * Get all users
 * @route GET /api/admin/users
 * @access Admin
 */
const getUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, role, search } = req.query;

  // Build query
  const query = {};
  
  if (role) {
    query.role = role;
  }
  
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } }
    ];
  }

  // Pagination
  const skip = (page - 1) * limit;

  // Find users with pagination
  const users = await User.find(query)
    .select('-password')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  // Get total count for pagination info
  const total = await User.countDocuments(query);

  res.json({
    success: true,
    data: {
      users,
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
 * Get all appointments
 * @route GET /api/admin/appointments
 * @access Admin
 */
const getAppointments = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status, date, search } = req.query;

  // Build query
  const query = {};
  
  if (status) {
    query.status = status;
  }
  
  if (date) {
    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 1);
    query.preferredDate = { $gte: startDate, $lt: endDate };
  }
  
  if (search) {
    query.$or = [
      { patientName: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } },
      { problemDescription: { $regex: search, $options: 'i' } }
    ];
  }

  // Pagination
  const skip = (page - 1) * limit;

  // Find appointments with pagination
  const appointments = await Appointment.find(query)
    .populate('createdByAdminId', 'name email')
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
 * Update appointment status
 * @route PUT /api/admin/appointment/:id/status
 * @access Admin
 */
const updateAppointmentStatus = asyncHandler(async (req, res) => {
  // Validate request body
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const { status, adminNotes } = req.body;

  const appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    return res.status(404).json({
      success: false,
      message: 'Appointment not found'
    });
  }

  // Update appointment
  appointment.status = status;
  if (adminNotes) {
    appointment.adminNotes = adminNotes;
  }
  
  await appointment.save();

  // Populate user information for response
  const updatedAppointment = await Appointment.findById(appointment._id)
    .populate('userId', 'name email phone');

  res.json({
    success: true,
    message: 'Appointment status updated successfully',
    data: {
      appointment: updatedAppointment
    }
  });
});

/**
 * Create a new service
 * @route POST /api/admin/service
 * @access Admin
 */
const createService = asyncHandler(async (req, res) => {
  console.log('📝 CREATE SERVICE HIT');
  console.log('📋 Request body:', req.body);
  console.log('👤 Admin user:', req.admin?.email);

  // Validate request body
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('❌ Validation errors:', errors.array());
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const { title, description, icon, duration, price } = req.body;

  console.log('📊 Extracted data:', { title, description, icon, duration, price });

  // Process optional fields - convert empty strings to undefined/null
  const serviceData = {
    title,
    description,
    icon,
    duration: duration && duration.trim() !== '' ? duration.trim() : undefined,
    price: price && price.trim() !== '' ? parseFloat(price) : undefined,
    isActive: true
  };

  console.log('📊 Processed data:', serviceData);

  try {
    const service = await Service.create(serviceData);

    console.log('✅ Service created successfully:', service._id);

    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      data: {
        service
      }
    });
  } catch (error) {
    console.error('❌ Service creation error:', error);
    throw error;
  }
});

/**
 * Update a service
 * @route PUT /api/admin/service/:id
 * @access Admin
 */
const updateService = asyncHandler(async (req, res) => {
  // Validate request body
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const { title, description, icon, duration, price, isActive } = req.body;

  const service = await Service.findByIdAndUpdate(
    req.params.id,
    { title, description, icon, duration, price, isActive },
    { new: true, runValidators: true }
  );

  if (!service) {
    return res.status(404).json({
      success: false,
      message: 'Service not found'
    });
  }

  res.json({
    success: true,
    message: 'Service updated successfully',
    data: {
      service
    }
  });
});

/**
 * Delete a service
 * @route DELETE /api/admin/service/:id
 * @access Admin
 */
const deleteService = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);

  if (!service) {
    return res.status(404).json({
      success: false,
      message: 'Service not found'
    });
  }

  await Service.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: 'Service deleted successfully'
  });
});

/**
 * Approve a testimonial
 * @route POST /api/admin/testimonial/approve
 * @access Admin
 */
const approveTestimonial = asyncHandler(async (req, res) => {
  // Validate request body
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const { testimonialId } = req.body;

  const testimonial = await Testimonial.findById(testimonialId);

  if (!testimonial) {
    return res.status(404).json({
      success: false,
      message: 'Testimonial not found'
    });
  }

  testimonial.isApproved = true;
  await testimonial.save();

  res.json({
    success: true,
    message: 'Testimonial approved successfully',
    data: {
      testimonial
    }
  });
});

/**
 * Get all testimonials (including pending ones)
 * @route GET /api/admin/testimonials
 * @access Admin
 */
const getTestimonials = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, isApproved, search } = req.query;

  // Build query
  const query = {};
  
  if (typeof isApproved === 'boolean') {
    query.isApproved = isApproved;
  }
  
  if (search) {
    query.$or = [
      { patientName: { $regex: search, $options: 'i' } },
      { review: { $regex: search, $options: 'i' } }
    ];
  }

  // Pagination
  const skip = (page - 1) * limit;

  // Find testimonials with pagination
  const testimonials = await Testimonial.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  // Get total count for pagination info
  const total = await Testimonial.countDocuments(query);

  res.json({
    success: true,
    data: {
      testimonials,
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
 * Delete a testimonial
 * @route DELETE /api/admin/testimonial/:id
 * @access Admin
 */
const deleteTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.findById(req.params.id);

  if (!testimonial) {
    return res.status(404).json({
      success: false,
      message: 'Testimonial not found'
    });
  }

  await Testimonial.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: 'Testimonial deleted successfully'
  });
});

/**
 * Get all contact messages
 * @route GET /api/admin/contacts
 * @access Admin
 */
const getContacts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status, isRead, search } = req.query;

  console.log('🔍 getContacts called with params:', { page, limit, status, isRead, search });
  console.log('👤 Admin user:', req.admin?.email);

  // Build query
  const query = {};
  
  if (status) {
    query.status = status;
  }
  
  if (typeof isRead === 'boolean') {
    query.isRead = isRead;
  }
  
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { message: { $regex: search, $options: 'i' } }
    ];
  }

  console.log('📋 Built query:', JSON.stringify(query, null, 2));

  // Pagination
  const skip = (page - 1) * limit;

  try {
    // Find contacts with pagination
    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    console.log('📥 Found contacts:', contacts.length);
    if (contacts.length > 0) {
      console.log('📄 First contact:', {
        id: contacts[0]._id,
        name: contacts[0].name,
        email: contacts[0].email,
        createdAt: contacts[0].createdAt
      });
    }

    // Get total count for pagination info
    const total = await Contact.countDocuments(query);
    console.log('📊 Total contacts:', total);

    const response = {
      success: true,
      data: {
        messages: contacts, // Changed from contacts to messages
        pagination: {
          current: parseInt(page),
          pageSize: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    };

    console.log('✅ Sending response:', {
      success: response.success,
      messagesCount: response.data.messages.length,
      pagination: response.data.pagination
    });

    res.json(response);
  } catch (error) {
    console.error('❌ Database error:', error);
    throw error;
  }
});

/**
 * Get lightweight contact options for dropdowns
 * @route GET /api/admin/messages/options
 * @access Admin
 */
const getContactOptions = asyncHandler(async (req, res) => {
  console.log('🔍 getContactOptions called for dropdown');
  console.log('👤 Admin user:', req.admin?.email);

  try {
    // Find all contacts, but only return essential fields for dropdown
    const contacts = await Contact.find({})
      .select('_id name email phone subject status createdAt')
      .sort({ createdAt: -1 })
      .limit(100); // Reasonable limit for dropdown

    console.log('📥 Found contact options:', contacts.length);
    if (contacts.length > 0) {
      console.log('📄 First contact option:', {
        id: contacts[0]._id,
        name: contacts[0].name,
        email: contacts[0].email,
        hasPhone: !!contacts[0].phone
      });
    }

    const response = {
      success: true,
      data: {
        messages: contacts // Use "messages" to match frontend expectations
      }
    };

    console.log('✅ Sending contact options response:', {
      success: response.success,
      messagesCount: response.data.messages.length
    });

    res.json(response);
  } catch (error) {
    console.error('❌ Database error in getContactOptions:', error);
    throw error;
  }
});

/**
 * Mark contact message as read
 * @route PUT /api/admin/contact/:id/read
 * @access Admin
 */
const markContactAsRead = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    return res.status(404).json({
      success: false,
      message: 'Contact message not found'
    });
  }

  contact.isRead = true;
  await contact.save();

  res.json({
    success: true,
    message: 'Contact message marked as read',
    data: {
      contact
    }
  });
});

// Validation rules
const updateAppointmentStatusValidation = [
  body('status')
    .isIn(['pending', 'approved', 'completed', 'cancelled'])
    .withMessage('Status must be one of: pending, approved, completed, cancelled'),
  
  body('adminNotes')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Admin notes cannot exceed 1000 characters')
];

const createAppointmentValidation = [
  body('patientName')
    .trim()
    .notEmpty()
    .withMessage('Patient name is required')
    .isLength({ max: 50 })
    .withMessage('Patient name cannot exceed 50 characters'),
  
  body('patientEmail')
    .trim()
    .notEmpty()
    .withMessage('Patient email is required')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(),
  
  body('patientPhone')
    .optional()
    .trim()
    .matches(/^[+]?[\d\s-()]+$/)
    .withMessage('Please enter a valid phone number'),
  
  body('appointmentDate')
    .notEmpty()
    .withMessage('Appointment date is required')
    .custom((value, { req }) => {
      // Support both YYYY-MM-DD and DD-MM-YYYY formats
      let date;
      
      // Try YYYY-MM-DD first (HTML5 date input format)
      if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        date = new Date(value);
      }
      // Try DD-MM-YYYY format
      else if (/^\d{2}-\d{2}-\d{4}$/.test(value)) {
        const [day, month, year] = value.split('-');
        date = new Date(`${year}-${month}-${day}`);
      }
      // Try MM/DD/YYYY format
      else if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(value)) {
        const [month, day, year] = value.split('/');
        date = new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
      }
      else {
        throw new Error('Invalid date format. Use DD-MM-YYYY or YYYY-MM-DD');
      }
      
      if (isNaN(date.getTime())) {
        throw new Error('Invalid date format');
      }
      
      if (date <= new Date()) {
        throw new Error('Appointment date must be in the future');
      }
      
      return true;
    }),
  
  body('appointmentTime')
    .trim()
    .notEmpty()
    .withMessage('Appointment time is required')
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Please enter a valid time in HH:MM format (24-hour)'),
  
  body('mode')
    .optional()
    .isIn(['clinic', 'online'])
    .withMessage('Mode must be either clinic or online'),
  
  body('serviceName')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Service name cannot exceed 100 characters'),
  
  body('serviceId')
    .optional({ checkFalsy: true })
    .custom((value, { req }) => {
      if (!value || value === '' || value === 'none' || value === 'null' || value === 'undefined') {
        return true; // Allow empty/optional
      }
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error('Valid service ID is required');
      }
      return true;
    }),
  
  body('messageId')
    .optional({ checkFalsy: true })
    .custom((value, { req }) => {
      if (!value || value === '' || value === 'none' || value === 'null' || value === 'undefined') {
        return true; // Allow empty/optional
      }
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error('Valid message ID is required');
      }
      return true;
    }),
  
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Notes cannot exceed 1000 characters')
];

const createServiceValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Service title is required')
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters'),
  
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Service description is required')
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),
  
  body('icon')
    .trim()
    .notEmpty()
    .withMessage('Icon name is required')
    .isLength({ max: 50 })
    .withMessage('Icon name cannot exceed 50 characters'),
  
  body('duration')
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage('Duration cannot exceed 20 characters'),
  
  body('price')
    .optional()
    .custom((value) => {
      // Allow empty string, null, or undefined
      if (value === '' || value === null || value === undefined) {
        return true; // Skip validation for empty price
      }
      // If value exists, it must be a positive number
      const numValue = parseFloat(value);
      if (isNaN(numValue) || numValue < 0) {
        throw new Error('Price must be a positive number');
      }
      return true;
    })
];

const updateServiceValidation = [
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Service title cannot be empty')
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters'),
  
  body('description')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Service description cannot be empty')
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),
  
  body('icon')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Icon name cannot be empty')
    .isLength({ max: 50 })
    .withMessage('Icon name cannot exceed 50 characters'),
  
  body('duration')
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage('Duration cannot exceed 20 characters'),
  
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean')
];

const approveTestimonialValidation = [
  body('testimonialId')
    .isMongoId()
    .withMessage('Valid testimonial ID is required')
];

/**
 * Reply to contact message via email
 * @route POST /api/admin/contacts/:id/reply
 * @access Admin
 */
const replyToContact = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { subject, message } = req.body;

  console.log('📧 REPLY HIT', id, req.body);

  // Find contact message
  const contact = await Contact.findById(id);
  if (!contact) {
    console.log('❌ Contact not found:', id);
    return res.status(404).json({
      success: false,
      message: 'Contact message not found'
    });
  }

  // Validate input
  if (!subject || subject.trim().length < 3) {
    console.log('❌ Validation failed: Subject too short');
    return res.status(400).json({
      success: false,
      message: 'Subject must be at least 3 characters long'
    });
  }

  if (!message || message.trim().length < 5) {
    console.log('❌ Validation failed: Message too short');
    return res.status(400).json({
      success: false,
      message: 'Message must be at least 5 characters long'
    });
  }

  // Validate email format
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  if (!emailRegex.test(contact.email)) {
    console.log('❌ Validation failed: Invalid email format');
    return res.status(400).json({
      success: false,
      message: 'Contact email is invalid'
    });
  }

  try {
    // Prepare email content
    const emailSubject = subject || `Re: ${contact.subject || 'Contact Request'}`;
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
          <h2 style="color: #333; margin-bottom: 20px;">Reply to Your Contact Request</h2>
          
          <div style="background-color: #fff; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
            <p style="color: #666; margin-bottom: 10px;"><strong>Your Original Message:</strong></p>
            <div style="background-color: #f5f5f5; padding: 10px; border-left: 4px solid #007bff; margin-bottom: 20px;">
              <p style="color: #333; margin: 0;"><strong>From:</strong> ${contact.name}</p>
              <p style="color: #333; margin: 5px 0;"><strong>Email:</strong> ${contact.email}</p>
              <p style="color: #333; margin: 5px 0;"><strong>Subject:</strong> ${contact.subject || 'No subject'}</p>
              <p style="color: #333; margin: 10px 0;">${contact.message}</p>
            </div>
          </div>
          
          <div style="background-color: #fff; padding: 15px; border-radius: 5px;">
            <p style="color: #666; margin-bottom: 10px;"><strong>Our Reply:</strong></p>
            <div style="background-color: #e8f5e8; padding: 10px; border-left: 4px solid #28a745; margin-bottom: 10px;">
              <p style="color: #333; margin: 0; white-space: pre-wrap;">${message}</p>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #666; font-size: 12px;">
              This is an automated reply from PhysioCare Clinic.<br>
              If you need further assistance, please don't hesitate to contact us.
            </p>
          </div>
        </div>
      </div>
    `;

    console.log('📧 Sending email to:', contact.email);

    // Send email
    const emailResult = await sendMail({
      to: contact.email,
      subject: emailSubject,
      html: emailHtml
    });

    // Prepare reply data for history
    const replyData = {
      subject: subject,
      message: message,
      sentTo: contact.email,
      sentByAdminId: req.admin.id,
      messageId: emailResult.messageId,
      provider: process.env.SMTP_USER ? 'smtp' : 'ethereal',
      status: 'sent',
      error: null
    };

    // Add reply to history
    contact.addReplyToHistory(replyData);

    console.log('✅ Reply sent successfully:', {
      contactId: id,
      messageId: emailResult.messageId,
      previewUrl: emailResult.previewUrl
    });

    const response = {
      success: true,
      message: 'Reply sent successfully via email',
      data: {
        emailSent: true,
        messageId: emailResult.messageId,
        previewUrl: emailResult.previewUrl // Only for Ethereal testing
      }
    };

    // Add preview URL for development
    if (emailResult.previewUrl) {
      response.data.previewUrl = emailResult.previewUrl;
      console.log('📧 Email preview URL:', emailResult.previewUrl);
    }

    return res.status(200).json(response);

  } catch (error) {
    console.error('❌ EMAIL ERROR:', error);
    
    // Prepare reply data for history
    const replyData = {
      subject: subject,
      message: message,
      sentTo: contact.email,
      sentByAdminId: req.admin.id,
      messageId: null,
      provider: process.env.SMTP_USER ? 'smtp' : 'ethereal',
      status: 'failed',
      error: error.message
    };

    // Add failed reply to history
    contact.addReplyToHistory(replyData);

    return res.status(500).json({
      success: false,
      message: 'Email send failed',
      error: error.message
    });
  }
});

module.exports = {
  getDashboard,
  getUsers,
  getAppointments,
  createAppointment,
  updateAppointmentStatus,
  createService,
  updateService,
  deleteService,
  approveTestimonial,
  getTestimonials,
  deleteTestimonial,
  getAbout,
  updateAbout,
  getContacts,
  getContactOptions,
  getContactById,
  markContactAsRead,
  updateContactStatus,
  deleteContact,
  deleteAppointment,
  getEmailStatus,
  testEmail,
  getServices,
  getServiceById,
  updateAppointmentStatusValidation,
  createAppointmentValidation,
  createServiceValidation,
  updateServiceValidation,
  approveTestimonialValidation,
  replyToContact
};
