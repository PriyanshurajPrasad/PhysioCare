const express = require('express');
const {
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
} = require('../controllers/publicController');

const router = express.Router();

/**
 * @route   GET /api/services
 * @desc    Get all active services
 * @access  Public
 */
router.get('/services', getServices);

/**
 * @route   GET /api/services/search
 * @desc    Search services
 * @access  Public
 */
router.get('/services/search', searchServices);

/**
 * @route   GET /api/services/:id
 * @desc    Get a specific service by ID
 * @access  Public
 */
router.get('/services/:id', getServiceById);

/**
 * @route   GET /api/testimonials
 * @desc    Get all approved testimonials
 * @access  Public
 */
router.get('/testimonials', getTestimonials);

/**
 * @route   GET /api/testimonials/featured
 * @desc    Get featured testimonials (highest rated)
 * @access  Public
 */
router.get('/testimonials/featured', getFeaturedTestimonials);

/**
 * @route   GET /api/testimonials/stats
 * @desc    Get rating statistics
 * @access  Public
 */
router.get('/testimonials/stats', getTestimonialStats);

/**
 * @route   POST /api/testimonials
 * @desc    Create a new testimonial
 * @access  Public
 */
router.post('/testimonials', createTestimonialValidation, createTestimonial);

/**
 * @route   POST /api/contact
 * @desc    Submit contact form
 * @access  Public
 */
router.post('/contact', createContactValidation, createContact);

module.exports = router;
