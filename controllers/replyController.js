const Contact = require('../models/Contact');
const { sendMail } = require('../utils/mailer');
const { asyncHandler } = require('../middleware/errorMiddleware');

/**
 * Reply to contact message via email
 * @route POST /api/admin/contacts/:id/reply
 * @access Admin
 */
const replyToContact = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { subject, message } = req.body;

  console.log('📧 REPLY API HIT:', {
    contactId: id,
    subject: subject?.substring(0, 50) + '...',
    messageLength: message?.length || 0,
    admin: req.admin?.email
  });

  // Find contact message
  const contact = await Contact.findById(id);
  if (!contact) {
    console.log('❌ Contact not found:', id);
    return res.status(404).json({
      success: false,
      message: 'Contact message not found'
    });
  }

  // Validate input
  if (!subject || subject.trim().length < 3) {
    console.log('❌ Validation failed: Subject too short');
    return res.status(400).json({
      success: false,
      message: 'Subject must be at least 3 characters long'
    });
  }

  if (!message || message.trim().length < 5) {
    console.log('❌ Validation failed: Message too short');
    return res.status(400).json({
      success: false,
      message: 'Message must be at least 5 characters long'
    });
  }

  // Validate email format
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  if (!emailRegex.test(contact.email)) {
    console.log('❌ Validation failed: Invalid email format');
    return res.status(400).json({
      success: false,
      message: 'Contact email is invalid'
    });
  }

  try {
    // Prepare email content
    const emailSubject = subject || `Re: ${contact.subject || 'Contact Request'}`;
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
          <h2 style="color: #333; margin-bottom: 20px;">Reply to Your Contact Request</h2>
          
          <div style="background-color: #fff; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
            <p style="color: #666; margin-bottom: 10px;"><strong>Your Original Message:</strong></p>
            <div style="background-color: #f5f5f5; padding: 10px; border-left: 4px solid #007bff; margin-bottom: 20px;">
              <p style="color: #333; margin: 0;"><strong>From:</strong> ${contact.name}</p>
              <p style="color: #333; margin: 5px 0;"><strong>Email:</strong> ${contact.email}</p>
              <p style="color: #333; margin: 5px 0;"><strong>Subject:</strong> ${contact.subject || 'No subject'}</p>
              <p style="color: #333; margin: 10px 0;">${contact.message}</p>
            </div>
          </div>
          
          <div style="background-color: #fff; padding: 15px; border-radius: 5px;">
            <p style="color: #666; margin-bottom: 10px;"><strong>Our Reply:</strong></p>
            <div style="background-color: #e8f5e8; padding: 10px; border-left: 4px solid #28a745; margin-bottom: 10px;">
              <p style="color: #333; margin: 0; white-space: pre-wrap;">${message}</p>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #666; font-size: 12px;">
              This is an automated reply from ${process.env.EMAIL_FROM_NAME || 'PhysioCare Clinic'}.<br>
              If you need further assistance, please don't hesitate to contact us.
            </p>
          </div>
        </div>
      </div>
    `;

    console.log('📧 Sending email to:', contact.email);

    // Send email
    const emailResult = await sendMail({
      to: contact.email,
      subject: emailSubject,
      html: emailHtml
    });

    if (!emailResult.success) {
      console.log('❌ EMAIL ERROR:', emailResult.error);
      
      // Update contact record with failure
      contact.replyStatus = 'failed';
      contact.replyError = emailResult.error;
      contact.repliedAt = new Date();
      await contact.save();

      return res.status(500).json({
        success: false,
        message: 'Email send failed',
        error: emailResult.error
      });
    }

    // Update contact record with success
    contact.reply = {
      subject: subject,
      message: message,
      sentBy: req.admin?.email || 'Admin',
      messageId: emailResult.messageId
    };
    contact.replyStatus = 'sent';
    contact.replyError = null;
    contact.repliedAt = new Date();
    contact.isReplied = true;
    await contact.save();

    console.log('✅ Reply sent successfully:', {
      contactId: id,
      messageId: emailResult.messageId,
      previewUrl: emailResult.previewUrl
    });

    const response = {
      success: true,
      message: 'Reply sent successfully via email',
      data: {
        emailSent: true,
        messageId: emailResult.messageId,
        repliedAt: contact.repliedAt,
        previewUrl: emailResult.previewUrl // Only for Ethereal testing
      }
    };

    // Add preview URL for development
    if (emailResult.previewUrl) {
      response.data.previewUrl = emailResult.previewUrl;
      console.log('📧 Email preview URL:', emailResult.previewUrl);
    }

    return res.status(200).json(response);

  } catch (error) {
    console.error('❌ REPLY CONTROLLER ERROR:', error);
    
    // Update contact record with failure
    try {
      const contact = await Contact.findById(id);
      if (contact) {
        contact.replyStatus = 'failed';
        contact.replyError = error.message;
        contact.repliedAt = new Date();
        await contact.save();
      }
    } catch (saveError) {
      console.error('❌ Failed to update contact with error:', saveError);
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to send reply',
      error: error.message
    });
  }
});

module.exports = {
  replyToContact
};
