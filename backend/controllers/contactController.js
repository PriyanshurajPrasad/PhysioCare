const Contact = require('../models/Contact');
const { asyncHandler } = require('../middleware/errorMiddleware');
const emailService = require('../utils/emailService');

/**
 * @desc    Create new contact submission
 * @route   POST /api/contact
 * @access   Public
 */
const createContact = asyncHandler(async (req, res) => {
  console.log('🚀 ============================================');
  console.log('🚀 CREATE CONTACT - REQUEST RECEIVED');
  console.log('🚀 ============================================');
  console.log('📝 Request Body:', JSON.stringify(req.body, null, 2));
  console.log('📝 Headers:', JSON.stringify(req.headers, null, 2));
  
  const { name, email, phone, subject, message, priority } = req.body;

  // Validate required fields
  if (!name || !email || !subject || !message) {
    console.log('❌ Missing required fields:', { name: !!name, email: !!email, subject: !!subject, message: !!message });
    return res.status(400).json({
      success: false,
      message: 'Missing required fields',
      errors: [
        ...(name ? [] : [{ field: 'name', message: 'Name is required' }]),
        ...(email ? [] : [{ field: 'email', message: 'Email is required' }]),
        ...(subject ? [] : [{ field: 'subject', message: 'Subject is required' }]),
        ...(message ? [] : [{ field: 'message', message: 'Message is required' }])
      ]
    });
  }

  let contact;
  let emailSent = false;
  let emailError = null;

  try {
    console.log('💾 Attempting to save contact to database...');
    console.log('📦 Contact Data:', { name, email, phone: phone || 'Not provided', subject, message, priority: priority || 'medium' });
    
    // Save contact to database first
    contact = await Contact.create({
      name,
      email,
      phone: phone || '', // Make phone optional
      subject,
      message,
      priority: priority || 'medium'
    });

    console.log('✅ Contact saved to database successfully:', {
      contactId: contact._id,
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      subject: contact.subject,
      priority: contact.priority,
      createdAt: contact.createdAt
    });

  } catch (dbError) {
    console.error('❌ Database save failed:', dbError);
    console.error('Database Error Details:', {
      name: dbError.name,
      message: dbError.message,
      code: dbError.code,
      errors: dbError.errors
    });
    
    return res.status(500).json({
      success: false,
      message: 'Failed to save contact to database',
      error: dbError.message,
      ...(process.env.NODE_ENV === 'development' && { 
        details: dbError.errors,
        stack: dbError.stack 
      })
    });
  }

  // Prepare email content for admin notification
  const emailSubject = `New Contact Form Submission: ${subject || 'No Subject'}`;
  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
        <h2 style="color: #333; margin-bottom: 20px;">New Contact Form Submission</h2>
        <div style="background: white; padding: 20px; border-radius: 6px; margin-bottom: 20px;">
          <div style="margin-bottom: 15px;">
            <strong>Name:</strong> ${name}
          </div>
          <div style="margin-bottom: 15px;">
            <strong>Email:</strong> ${email}
          </div>
          <div style="margin-bottom: 15px;">
            <strong>Phone:</strong> ${phone || 'Not provided'}
          </div>
          <div style="margin-bottom: 15px;">
            <strong>Subject:</strong> ${subject || 'No subject'}
          </div>
          <div style="margin-bottom: 15px;">
            <strong>Priority:</strong> ${priority || 'medium'}
          </div>
          <div style="margin-bottom: 15px;">
            <strong>Message:</strong><br>
            <div style="background: #f8f9fa; padding: 10px; border-radius: 4px; margin-top: 5px;">
              ${message.replace(/\n/g, '<br>')}
            </div>
          </div>
          <div style="margin-bottom: 15px;">
            <strong>Submitted:</strong> ${new Date(contact.createdAt).toLocaleString()}
          </div>
        </div>
        <p style="color: #999; font-size: 14px; margin: 0;">
          This is an automated notification from PhysioCare Clinic Contact Form.
        </p>
      </div>
    </div>
  `;

  const emailText = `
New Contact Form Submission

Name: ${name}
Email: ${email}
Phone: ${phone || 'Not provided'}
Subject: ${subject || 'No subject'}
Priority: ${priority || 'medium'}
Message: ${message}
Submitted: ${new Date(contact.createdAt).toLocaleString()}

This is an automated notification from PhysioCare Clinic Contact Form.
  `;

  try {
    console.log('📧 Attempting to send email notification...');
    console.log('📧 Email Service Status:', emailService.getStatus());
    
    // Send email notification to admin using Resend
    const emailResult = await emailService.sendEmail({
      to: "priyanshurajprasad999@gmail.com",
      subject: emailSubject,
      html: emailHtml,
      text: emailText
    });

    console.log('📧 Email Service Response:', emailResult);

    if (emailResult.success) {
      emailSent = true;
      console.log('✅ Email sent successfully:', {
        contactId: contact._id,
        emailProvider: 'resend',
        messageId: emailResult.messageId
      });
    } else {
      emailError = emailResult.error;
      console.error('❌ Email sending failed:', emailResult.error);
      console.log('📧 Email failed but contact was saved - continuing...');
    }

  } catch (error) {
    console.error('❌ Email sending error:', error);
    console.error('Email Error Details:', {
      name: error.name,
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    emailError = error.message;
    console.log('📧 Email failed but contact was saved - continuing...');
  }

  console.log('📋 Preparing final response...');
  console.log('📋 Response Data:', {
    success: true,
    emailSent: emailSent,
    emailError: emailError,
    contactId: contact._id
  });

  // Always return success response since contact was saved
  const response = {
    success: true,
    message: emailSent ? 
      'Contact form submitted successfully' : 
      'Contact form submitted successfully (email notification failed)',
    data: {
      id: contact._id,
      name: contact.name,
      email: contact.email,
      subject: contact.subject,
      priority: contact.priority,
      createdAt: contact.createdAt
    },
    emailSent: emailSent,
    emailError: emailError
  };

  console.log('🎉 Sending final response:', JSON.stringify(response, null, 2));
  res.status(201).json(response);
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
    // Prepare reply email content
    const replySubject = subject || `Re: ${contact.subject || 'Your message to PhysioCare Clinic'}`;
    const replyHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
          <h2 style="color: #333; margin-bottom: 20px;">Reply from PhysioCare Clinic</h2>
          <div style="background: white; padding: 20px; border-radius: 6px; margin-bottom: 20px;">
            <p style="color: #666; line-height: 1.6; margin: 0;">${message.replace(/\n/g, '<br>')}</p>
          </div>
          <p style="color: #999; font-size: 14px; margin: 0;">
            This is a reply to your message sent to PhysioCare Clinic.
          </p>
        </div>
      </div>
    `;

    const replyText = `
Reply from PhysioCare Clinic

${message}

This is a reply to your message sent to PhysioCare Clinic.
    `;

    // Send reply email using Resend
    const emailResult = await emailService.sendEmail({
      to: contact.email,
      subject: replySubject,
      html: replyHtml,
      text: replyText
    });

    // Add reply to history
    const replyData = {
      subject: replySubject,
      message: message,
      sentTo: contact.email,
      sentByAdminId: adminId,
      messageId: emailResult.success ? emailResult.messageId : null,
      provider: 'resend',
      status: emailResult.success ? 'sent' : 'failed',
      sentAt: new Date(),
      error: emailResult.success ? null : emailResult.error
    };

    contact.replyHistory = contact.replyHistory || [];
    contact.replyHistory.push(replyData);
    await contact.save();

    if (emailResult.success) {
      console.log('✅ Reply sent successfully:', {
        contactId: contact._id,
        messageId: emailResult.messageId,
        provider: 'resend'
      });

      res.status(200).json({
        success: true,
        message: 'Reply sent successfully',
        data: {
          messageId: emailResult.messageId,
          provider: 'resend',
          reply: {
            subject: replySubject,
            message: message,
            sentTo: contact.email
          }
        }
      });
    } else {
      console.error('❌ Reply sending failed:', emailResult.error);
      res.status(500).json({
        success: false,
        message: 'Failed to send reply',
        error: emailResult.error
      });
    }

  } catch (error) {
    console.error('❌ Reply sending failed:', error);

    // Add failed reply to history
    const replyData = {
      subject: subject || `Re: ${contact.subject || 'Your message to PhysioCare Clinic'}`,
      message: message,
      sentTo: contact.email,
      sentByAdminId: adminId,
      messageId: null,
      provider: 'resend',
      status: 'failed',
      sentAt: new Date(),
      error: error.message
    };

    contact.replyHistory = contact.replyHistory || [];
    contact.replyHistory.push(replyData);
    await contact.save();

    res.status(500).json({
      success: false,
      message: 'Failed to send reply',
      error: error.message
    });
  }
});

module.exports = {
  createContact,
  getContacts,
  getContactById,
  markContactRead,
  updateContactStatus,
  deleteContact,
  replyToContact
};
