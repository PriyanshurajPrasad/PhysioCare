const mongoose = require('mongoose');

/**
 * Appointment Schema for Physiotherapy Clinic
 * Manages patient appointments with status tracking
 */
const appointmentSchema = new mongoose.Schema({
  messageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contact',
    required: false // Optional, can be created without message
  },
  patientName: {
    type: String,
    required: [true, 'Patient name is required'],
    trim: true,
    maxlength: [50, 'Patient name cannot exceed 50 characters']
  },
  patientEmail: {
    type: String,
    required: [true, 'Patient email is required'],
    trim: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please enter a valid email address'
    ]
  },
  patientPhone: {
    type: String,
    trim: true,
    match: [
      /^[+]?[\d\s-()]+$/,
      'Please enter a valid phone number'
    ]
  },
  serviceName: {
    type: String,
    trim: true,
    maxlength: [100, 'Service name cannot exceed 100 characters']
  },
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service'
  },
  appointmentDate: {
    type: Date,
    required: [true, 'Appointment date is required'],
    validate: {
      validator: function(value) {
        return value > new Date(); // Date must be in the future
      },
      message: 'Appointment date must be in the future'
    }
  },
  appointmentTime: {
    type: String,
    required: [true, 'Appointment time is required'],
    trim: true,
    match: [
      /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
      'Please enter a valid time in HH:MM format (24-hour)'
    ]
  },
  mode: {
    type: String,
    enum: ['clinic', 'online'],
    default: 'clinic'
  },
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  },
  createdByAdminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  emailSent: {
    type: Boolean,
    default: false
  },
  emailSentAt: {
    type: Date
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});

/**
 * Index for efficient querying by status and date
 */
appointmentSchema.index({ status: 1, appointmentDate: 1 });
appointmentSchema.index({ createdByAdminId: 1 });
appointmentSchema.index({ messageId: 1 });

/**
 * Static method to find appointments by date range
 */
appointmentSchema.statics.findByDateRange = function(startDate, endDate) {
  return this.find({
    appointmentDate: {
      $gte: startDate,
      $lte: endDate
    }
  }).populate('messageId', 'name email phone').populate('createdByAdminId', 'name email');
};

/**
 * Static method to get appointment statistics
 */
appointmentSchema.statics.getStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);
  
  return stats.reduce((acc, stat) => {
    acc[stat._id] = stat.count;
    return acc;
  }, {});
};

/**
 * Static method to find appointments by admin
 */
appointmentSchema.statics.findByAdmin = function(adminId, options = {}) {
  const { page = 1, limit = 10, status = 'all' } = options;
  
  const query = { createdByAdminId: adminId };
  if (status !== 'all') {
    query.status = status;
  }
  
  return this.find(query)
    .populate('messageId', 'name email phone subject')
    .populate('serviceId', 'title')
    .populate('createdByAdminId', 'name email')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));
};

/**
 * Instance method to mark email as sent
 */
appointmentSchema.methods.markEmailSent = function() {
  this.emailSent = true;
  this.emailSentAt = new Date();
  return this.save();
};

module.exports = mongoose.model('Appointment', appointmentSchema);
