const express = require('express');
const {
  getReviews,
  getFeaturedReviews,
  createReview,
  getReviewStats
} = require('../controllers/reviewController');

const router = express.Router();

/**
 * @route   GET /api/reviews
 * @desc    Get all reviews with pagination, search, and filters
 * @access  Public
 * @query   page, limit, q (search), rating, sort
 */
router.get('/', getReviews);

/**
 * @route   GET /api/reviews/featured
 * @desc    Get featured reviews
 * @access  Public
 * @query   limit (default 6)
 */
router.get('/featured', getFeaturedReviews);

/**
 * @route   GET /api/reviews/stats
 * @desc    Get review statistics
 * @access  Public
 */
router.get('/stats', getReviewStats);

/**
 * @route   POST /api/reviews
 * @desc    Create a new review
 * @access  Public
 * @body    name, rating, message, treatment
 */
router.post('/', createReview);

module.exports = router;
