import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Only create Resend instance if API key is available
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// פונקציה לשליחת מייל ללקוח
const sendCustomerEmail = async (data: any) => {
  if (!resend) {
    throw new Error('Resend API key not configured');
  }

  return resend.emails.send({
    from: 'AdiPhone <noreply@adi-phone.co.il>',
    to: data.email,
    replyTo: 'shlomiandadi@gmail.com',
    subject: 'תודה שפנית אלינו - עדי פון תקשורת',
    html: `
      <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-bottom: 20px;">שלום ${data.name},</h2>
          <p style="color: #666; line-height: 1.6;">תודה שפנית אלינו. קיבלנו את פנייתך ונחזור אליך בהקדם.</p>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-bottom: 15px;">פרטי הפנייה שלך:</h3>
            <ul style="color: #666; line-height: 1.8;">
              <li><strong>שם:</strong> ${data.name}</li>
              <li><strong>דוא"ל:</strong> ${data.email}</li>
              <li><strong>טלפון:</strong> ${data.phone}</li>
              <li><strong>שירות:</strong> ${data.service}</li>
              <li><strong>הודעה:</strong> ${data.message}</li>
            </ul>
          </div>
          <p style="color: #666; line-height: 1.6;">בברכה,<br><strong>צוות עדי פון תקשורת</strong></p>
        </div>
      </div>
    `
  });
};

// פונקציה לשליחת מייל למנהל
const sendAdminEmail = async (data: any) => {
  if (!resend) {
    throw new Error('Resend API key not configured');
  }

  return resend.emails.send({
    from: 'AdiPhone <noreply@adi-phone.co.il>',
    to: 'shlomiandadi@gmail.com',
    replyTo: data.email,
    subject: 'פנייה חדשה - טופס יצירת קשר',
    html: `
      <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-bottom: 20px;">פנייה חדשה התקבלה</h2>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-bottom: 15px;">פרטי הפונה:</h3>
            <ul style="color: #666; line-height: 1.8;">
              <li><strong>שם:</strong> ${data.name}</li>
              <li><strong>דוא"ל:</strong> ${data.email}</li>
              <li><strong>טלפון:</strong> ${data.phone}</li>
              <li><strong>שירות:</strong> ${data.service}</li>
              <li><strong>הודעה:</strong> ${data.message}</li>
            </ul>
          </div>
          <p style="color: #666; line-height: 1.6;">זמן הפנייה: ${new Date().toLocaleString('he-IL')}</p>
        </div>
      </div>
    `
  });
};

const validateContactData = (data: any): { isValid: boolean; error?: string } => {
  if (!data) {
    return { isValid: false, error: 'לא נשלחו נתונים' };
  }

  if (!data.name?.trim()) {
    return { isValid: false, error: 'נדרש שם מלא' };
  }

  if (!data.email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return { isValid: false, error: 'נדרש כתובת אימייל תקינה' };
  }

  if (!data.phone?.trim()) {
    return { isValid: false, error: 'נדרש מספר טלפון' };
  }

  if (!data.message?.trim()) {
    return { isValid: false, error: 'נדרשת הודעה' };
  }

  if (!data.service?.trim()) {
    return { isValid: false, error: 'סוג השירות לא תקין' };
  }

  return { isValid: true };
};

export async function GET() {
  return new NextResponse(JSON.stringify({ 
    message: 'Contact API is working',
    timestamp: new Date().toISOString()
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, Content-Type, Authorization'
    }
  });
}

export async function POST(request: Request) {
  try {
    console.log('POST request received to /api/contact/submit');
    
    const data = await request.json();
    console.log('Request data:', data);

    const validation = validateContactData(data);
    if (!validation.isValid) {
      console.log('Validation failed:', validation.error);
      return new NextResponse(JSON.stringify({ error: validation.error }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'X-Requested-With, Content-Type, Authorization'
        }
      });
    }

    // בדיקה שהגדרות המייל קיימות
    if (!process.env.RESEND_API_KEY) {
      console.error('Resend API key missing');
      return new NextResponse(JSON.stringify({ 
        error: 'Email service not configured properly'
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'X-Requested-With, Content-Type, Authorization'
        }
      });
    }

    console.log('RESEND_API_KEY:', process.env.RESEND_API_KEY ? '***' + process.env.RESEND_API_KEY.slice(-4) : undefined);

    // שליחת מיילים
    let emailSuccess = false;
    try {
      await Promise.all([
        sendCustomerEmail(data),
        sendAdminEmail(data)
      ]);
      emailSuccess = true;
      console.log('Emails sent successfully');
    } catch (emailError) {
      console.error('Error sending emails:', emailError);
      // נחזיר שגיאה למשתמש אם שליחת המיילים נכשלה
      return new NextResponse(JSON.stringify({ 
        error: 'שגיאה בשליחת המייל. אנא נסה שוב מאוחר יותר.',
        details: emailError instanceof Error ? emailError.message : 'Email sending failed'
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'X-Requested-With, Content-Type, Authorization'
        }
      });
    }

    console.log('Contact form submitted successfully');
    return new NextResponse(JSON.stringify({ 
      success: true,
      message: 'Contact form submitted successfully',
      emailSent: emailSuccess
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'X-Requested-With, Content-Type, Authorization'
      }
    });

  } catch (error) {
    console.error('Error submitting contact form:', error);
    return new NextResponse(JSON.stringify({ 
      error: 'Failed to submit contact form',
      details: error instanceof Error ? error.message : 'Internal server error'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'X-Requested-With, Content-Type, Authorization'
      }
    });
  }
}

export async function OPTIONS(request: Request) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, Content-Type, Authorization'
    }
  });
} 