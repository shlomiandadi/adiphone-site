import { NextRequest } from 'next/server';
import prisma from '../../../lib/prisma';
import { sendEmail } from '../../../lib/email';
import { ContactService } from '@prisma/client';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  console.log('Processing contact form submission...');
  try {
    const body = await request.json();
    const { name, email, phone, message, service } = body;
    console.log('Received form data:', { name, email, phone, service });

    // Validate required fields
    if (!name || !email || !message) {
      console.log('Missing required fields');
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('Invalid email format:', email);
      return new Response(JSON.stringify({ error: 'Invalid email format' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    // Test database connection
    try {
      await prisma.$connect();
      console.log('Database connection successful');
    } catch (dbError) {
      console.error('Database connection failed:', dbError);
      throw new Error('Database connection failed');
    }

    // Map service value to ContactService enum
    let mappedService: ContactService = ContactService.OTHER;
    if (service === 'web-development') {
      mappedService = ContactService.WEB_DEVELOPMENT;
    } else if (service === 'seo') {
      mappedService = ContactService.SEO;
    } else if (service === 'ppc') {
      mappedService = ContactService.PPC;
    }
    console.log('Mapped service:', mappedService);

    try {
      // Save to database
      console.log('Saving to database...');
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
      console.log('Successfully saved to database:', contact.id);

      // Send email notification
      if (process.env.ADMIN_EMAIL) {
        try {
          console.log('Sending email notification...');
          await sendEmail({
            to: process.env.ADMIN_EMAIL,
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
          console.log('Email sent successfully');
        } catch (emailError) {
          console.error('Error sending email:', emailError);
          // Continue execution even if email fails
        }
      } else {
        console.log('No admin email configured');
      }

      return new Response(JSON.stringify({ success: true, contact }), {
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (dbError) {
      console.error('Database error:', dbError);
      throw new Error('Failed to save contact form');
    }
  } catch (error) {
    console.error('Error in contact form:', error);
    if (error instanceof Error) {
      console.error('Error stack:', error.stack);
    }
    return new Response(JSON.stringify({ 
      error: 'Internal Server Error', 
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: process.env.NODE_ENV === 'development' && error instanceof Error ? error.stack : undefined
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'X-Requested-With, Content-Type, Authorization'
      }
    });
  } finally {
    await prisma.$disconnect();
  }
} 