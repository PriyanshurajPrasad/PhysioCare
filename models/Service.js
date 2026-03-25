const mongoose = require('mongoose');

/**
 * Service Schema for Physiotherapy Clinic
 * Manages clinic services offered to patients
 */
const serviceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Service title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Service description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  icon: {
    type: String,
    required: [true, 'Icon name is required'],
    trim: true,
    maxlength: [50, 'Icon name cannot exceed 50 characters']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  duration: {
    type: String,
    trim: true,
    maxlength: [20, 'Duration cannot exceed 20 characters']
  },
  price: {
    type: Number,
    min: [0, 'Price cannot be negative']
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});

/**
 * Index for efficient querying by active status
 */
serviceSchema.index({ isActive: 1 });

/**
 * Static method to find only active services
 */
serviceSchema.statics.findActive = function() {
  return this.find({ isActive: true }).sort({ createdAt: 1 });
};

/**
 * Static method to search services by title or description
 */
serviceSchema.statics.search = function(query) {
  const searchRegex = new RegExp(query, 'i');
  return this.find({
    $and: [
      { isActive: true },
      {
        $or: [
          { title: searchRegex },
          { description: searchRegex }
        ]
      }
    ]
  }).sort({ title: 1 });
};

/**
 * Instance method to toggle service status
 */
serviceSchema.methods.toggleStatus = function() {
  this.isActive = !this.isActive;
  return this.save();
};

module.exports = mongoose.model('Service', serviceSchema);
