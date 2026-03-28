const express = require('express');
const { body, validationResult } = require('express-validator');
const {
  createContact,
  getContacts,
  getContactById,
  markContactRead,
  updateContactStatus,
  deleteContact,
  replyToContact
} = require('../controllers/contactController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Validation rules
const contactValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('phone')
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage('Phone cannot exceed 20 characters')
    .matches(/^[+]?[\d\s\-\(\)]+$/)
    .withMessage('Please enter a valid phone number'),
  body('subject')
    .trim()
    .notEmpty()
    .withMessage('Subject is required')
    .isLength({ min: 5, max: 200 })
    .withMessage('Subject must be between 5 and 200 characters'),
  body('message')
    .trim()
    .notEmpty()
    .withMessage('Message is required')
    .isLength({ min: 10, max: 2000 })
    .withMessage('Message must be between 10 and 2000 characters'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be: low, medium, or high')
];

const replyValidation = [
  body('subject')
    .trim()
    .notEmpty()
    .withMessage('Reply subject is required')
    .isLength({ min: 5, max: 200 })
    .withMessage('Subject must be between 5 and 200 characters'),
  body('message')
    .trim()
    .notEmpty()
    .withMessage('Reply message is required')
    .isLength({ min: 10, max: 2000 })
    .withMessage('Message must be between 10 and 2000 characters')
];

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Public routes
router.post('/', contactValidation, handleValidationErrors, createContact);

// Protected admin routes
router.get('/admin/contacts', protect, getContacts);
router.get('/admin/contacts/:id', protect, getContactById);
router.patch('/admin/contacts/:id/read', protect, markContactRead);
router.patch('/admin/contacts/:id/status', protect, updateContactStatus);
router.delete('/admin/contacts/:id', protect, deleteContact);
router.post('/admin/contacts/:id/reply', protect, replyValidation, handleValidationErrors, replyToContact);

module.exports = router;
