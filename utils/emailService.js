const { Resend } = require('resend');

/**
 * Production-Ready Resend Email Service for PhysioCare Clinic
 * Complete email service with comprehensive validation and error handling
 */
class EmailService {
  constructor() {
    this.emailEnabled = false;
    this.config = {};
    this.initializeResend();
  }

  /**
   * Initialize Resend with comprehensive validation and logging
   */
  initializeResend() {
    console.log('📧 ============================================');
    console.log('📧 RESEND EMAIL SERVICE INITIALIZATION');
    console.log('📧 ============================================');

    const { config, validation } = this.validateEmailConfig();

    // Log configuration status (safe, no secrets)
    console.log('📧 Configuration Status:');
    console.log(`   • Resend API key present: ${config.apiKey ? '✅ Yes' : '❌ No'}`);
    console.log(`   • Resend sender email present: ${config.fromEmail ? '✅ Yes' : '❌ No'}`);
    console.log(`   • Resend sender name: ${config.fromName}`);

    // Log validation errors
    if (validation.errors.length > 0) {
      console.log('❌ VALIDATION ERRORS:');
      validation.errors.forEach(error => console.log(`   • ${error}`));
      console.log('📧 Email service will be DISABLED');
      this.emailEnabled = false;
      this.config = config;
      return;
    }

    try {
      // Initialize Resend
      this.resend = new Resend(config.apiKey);
      this.emailEnabled = true;
      this.config = config;

      console.log('✅ RESEND INITIALIZATION SUCCESSFUL');
      console.log('📧 Email service is ENABLED and ready');
      console.log('📧 Sender: ' + this.config.fromName + ' <' + this.config.fromEmail + '>');
      console.log('📧 IMPORTANT: Sender domain must be verified in Resend dashboard');
      console.log('📧 ============================================');
      
    } catch (error) {
      console.error('❌ RESEND INITIALIZATION FAILED:');
      console.error(`   • Error: ${error.message}`);
      console.log('📧 Email service will be DISABLED');
      this.emailEnabled = false;
      this.config = config;
    }
  }

  /**
   * Validate email configuration - comprehensive startup validation
   */
  validateEmailConfig() {
    const config = {
      apiKey: process.env.RESEND_API_KEY,
      fromEmail: process.env.RESEND_FROM_EMAIL,
      fromName: process.env.RESEND_FROM_NAME || 'PhysioCare Clinic'
    };

    const validation = {
      isValid: true,
      errors: []
    };

    // Check API Key
    if (!config.apiKey) {
      validation.isValid = false;
      validation.errors.push('RESEND_API_KEY is missing from environment variables');
    } else if (config.apiKey === 're_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx') {
      validation.isValid = false;
      validation.errors.push('RESEND_API_KEY is still placeholder value - replace with real Resend API key');
    } else if (!config.apiKey.startsWith('re_')) {
      validation.isValid = false;
      validation.errors.push('RESEND_API_KEY format is invalid - should start with "re_"');
    }

    // Check From Email
    if (!config.fromEmail) {
      validation.isValid = false;
      validation.errors.push('RESEND_FROM_EMAIL is missing from environment variables');
    } else if (!this.isValidEmail(config.fromEmail)) {
      validation.isValid = false;
      validation.errors.push('RESEND_FROM_EMAIL format is invalid');
    }

    return { config, validation };
  }

  /**
   * Check if email service is properly configured
   */
  isConfigured() {
    const { validation } = this.validateEmailConfig();
    
    if (validation.errors.length > 0) {
      return { 
        success: false, 
        error: validation.errors[0] // Return first specific error
      };
    }
    
    return { success: true };
  }

  /**
   * Validate email format
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Initialize Resend (explicit method)
   */
  initialize() {
    this.initializeResend();
  }

  /**
   * Send email using Resend with comprehensive error handling
   */
  async sendEmail({ to, subject, html, text }) {
    // Check if service is configured
    const configCheck = this.isConfigured();
    if (!configCheck.success) {
      return { 
        success: false, 
        error: configCheck.error 
      };
    }

    // Validate recipient
    if (!to || typeof to !== 'string' || !this.isValidEmail(to)) {
      console.error('❌ Invalid recipient email:', to);
      return { 
        success: false, 
        error: 'Invalid recipient email address' 
      };
    }

    try {
      console.log('📧 Sending email via Resend...');
      console.log(`   • From: ${this.config.fromName} <${this.config.fromEmail}>`);
      console.log(`   • To: ${to}`);
      console.log(`   • Subject: ${subject}`);

      const emailOptions = {
        from: this.config.fromEmail, // Uses RESEND_FROM_EMAIL
        to: [to],
        subject: subject,
        html: html,
        text: text
      };

      const response = await this.resend.emails.send(emailOptions);
      
      console.log('📧 Raw Resend response:', JSON.stringify(response, null, 2));
      
      // Check for Resend error response
      if (response.error) {
        console.error('❌ RESEND API ERROR:');
        console.error(`   • Status Code: ${response.error.statusCode}`);
        console.error(`   • Message: ${response.error.message}`);
        console.error(`   • Error Type: ${response.error.name}`);
        
        let errorMessage = response.error.message;
        
        // Handle specific Resend errors
        if (response.error.statusCode === 403) {
          if (response.error.message.includes('domain is not verified')) {
            errorMessage = `Sender domain not verified in Resend: ${this.config.fromEmail}. Please verify your domain at https://resend.com/domains`;
          } else {
            errorMessage = `Sender verification failed: ${response.error.message}`;
          }
        } else if (response.error.statusCode === 422) {
          errorMessage = `Invalid email data: ${response.error.message}`;
        } else if (response.error.statusCode === 429) {
          errorMessage = 'Rate limit exceeded - please try again later';
        }
        
        return { 
          success: false, 
          error: errorMessage,
          providerError: response.error
        };
      }
      
      // Validate actual provider response data
      if (!response || !response.data) {
        console.error('❌ RESEND RESPONSE INVALID: No response data received');
        return { 
          success: false, 
          error: 'Invalid response from Resend - no data received' 
        };
      }
      
      // Extract success information
      const messageId = response.data.id;
      
      if (!messageId) {
        console.error('❌ RESEND RESPONSE INVALID: No message ID in response');
        console.error('   • Full response:', JSON.stringify(response, null, 2));
        return { 
          success: false, 
          error: 'Invalid response from Resend - no message ID received' 
        };
      }
      
      console.log('✅ Email sent successfully');
      console.log(`   • Message ID: ${messageId}`);
      console.log(`   • Full Response: ${JSON.stringify(response.data, null, 2)}`);
      
      return { 
        success: true, 
        messageId: messageId,
        providerResponse: response.data,
        accepted: true
      };
      
    } catch (error) {
      console.error('❌ RESEND EMAIL FAILED:');
      console.error(`   • Error message: ${error.message}`);
      console.error(`   • Error code: ${error.code}`);
      
      // Log detailed Resend error response
      if (error.response?.body) {
        console.error('   • Resend Response:', JSON.stringify(error.response.body, null, 2));
      }
      
      // Extract specific error message
      let errorMessage = error.message;
      if (error.response?.body?.errors?.length > 0) {
        const resendError = error.response.body.errors[0];
        errorMessage = resendError.message || resendError.field ? 
          `${resendError.message} (${resendError.field})` : 
          resendError.message;
      }
      
      // Handle common Resend errors
      if (error.code === 401) {
        errorMessage = 'Invalid Resend API key - check RESEND_API_KEY';
      } else if (error.code === 403) {
        errorMessage = 'Sender domain not verified - check RESEND_FROM_EMAIL in Resend dashboard';
      } else if (error.code === 429) {
        errorMessage = 'Resend rate limit exceeded - please try again later';
      }
      
      return { 
        success: false, 
        error: errorMessage 
      };
    }
  }

  /**
   * Send appointment confirmation email
   * Clean interface as requested
   */
  async sendAppointmentConfirmationEmail({ to, patientName, appointmentDate, appointmentTime, mode, notes }) {
    const subject = 'Your Appointment is Confirmed – PhysioCare';
    const { html, text } = this.generateAppointmentContent({ patientName, appointmentDate, appointmentTime, mode, notes });
    
    return await this.sendEmail({
      to: to,
      subject: subject,
      html: html,
      text: text
    });
  }

  /**
   * Legacy method for backward compatibility
   */
  async sendAppointmentConfirmation(appointment) {
    return await this.sendAppointmentConfirmationEmail({
      to: appointment.patientEmail,
      patientName: appointment.patientName,
      appointmentDate: appointment.appointmentDate,
      appointmentTime: appointment.appointmentTime,
      mode: appointment.mode,
      notes: appointment.notes
    });
  }

  /**
   * Generate professional email content for appointment confirmation
   */
  generateAppointmentContent({ patientName, appointmentDate, appointmentTime, mode, notes }) {
    const formattedDate = new Date(appointmentDate).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const modeText = mode === 'clinic' ? 'In-Clinic' : 'Online Consultation';

    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Appointment Confirmation</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%); color: white; padding: 30px 20px; text-align: center; }
        .header h1 { margin: 0; font-size: 28px; font-weight: 300; }
        .header p { margin: 10px 0 0 0; opacity: 0.9; }
        .content { padding: 40px 30px; }
        .greeting { font-size: 20px; color: #2c3e50; margin-bottom: 20px; }
        .appointment-details { background: #f8f9fa; border-left: 4px solid #4F46E5; padding: 20px; margin: 20px 0; border-radius: 0 8px 8px 0; }
        .detail-row { display: flex; justify-content: space-between; margin: 10px 0; }
        .detail-label { font-weight: 600; color: #555; }
        .detail-value { color: #2c3e50; }
        .notes { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .contact-info { background: #e8f4fd; border-left: 4px solid #0066cc; padding: 20px; margin: 20px 0; border-radius: 0 8px 8px 0; }
        .footer { background: #2c3e50; color: white; text-align: center; padding: 20px; font-size: 14px; }
        .footer p { margin: 5px 0; }
        .highlight { color: #4F46E5; font-weight: 600; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Appointment Confirmation</h1>
            <p>PhysioCare Clinic</p>
        </div>
        
        <div class="content">
            <div class="greeting">
                Hello <span class="highlight">${patientName}</span>,
            </div>
            <p>Your appointment has been confirmed. Here are the details:</p>
            
            <div class="appointment-details">
                <h3>📅 Appointment Details</h3>
                <div class="detail-row">
                    <span class="detail-label">Date:</span>
                    <span class="detail-value">${formattedDate}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Time:</span>
                    <span class="detail-value">${appointmentTime}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Mode:</span>
                    <span class="detail-value">${modeText}</span>
                </div>
                ${notes ? `
                <div class="notes">
                    <strong>Notes:</strong> ${notes}
                </div>
                ` : ''}
            </div>
            
            <div class="contact-info">
                <h3>📞 Contact Information</h3>
                <div class="detail-row">
                    <span class="detail-label">Phone:</span>
                    <span class="detail-value">+1 (555) 123-4567</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Address:</span>
                    <span class="detail-value">123 Health Street, Medical City, MC 12345</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Website:</span>
                    <span class="detail-value">www.physiocare.com</span>
                </div>
            </div>
        </div>
        
        <div class="footer">
            <p>Thank you for choosing <strong>PhysioCare Clinic</strong>!</p>
            <p>This is an automated message. Please do not reply to this email.</p>
        </div>
    </div>
</body>
</html>`;

    const text = `
Appointment Confirmation - PhysioCare Clinic

Hello ${patientName},

Your appointment has been confirmed. Here are the details:

Date: ${formattedDate}
Time: ${appointmentTime}
Mode: ${modeText}
${notes ? `Notes: ${notes}` : ''}

Contact Information:
Phone: +1 (555) 123-4567
Address: 123 Health Street, Medical City, MC 12345
Website: www.physiocare.com

Thank you for choosing PhysioCare Clinic!
This is an automated message. Please do not reply to this email.
`;

    return { html, text };
  }

  /**
   * Get current service status
   */
  getStatus() {
    return {
      enabled: this.emailEnabled,
      config: {
        hasApiKey: !!this.config.apiKey,
        fromEmail: this.config.fromEmail,
        fromName: this.config.fromName
      }
    };
  }
}

// Singleton instance
const emailService = new EmailService();

module.exports = emailService;
