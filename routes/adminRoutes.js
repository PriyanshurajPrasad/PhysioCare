const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const sseManager = require('../utils/sseManager');

// Protected routes (require authentication and admin role)
router.use(protect);
router.use(adminOnly);

// Dashboard stats
router.get('/dashboard/stats', getDashboard);

// SSE for real-time updates
router.get('/events', protect, (req, res) => {
  console.log('🔌 SSE connection established for admin:', req.admin.email);
  
  // Set SSE headers
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': process.env.CLIENT_URL || 'http://localhost:5173',
    'Access-Control-Allow-Credentials': 'true'
  });

  // Add connection to manager
  sseManager.addConnection(req.admin.id, req, res);

  // Send initial connection event
  res.write('event: connected\ndata: {"message":"Dashboard connected for real-time updates"}\n\n');

  // Handle client disconnect
  req.on('close', () => {
    sseManager.removeConnection(req.admin.id, res);
  });
});

// Contacts management
router.get('/contacts', getContacts);
router.get('/contacts/:id', getContactById);
router.patch('/contacts/:id/read', markContactAsRead);
router.patch('/contacts/:id/status', updateContactStatus);
router.post('/contacts/:id/reply', replyToContact);
router.delete('/contacts/:id', deleteContact);

// Messages management (alias for contacts to match frontend expectations)
router.get('/messages', getContacts);
router.get('/messages/options', getContactOptions); // Lightweight endpoint for dropdowns
router.get('/messages/:id', getContactById);
router.patch('/messages/:id/read', markContactAsRead);
router.patch('/messages/:id/status', updateContactStatus);
router.patch('/messages/:id/resolve', updateContactStatus); // Alias for resolve
router.post('/messages/:id/reply', replyToContact);
router.delete('/messages/:id', deleteContact);

// Appointments management
router.get('/appointments', getAppointments);
router.post('/appointments', createAppointmentValidation, createAppointment);
router.patch('/appointments/:id/status', updateAppointmentStatusValidation, updateAppointmentStatus);
router.delete('/appointments/:id', deleteAppointment);

// Services CRUD
router.get('/services', getServices);
router.post('/services', createServiceValidation, createService);
router.patch('/services/:id', updateServiceValidation, updateService);
router.delete('/services/:id', deleteService);

// Testimonials management
router.get('/testimonials', getTestimonials);
router.post('/testimonials/approve', approveTestimonialValidation, approveTestimonial);
router.delete('/testimonials/:id', deleteTestimonial);

// About management
router.get('/about', getAbout);
router.put('/about', updateAbout);

// Users management
router.get('/users', getUsers);

// Email service management
router.get('/email-status', getEmailStatus);
router.post('/test-email', testEmail);

module.exports = router;
