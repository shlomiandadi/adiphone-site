const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function sendEmail(to, subject, text, html) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
    html
  };

  return transporter.sendMail(mailOptions);
}

// Submit contact form
router.post('/submit', async (req, res) => {
  try {
    console.log('Received contact form submission:', req.body);
    const { name, email, phone, message, service } = req.body;

    // Create new contact submission
    const contact = new Contact({
      name,
      email,
      phone,
      message,
      service,
    });

    const savedContact = await contact.save();
    console.log('Contact saved to database:', savedContact);

    // Send email notification to admin
    const emailSubject = `פנייה חדשה באתר - ${service}`;
    const emailText = `
      שם: ${name}
      אימייל: ${email}
      טלפון: ${phone}
      שירות: ${service}
      הודעה: ${message}
    `;
    const emailHtml = `
      <div dir="rtl">
        <h2>פנייה חדשה באתר</h2>
        <p><strong>שם:</strong> ${name}</p>
        <p><strong>אימייל:</strong> ${email}</p>
        <p><strong>טלפון:</strong> ${phone}</p>
        <p><strong>שירות:</strong> ${service}</p>
        <p><strong>הודעה:</strong> ${message}</p>
      </div>
    `;

    console.log('Attempting to send admin notification email...');
    await sendEmail(
      process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
      emailSubject,
      emailText,
      emailHtml
    );
    console.log('Admin email sent');

    // Send confirmation email to the user
    const userEmailSubject = 'תודה שפנית אל עדי פון תקשורת';
    const userEmailText = `
      שלום ${name},

      תודה שפנית אל עדי פון תקשורת. פנייתך התקבלה ונציג שלנו יצור איתך קשר בהקדם.

      בברכה,
      צוות עדי פון תקשורת
    `;
    const userEmailHtml = `
      <div dir="rtl">
        <h2>תודה שפנית אל עדי פון תקשורת</h2>
        <p>שלום ${name},</p>
        <p>תודה שפנית אל עדי פון תקשורת. פנייתך התקבלה ונציג שלנו יצור איתך קשר בהקדם.</p>
        <p>בברכה,<br>צוות עדי פון תקשורת</p>
      </div>
    `;

    console.log('Attempting to send user confirmation email...');
    await sendEmail(email, userEmailSubject, userEmailText, userEmailHtml);
    console.log('User confirmation email sent');

    res.status(200).json({ 
      message: 'Contact form submitted successfully',
      contact: savedContact
    });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    res.status(500).json({ 
      message: 'Error submitting contact form',
      error: error.message 
    });
  }
});

// Get all contact submissions (admin only)
router.get('/submissions', async (req, res) => {
  try {
    const submissions = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json(submissions);
  } catch (error) {
    console.error('Error fetching contact submissions:', error);
    res.status(500).json({ message: 'Error fetching contact submissions' });
  }
});

// Update submission status (admin only)
router.patch('/submissions/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const submission = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.status(200).json(submission);
  } catch (error) {
    console.error('Error updating submission status:', error);
    res.status(500).json({ message: 'Error updating submission status' });
  }
});

module.exports = router; 