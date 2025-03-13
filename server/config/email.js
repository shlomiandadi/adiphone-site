const nodemailer = require('nodemailer');

console.log('Email Configuration:', {
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  user: process.env.EMAIL_USER,
  pass: process.env.EMAIL_PASS ? '****' : 'not set'
});

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT),
  secure: false,
  requireTLS: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    ciphers: 'SSLv3'
  }
});

// Verify the connection configuration
transporter.verify()
  .then(() => console.log('SMTP server connection successful'))
  .catch(error => console.error('SMTP server connection error:', error));

const sendEmail = async (to, subject, text, html) => {
  try {
    console.log('Preparing to send email:', {
      to,
      subject,
      from: process.env.EMAIL_USER
    });

    const mailOptions = {
      from: `"AdiFon Website" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', {
      messageId: info.messageId,
      response: info.response,
      accepted: info.accepted,
      rejected: info.rejected
    });
    return true;
  } catch (error) {
    console.error('Error sending email:', {
      error: error.message,
      code: error.code,
      command: error.command
    });
    return false;
  }
};

module.exports = { transporter, sendEmail };