const Contact = require('../models/Contact');
const { asyncHandler } = require('../middleware/errorMiddleware');

/**
 * @desc    Create new contact submission
 * @route   POST /api/contact
 * @access   Public
 */
const createContact = asyncHandler(async (req, res) => {
  const { name, email, phone, subject, message, priority } = req.body;

  const contact = await Contact.create({
    name,
    email,
    phone,
    subject,
    message,
    priority: priority || 'medium'
  });

  res.status(201).json({
    success: true,
    message: 'Contact form submitted successfully',
    data: contact
  });
});

/**
 * @desc    Get all contacts with pagination and filters
 * @route   GET /api/admin/contacts
 * @access   Admin
 */
const getContacts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const status = req.query.status;
  const isRead = req.query.isRead;
  const search = req.query.search;

  // Build query
  const query = {};
  
  if (status) {
    query.status = status;
  }
  
  if (isRead !== undefined) {
    query.isRead = isRead === 'true';
  }
  
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { subject: { $regex: search, $options: 'i' } },
      { message: { $regex: search, $options: 'i' } }
    ];
  }

  const skip = (page - 1) * limit;

  const contacts = await Contact.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Contact.countDocuments(query);

  res.status(200).json({
    success: true,
    message: 'Contacts retrieved successfully',
    data: contacts,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  });
});

/**
 * @desc    Get single contact by ID
 * @route   GET /api/admin/contacts/:id
 * @access   Admin
 */
const getContactById = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    return res.status(404).json({
      success: false,
      message: 'Contact not found'
    });
  }

  res.status(200).json({
    success: true,
    message: 'Contact retrieved successfully',
    data: contact
  });
});

/**
 * @desc    Mark contact as read
 * @route   PATCH /api/admin/contacts/:id/read
 * @access   Admin
 */
const markContactRead = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    return res.status(404).json({
      success: false,
      message: 'Contact not found'
    });
  }

  contact.isRead = true;
  await contact.save();

  res.status(200).json({
    success: true,
    message: 'Contact marked as read',
    data: contact
  });
});

/**
 * @desc    Update contact status
 * @route   PATCH /api/admin/contacts/:id/status
 * @access   Admin
 */
const updateContactStatus = asyncHandler(async (req, res) => {
  const { status, adminNotes } = req.body;

  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    return res.status(404).json({
      success: false,
      message: 'Contact not found'
    });
  }

  contact.status = status;
  if (adminNotes) {
    contact.adminNotes = adminNotes;
  }

  await contact.save();

  res.status(200).json({
    success: true,
    message: 'Contact status updated successfully',
    data: contact
  });
});

/**
 * @desc    Delete contact
 * @route   DELETE /api/admin/contacts/:id
 * @access   Admin
 */
const deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    return res.status(404).json({
      success: false,
      message: 'Contact not found'
    });
  }

  await contact.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Contact deleted successfully'
  });
});

/**
 * @desc    Reply to contact via email
 * @route   POST /api/admin/contacts/:id/reply
 * @access   Admin
 */
const replyToContact = asyncHandler(async (req, res) => {
  const { subject, message } = req.body;
  const adminId = req.admin.id;

  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    return res.status(404).json({
      success: false,
      message: 'Contact not found'
    });
  }

  try {
    // Send email
    const emailResult = await sendEmail({
      to: contact.email,
      subject: subject,
      message: message,
      replyTo: process.env.FROM_EMAIL
    });

    // Add reply to history
    const replyData = {
      subject,
      message,
      sentTo: contact.email,
      sentByAdminId: adminId,
      messageId: emailResult.messageId,
      provider: emailResult.provider,
      status: 'sent'
    };

    contact.replyHistory.push(replyData);
    await contact.save();

    res.status(200).json({
      success: true,
      message: 'Reply sent successfully',
      data: {
        messageId: emailResult.messageId,
        provider: emailResult.provider,
        previewUrl: emailResult.previewUrl
      }
    });

  } catch (error) {
    console.error('Error sending reply:', error);

    // Add failed reply to history
    const replyData = {
      subject,
      message,
      sentTo: contact.email,
      sentByAdminId: adminId,
      status: 'failed',
      error: error.message
    };

    contact.replyHistory.push(replyData);
    await contact.save();

    res.status(500).json({
      success: false,
      message: 'Failed to send reply',
      error: error.message
    });
  }
});

/**
 * Send email using Nodemailer
 */
const sendEmail = async ({ to, subject, message, replyTo }) => {
  try {
    // Check if SMTP credentials are available
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      // Use real SMTP
      const transporter = nodemailer.createTransporter({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT || 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });

      const mailOptions = {
        from: process.env.FROM_EMAIL,
        to: to,
        subject: subject,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
              <h2 style="color: #333; margin-bottom: 20px;">${subject}</h2>
              <div style="background: white; padding: 20px; border-radius: 6px; margin-bottom: 20px;">
                <p style="color: #666; line-height: 1.6; margin: 0;">${message.replace(/\n/g, '<br>')}</p>
              </div>
              <p style="color: #999; font-size: 14px; margin: 0;">
                This is a reply to your message sent to PhysioCare Clinic.
              </p>
            </div>
          </div>
        `,
        replyTo: replyTo
      };

      const result = await transporter.sendMail(mailOptions);
      
      return {
        messageId: result.messageId,
        provider: 'smtp',
        previewUrl: null
      };
    } else {
      // Use Ethereal for testing
      const testAccount = await nodemailer.createTestAccount();
      
      const transporter = nodemailer.createTransporter({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      });

      const mailOptions = {
        from: process.env.FROM_EMAIL || `"PhysioCare Clinic" <${testAccount.user}>`,
        to: to,
        subject: subject,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
              <h2 style="color: #333; margin-bottom: 20px;">${subject}</h2>
              <div style="background: white; padding: 20px; border-radius: 6px; margin-bottom: 20px;">
                <p style="color: #666; line-height: 1.6; margin: 0;">${message.replace(/\n/g, '<br>')}</p>
              </div>
              <p style="color: #999; font-size: 14px; margin: 0;">
                This is a reply to your message sent to PhysioCare Clinic.
              </p>
            </div>
          </div>
        `,
        replyTo: replyTo
      };

      const result = await transporter.sendMail(mailOptions);
      
      console.log('📧 Ethereal Email sent:');
      console.log('   Preview URL:', nodemailer.getTestMessageUrl(result));
      console.log('   To:', to);
      console.log('   Subject:', subject);

      return {
        messageId: result.messageId,
        provider: 'ethereal',
        previewUrl: nodemailer.getTestMessageUrl(result)
      };
    }
  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
};

module.exports = {
  createContact,
  getContacts,
  getContactById,
  markContactRead,
  updateContactStatus,
  deleteContact,
  replyToContact
};
