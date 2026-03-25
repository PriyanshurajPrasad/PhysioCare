const Review = require('../models/Review');

// @desc    Get all reviews with pagination, search, and filters
// @route   GET /api/reviews
// @access  Public
exports.getReviews = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 9,
      q = '',
      rating = 'all',
      sort = 'newest'
    } = req.query;

    // Parse and validate inputs
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    
    if (pageNum < 1 || limitNum < 1 || limitNum > 50) {
      return res.status(400).json({
        success: false,
        message: 'Invalid pagination parameters'
      });
    }

    const options = {
      page: pageNum,
      limit: limitNum,
      q,
      rating,
      sort
    };

    // Get reviews and total count
    const [reviews, total] = await Promise.all([
      Review.getReviews(options),
      Review.getReviewsCount({ q, rating })
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(total / limitNum);
    const hasNextPage = pageNum < totalPages;
    const hasPrevPage = pageNum > 1;

    res.status(200).json({
      success: true,
      data: reviews,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalReviews: total,
        limit: limitNum,
        hasNextPage,
        hasPrevPage
      }
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching reviews',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get featured reviews
// @route   GET /api/reviews/featured
// @access  Public
exports.getFeaturedReviews = async (req, res) => {
  try {
    const { limit = 6 } = req.query;
    const limitNum = parseInt(limit);
    
    if (limitNum < 1 || limitNum > 20) {
      return res.status(400).json({
        success: false,
        message: 'Invalid limit parameter'
      });
    }

    const reviews = await Review.getFeatured(limitNum);

    res.status(200).json({
      success: true,
      data: reviews,
      count: reviews.length
    });
  } catch (error) {
    console.error('Error fetching featured reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching featured reviews',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Create a new review
// @route   POST /api/reviews
// @access  Public
exports.createReview = async (req, res) => {
  try {
    const { name, rating, message, treatment } = req.body;

    // Validate required fields
    if (!name || !rating || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, rating, and message are required'
      });
    }

    // Validate rating
    const ratingNum = parseInt(rating);
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be a number between 1 and 5'
      });
    }

    // Validate message length
    if (message.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Review message must be at least 10 characters long'
      });
    }

    // Create review
    const review = await Review.create({
      name: name.trim(),
      rating: ratingNum,
      message: message.trim(),
      treatment: treatment ? treatment.trim() : undefined
    });

    res.status(201).json({
      success: true,
      data: review,
      message: 'Review submitted successfully!'
    });
  } catch (error) {
    console.error('Error creating review:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while creating review',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get review statistics
// @route   GET /api/reviews/stats
// @access  Public
exports.getReviewStats = async (req, res) => {
  try {
    const stats = await Review.aggregate([
      { $match: { isApproved: true } },
      {
        $group: {
          _id: null,
          totalReviews: { $sum: 1 },
          averageRating: { $avg: '$rating' },
          ratingDistribution: {
            $push: '$rating'
          }
        }
      }
    ]);

    if (stats.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          totalReviews: 0,
          averageRating: 0,
          ratingCounts: {
            5: 0,
            4: 0,
            3: 0,
            2: 0,
            1: 0
          }
        }
      });
    }

    const { totalReviews, averageRating, ratingDistribution } = stats[0];

    // Count ratings by star level
    const ratingCounts = ratingDistribution.reduce((acc, rating) => {
      acc[rating] = (acc[rating] || 0) + 1;
      return acc;
    }, { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });

    res.status(200).json({
      success: true,
      data: {
        totalReviews,
        averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
        ratingCounts
      }
    });
  } catch (error) {
    console.error('Error fetching review stats:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching review statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
