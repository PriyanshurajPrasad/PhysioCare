const About = require('../models/About');

// @desc    Get About Us content
// @route   GET /api/about
// @access  Public
exports.getAboutContent = async (req, res) => {
  try {
    const about = await About.getAbout();
    res.status(200).json({
      success: true,
      data: about
    });
  } catch (error) {
    console.error('Error fetching About content:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching About content',
      error: error.message
    });
  }
};

// @desc    Create or update About Us content
// @route   POST /api/admin/about
// @access  Private (Admin only)
exports.updateAboutContent = async (req, res) => {
  try {
    const {
      clinicName,
      headline,
      description,
      mission,
      vision,
      experienceYears,
      doctorName,
      doctorQualification,
      doctorExperience
    } = req.body;

    // Validate required fields
    const requiredFields = [
      'clinicName',
      'headline', 
      'description',
      'mission',
      'vision',
      'experienceYears',
      'doctorName',
      'doctorQualification',
      'doctorExperience'
    ];

    const missingFields = requiredFields.filter(field => !req.body[field]);
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // Validate experienceYears is a positive number
    if (experienceYears < 0 || isNaN(experienceYears)) {
      return res.status(400).json({
        success: false,
        message: 'Experience years must be a positive number'
      });
    }

    // Get existing About document or create new one
    let about = await About.getAbout();
    
    // Update all fields
    about.clinicName = clinicName;
    about.headline = headline;
    about.description = description;
    about.mission = mission;
    about.vision = vision;
    about.experienceYears = experienceYears;
    about.doctorName = doctorName;
    about.doctorQualification = doctorQualification;
    about.doctorExperience = doctorExperience;

    await about.save();

    res.status(200).json({
      success: true,
      message: 'About Us content updated successfully',
      data: about
    });
  } catch (error) {
    console.error('Error updating About content:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating About content',
      error: error.message
    });
  }
};

// @desc    Get About Us content for Admin
// @route   GET /api/admin/about
// @access  Private (Admin only)
exports.getAboutContentForAdmin = async (req, res) => {
  try {
    const about = await About.getAbout();
    res.status(200).json({
      success: true,
      data: about
    });
  } catch (error) {
    console.error('Error fetching About content for admin:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching About content',
      error: error.message
    });
  }
};
