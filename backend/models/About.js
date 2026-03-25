const mongoose = require('mongoose');

const aboutSchema = new mongoose.Schema({
  clinicName: {
    type: String,
    required: true,
    trim: true
  },
  headline: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  mission: {
    type: String,
    required: true,
    trim: true
  },
  vision: {
    type: String,
    required: true,
    trim: true
  },
  experienceYears: {
    type: Number,
    required: true,
    min: 0
  },
  doctorName: {
    type: String,
    required: true,
    trim: true
  },
  doctorQualification: {
    type: String,
    required: true,
    trim: true
  },
  doctorExperience: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
});

// Create a singleton About document - only one About document should exist
aboutSchema.statics.getAbout = async function() {
  let about = await this.findOne();
  if (!about) {
    // Create default About document if none exists
    about = await this.create({
      clinicName: 'PhysioCare Clinic',
      headline: 'Your Path to Recovery Starts Here',
      description: 'We are a premier physiotherapy clinic dedicated to providing exceptional care and personalized treatment plans.',
      mission: 'To provide exceptional physiotherapy care that helps patients achieve optimal health and wellness.',
      vision: 'To be the leading physiotherapy clinic known for excellence in patient care and innovative treatments.',
      experienceYears: 10,
      doctorName: 'Dr. John Smith',
      doctorQualification: 'Doctor of Physical Therapy (DPT)',
      doctorExperience: '10+ years of clinical experience in sports medicine and rehabilitation'
    });
  }
  return about;
};

module.exports = mongoose.model('About', aboutSchema);
