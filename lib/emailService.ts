import { Resend } from 'resend';

// Only create Resend instance if API key is available
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function sendContactEmail(data: any) {
  if (!resend) {
    throw new Error('Resend API key not configured');
  }

  const mailOptions = {
    from: 'AdiPhone <noreply@adi-phone.co.il>',
    to: process.env.ADMIN_EMAIL || 'shlomiandadi@gmail.com',
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
    `,
    replyTo: data.email
  };

  try {
    await resend.emails.send(mailOptions);
    console.log('Contact email sent successfully');
  } catch (error) {
    console.error('Error sending contact email:', error);
    throw error;
  }
}

export async function sendThankYouEmail(email: string, name: string) {
  if (!resend) {
    throw new Error('Resend API key not configured');
  }

  const mailOptions = {
    from: 'AdiPhone <noreply@adi-phone.co.il>',
    to: email,
    replyTo: 'shlomiandadi@gmail.com',
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
    await resend.emails.send(mailOptions);
    console.log('Thank you email sent successfully');
  } catch (error) {
    console.error('Error sending thank you email:', error);
    throw error;
  }
} 