const mongoose = require('mongoose');

/**
 * Testimonial Schema for Physiotherapy Clinic
 * Manages patient reviews and testimonials
 */
const testimonialSchema = new mongoose.Schema({
  patientName: {
    type: String,
    required: [true, 'Patient name is required'],
    trim: true,
    maxlength: [50, 'Patient name cannot exceed 50 characters']
  },
  review: {
    type: String,
    required: [true, 'Review is required'],
    trim: true,
    maxlength: [1000, 'Review cannot exceed 1000 characters']
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
  isApproved: {
    type: Boolean,
    default: false
  },
  service: {
    type: String,
    trim: true,
    maxlength: [100, 'Service name cannot exceed 100 characters']
  },
  treatmentDate: {
    type: Date,
    validate: {
      validator: function(value) {
        return !value || value <= new Date(); // Treatment date cannot be in the future
      },
      message: 'Treatment date cannot be in the future'
    }
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});

/**
 * Index for efficient querying by approval status
 */
testimonialSchema.index({ isApproved: 1 });
testimonialSchema.index({ rating: 1 });

/**
 * Pre-save middleware to validate business logic
 */
testimonialSchema.pre('save', function(next) {
  // Ensure patient name and review are not empty after trimming
  if (this.patientName.trim() === '') {
    return next(new Error('Patient name cannot be empty'));
  }
  if (this.review.trim() === '') {
    return next(new Error('Review cannot be empty'));
  }
  next();
});

/**
 * Static method to find only approved testimonials
 */
testimonialSchema.statics.findApproved = function() {
  return this.find({ isApproved: true }).sort({ createdAt: -1 });
};

/**
 * Static method to find pending testimonials (for admin)
 */
testimonialSchema.statics.findPending = function() {
  return this.find({ isApproved: false }).sort({ createdAt: -1 });
};

/**
 * Static method to get rating statistics
 */
testimonialSchema.statics.getRatingStats = async function() {
  const stats = await this.aggregate([
    {
      $match: { isApproved: true }
    },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        totalTestimonials: { $sum: 1 },
        ratingDistribution: {
          $push: '$rating'
        }
      }
    }
  ]);

  if (stats.length === 0) {
    return {
      averageRating: 0,
      totalTestimonials: 0,
      ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    };
  }

  const result = stats[0];
  result.ratingDistribution = result.ratingDistribution.reduce((acc, rating) => {
    acc[rating] = (acc[rating] || 0) + 1;
    return acc;
  }, { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });

  return result;
};

/**
 * Instance method to approve testimonial
 */
testimonialSchema.methods.approve = function() {
  this.isApproved = true;
  return this.save();
};

module.exports = mongoose.model('Testimonial', testimonialSchema);
