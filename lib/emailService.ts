import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export async function sendContactEmail(data: any) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
    subject: 'טופס יצירת קשר חדש',
    html: `
      <div dir="rtl">
        <h2>התקבלה פנייה חדשה מהאתר</h2>
        <p><strong>שם:</strong> ${data.name}</p>
        <p><strong>אימייל:</strong> ${data.email}</p>
        <p><strong>טלפון:</strong> ${data.phone}</p>
        <p><strong>שירות:</strong> ${data.service}</p>
        <p><strong>הודעה:</strong></p>
        <p>${data.message}</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Contact email sent successfully');
  } catch (error) {
    console.error('Error sending contact email:', error);
    throw error;
  }
}

export async function sendThankYouEmail(email: string, name: string) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'תודה על פנייתך',
    html: `
      <div dir="rtl">
        <h2>שלום ${name},</h2>
        <p>תודה על פנייתך. נחזור אליך בהקדם האפשרי.</p>
        <p>בברכה,<br>צוות עדי פון תקשורת</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Thank you email sent successfully');
  } catch (error) {
    console.error('Error sending thank you email:', error);
    throw error;
  }
} 