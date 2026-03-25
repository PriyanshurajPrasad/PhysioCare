const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Patient name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5'],
    validate: {
      validator: Number.isInteger,
      message: 'Rating must be an integer'
    }
  },
  message: {
    type: String,
    required: [true, 'Review message is required'],
    trim: true,
    minlength: [10, 'Message must be at least 10 characters'],
    maxlength: [1000, 'Message cannot exceed 1000 characters']
  },
  treatment: {
    type: String,
    trim: true,
    maxlength: [100, 'Treatment name cannot exceed 100 characters']
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isApproved: {
    type: Boolean,
    default: true // Auto-approve for now, can be changed to false for moderation
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
reviewSchema.index({ isApproved: 1, isFeatured: 1 });
reviewSchema.index({ rating: -1 });
reviewSchema.index({ createdAt: -1 });
reviewSchema.index({ name: 'text', message: 'text', treatment: 'text' });

// Virtual for formatted date
reviewSchema.virtual('formattedDate').get(function() {
  return this.createdAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Static method to get featured reviews
reviewSchema.statics.getFeatured = function(limit = 6) {
  return this.find({ 
    isApproved: true, 
    isFeatured: true 
  })
  .sort({ createdAt: -1 })
  .limit(limit);
};

// Static method to get reviews with filters
reviewSchema.statics.getReviews = function(options = {}) {
  const {
    page = 1,
    limit = 9,
    q = '',
    rating = null,
    sort = 'newest'
  } = options;
  
  const filter = { isApproved: true };
  
  // Add search filter
  if (q) {
    filter.$text = { $search: q };
  }
  
  // Add rating filter
  if (rating && rating !== 'all') {
    filter.rating = parseInt(rating);
  }
  
  // Add sort options
  let sortOptions = {};
  switch (sort) {
    case 'oldest':
      sortOptions = { createdAt: 1 };
      break;
    case 'highest':
      sortOptions = { rating: -1, createdAt: -1 };
      break;
    case 'lowest':
      sortOptions = { rating: 1, createdAt: -1 };
      break;
    case 'newest':
    default:
      sortOptions = { createdAt: -1 };
      break;
  }
  
  const skip = (page - 1) * limit;
  
  return this.find(filter)
    .sort(sortOptions)
    .skip(skip)
    .limit(limit);
};

// Static method to get reviews count
reviewSchema.statics.getReviewsCount = function(options = {}) {
  const { q = '', rating = null } = options;
  
  const filter = { isApproved: true };
  
  if (q) {
    filter.$text = { $search: q };
  }
  
  if (rating && rating !== 'all') {
    filter.rating = parseInt(rating);
  }
  
  return this.countDocuments(filter);
};

module.exports = mongoose.model('Review', reviewSchema);
