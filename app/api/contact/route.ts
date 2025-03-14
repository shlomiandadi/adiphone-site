import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { sendEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, message, service } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    // Map service value to ContactService enum
    let mappedService = service;
    if (service === 'web-development') {
      mappedService = 'WEB_DEVELOPMENT';
    } else if (service === 'seo') {
      mappedService = 'SEO';
    } else if (service === 'ppc') {
      mappedService = 'PPC';
    } else {
      mappedService = 'OTHER';
    }

    // Save to database
    const contact = await prisma.contact.create({
      data: {
        name,
        email,
        phone: phone || '',
        message,
        service: mappedService,
        status: 'NEW'
      }
    });

    // Send email notification
    await sendEmail({
      to: process.env.ADMIN_EMAIL!,
      subject: 'הודעה חדשה מהאתר',
      html: `
        <h2>הודעה חדשה מהאתר</h2>
        <p><strong>שם:</strong> ${name}</p>
        <p><strong>אימייל:</strong> ${email}</p>
        <p><strong>טלפון:</strong> ${phone || 'לא צוין'}</p>
        <p><strong>שירות:</strong> ${service || 'אחר'}</p>
        <p><strong>הודעה:</strong></p>
        <p>${message}</p>
      `
    });

    return new Response(JSON.stringify({ success: true, contact }), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error in contact form:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error', details: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
} 