import { NextRequest } from 'next/server';
import prisma from '../../../lib/prisma';
import { sendContactEmail } from '../../../lib/emailService';
import { ContactService } from '@prisma/client';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    await prisma.$connect();
    console.log('Database connection successful');

    const contacts = await prisma.contact.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    return new Response(JSON.stringify({ contacts }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'X-Requested-With, Content-Type, Authorization'
      }
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to fetch contacts',
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
  } finally {
    await prisma.$disconnect();
  }
}

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

      // Send email notification using emailService
      try {
        console.log('Sending email notification...');
        await sendContactEmail({
          name,
          email,
          phone: phone || '',
          service: service || 'אחר',
          message
        });
        console.log('Email sent successfully');
      } catch (emailError) {
        console.error('Error sending email:', emailError);
        // Continue execution even if email fails
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

export async function OPTIONS(request: NextRequest) {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, Content-Type, Authorization'
    }
  });
} 