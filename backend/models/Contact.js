const mongoose = require('mongoose');

/**
 * Contact Schema for Physiotherapy Clinic
 * Manages contact form submissions from website visitors
 */
const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please enter a valid email address'
    ]
  },
  phone: {
    type: String,
    trim: true,
    default: '', // Make phone optional with empty string default
    maxlength: [20, 'Phone cannot exceed 20 characters']
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
    maxlength: [2000, 'Message cannot exceed 2000 characters']
  },
  subject: {
    type: String,
    trim: true,
    maxlength: [100, 'Subject cannot exceed 100 characters']
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  isRead: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['new', 'in-progress', 'resolved', 'closed'],
    default: 'new'
  },
  adminNotes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Admin notes cannot exceed 1000 characters']
  },
  // Reply history tracking
  replyHistory: [{
    subject: {
      type: String,
      trim: true,
      maxlength: [200, 'Reply subject cannot exceed 200 characters']
    },
    message: {
      type: String,
      trim: true,
      maxlength: [2000, 'Reply message cannot exceed 2000 characters']
    },
    sentTo: {
      type: String,
      trim: true,
      maxlength: [100, 'Sent to email cannot exceed 100 characters']
    },
    sentByAdminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      required: true
    },
    messageId: {
      type: String,
      trim: true
    },
    sentAt: {
      type: Date,
      default: Date.now
    },
    provider: {
      type: String,
      enum: ['smtp', 'ethereal'],
      default: 'ethereal'
    },
    status: {
      type: String,
      enum: ['sent', 'failed'],
      default: 'sent'
    },
    error: {
      type: String,
      trim: true,
      maxlength: [500, 'Reply error cannot exceed 500 characters']
    }
  }]
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});

/**
 * Index for efficient querying by status and read status
 */
contactSchema.index({ status: 1 });
contactSchema.index({ isRead: 1 });
contactSchema.index({ createdAt: -1 });

/**
 * Static method to find unread messages
 */
contactSchema.statics.findUnread = function() {
  return this.find({ isRead: false }).sort({ createdAt: -1 });
};

/**
 * Static method to find messages by status
 */
contactSchema.statics.findByStatus = function(status) {
  return this.find({ status }).sort({ createdAt: -1 });
};

/**
 * Static method to get contact statistics
 */
contactSchema.statics.getStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);

  const unreadCount = await this.countDocuments({ isRead: false });

  const result = stats.reduce((acc, stat) => {
    acc[stat._id] = stat.count;
    return acc;
  }, {});

  result.unread = unreadCount;
  return result;
};

/**
 * Static method to search messages by content
 */
contactSchema.statics.search = function(query) {
  const searchRegex = new RegExp(query, 'i');
  return this.find({
    $or: [
      { name: searchRegex },
      { email: searchRegex },
      { subject: searchRegex },
      { message: searchRegex }
    ]
  }).sort({ createdAt: -1 });
};

/**
 * Instance method to mark as read
 */
contactSchema.methods.markAsRead = function() {
  this.isRead = true;
  return this.save();
};

/**
 * Instance method to update status
 */
contactSchema.methods.updateStatus = function(status) {
  this.status = status;
  return this.save();
};

/**
 * Instance method to add reply to history
 */
contactSchema.methods.addReplyToHistory = function(replyData) {
  this.replyHistory.push(replyData);
  return this.save();
};

module.exports = mongoose.model('Contact', contactSchema);
