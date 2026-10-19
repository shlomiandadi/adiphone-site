import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { ContactService } from '@prisma/client';
import prisma from '@/lib/prisma';
import { LEAD_PLACEHOLDER_EMAIL } from '@/lib/lead-form';
import { mapContactService } from '@/lib/mapContactService';
import { brandLogoEmailHtml } from '@/lib/emailService';
import { formatAttributionEmailHtml, normalizeAttribution } from '@/lib/tracking';
import { postMetaCapiLead } from '@/lib/metaCapi';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const CORS_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'X-Requested-With, Content-Type, Authorization',
};

function json(body: unknown, status = 200) {
  return new NextResponse(JSON.stringify(body), { status, headers: CORS_HEADERS });
}

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const sendCustomerEmail = async (data: {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  [key: string]: unknown;
}) => {
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
          ${brandLogoEmailHtml()}
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
          ${formatAttributionEmailHtml(normalizeAttribution(data))}
          <p style="color: #666; line-height: 1.6;">בברכה,<br><strong>צוות עדי פון תקשורת</strong></p>
        </div>
      </div>
    `
  });
};

const sendAdminEmail = async (data: {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  [key: string]: unknown;
}) => {
  if (!resend) {
    throw new Error('Resend API key not configured');
  }

  return resend.emails.send({
    from: 'AdiPhone <noreply@adi-phone.co.il>',
    to: 'shlomiandadi@gmail.com',
    replyTo: data.email && data.email !== LEAD_PLACEHOLDER_EMAIL ? data.email : 'shlomiandadi@gmail.com',
    subject: 'פנייה חדשה - טופס יצירת קשר',
    html: `
      <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          ${brandLogoEmailHtml()}
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
          ${formatAttributionEmailHtml(normalizeAttribution(data))}
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

  if (!data.phone?.trim()) {
    return { isValid: false, error: 'נדרש מספר טלפון' };
  }

  if (!data.service?.trim() && !data.service_key?.trim()) {
    return { isValid: false, error: 'סוג השירות לא תקין' };
  }

  if (data.email?.trim() && data.email !== LEAD_PLACEHOLDER_EMAIL && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return { isValid: false, error: 'נדרש כתובת אימייל תקינה' };
  }

  return { isValid: true };
};

async function saveContactLead(payload: {
  name: string;
  email: string;
  phone: string;
  message: string;
  service: ContactService;
}) {
  return prisma.contact.create({
    data: {
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      message: payload.message,
      service: payload.service,
      status: 'NEW',
    },
  });
}

export async function GET() {
  return json({
    message: 'Contact API is working',
    timestamp: new Date().toISOString(),
  });
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const validation = validateContactData(data);
    if (!validation.isValid) {
      return json({ error: validation.error }, 400);
    }

    const email = data.email?.trim() && data.email !== LEAD_PLACEHOLDER_EMAIL
      ? data.email.trim()
      : LEAD_PLACEHOLDER_EMAIL;
    const name = String(data.name).trim();
    const phone = String(data.phone).trim();
    const serviceLabel = String(data.service || data.service_key || '').trim();
    const mappedService = mapContactService(data.service_key, data.service);
    const message = data.message?.trim() || `פנייה חדשה בנושא: ${serviceLabel || mappedService}`;

    const payload = {
      ...data,
      name,
      phone,
      email,
      message,
      service: serviceLabel || mappedService,
    };

    let saved = false;
    let contactId: string | null = null;
    try {
      const contact = await saveContactLead({
        name,
        email,
        phone,
        message,
        service: mappedService,
      });
      saved = true;
      contactId = contact.id;
    } catch (dbError) {
      console.error('Error saving contact lead:', dbError);
    }

    let emailSuccess = false;
    try {
      if (!resend) {
        throw new Error('Resend API key not configured');
      }
      const jobs = [sendAdminEmail(payload)];
      if (email && email !== LEAD_PLACEHOLDER_EMAIL) {
        jobs.push(sendCustomerEmail(payload));
      }
      await Promise.all(jobs);
      emailSuccess = true;
    } catch (emailError) {
      console.error('Error sending emails:', emailError);
    }

    if (saved) {
      try {
        await postMetaCapiLead({
          headers: request.headers,
          eventId: data?.meta_event_id,
          bodyConsent: data?.meta_consent,
          email,
          phone,
          name,
        });
      } catch (capiError) {
        console.error('Meta CAPI Lead request failed', {
          name: capiError instanceof Error ? capiError.name : 'Error',
        });
      }
    }

    if (saved || emailSuccess) {
      return json({
        success: true,
        message: 'Contact form submitted successfully',
        saved,
        emailSent: emailSuccess,
        contactId,
      });
    }

    return json({
      error: 'Failed to submit contact form',
      details: 'Both database save and email delivery failed',
    }, 500);
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return json({
      error: 'Failed to submit contact form',
      details: error instanceof Error ? error.message : 'Internal server error',
    }, 500);
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: CORS_HEADERS,
  });
}
