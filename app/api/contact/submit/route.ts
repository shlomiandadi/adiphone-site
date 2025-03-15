import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { ContactService, ContactStatus } from '@prisma/client';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: Request) {
  let client;
  try {
    client = await prisma.$connect();
    console.log('Database connection successful');

    const data = await request.json();

    // Validate required fields
    const requiredFields = ['name', 'email', 'phone', 'message', 'service'];
    for (const field of requiredFields) {
      if (!data[field]) {
        return new NextResponse(JSON.stringify({ 
          error: `Missing required field: ${field}` 
        }), {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'X-Requested-With, Content-Type, Authorization'
          }
        });
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return new NextResponse(JSON.stringify({ 
        error: 'Invalid email format' 
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'X-Requested-With, Content-Type, Authorization'
        }
      });
    }

    // Validate phone format (Israeli phone number)
    const phoneRegex = /^(\+972|0)([23489]|5[0248]|77)[1-9]\d{6}$/;
    if (!phoneRegex.test(data.phone)) {
      return new NextResponse(JSON.stringify({ 
        error: 'Invalid phone number format' 
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'X-Requested-With, Content-Type, Authorization'
        }
      });
    }

    // Validate service type
    if (!Object.values(ContactService).includes(data.service)) {
      return new NextResponse(JSON.stringify({ 
        error: 'Invalid service type' 
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'X-Requested-With, Content-Type, Authorization'
        }
      });
    }

    // Create contact in database
    const contact = await prisma.contact.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        message: data.message,
        service: data.service as ContactService,
        status: ContactStatus.NEW
      },
    });

    // Send email notification (you can implement this later)
    // await sendEmail({
    //   to: process.env.ADMIN_EMAIL,
    //   subject: 'New Contact Form Submission',
    //   text: `
    //     Name: ${data.name}
    //     Email: ${data.email}
    //     Phone: ${data.phone}
    //     Service: ${data.service}
    //     Message: ${data.message}
    //   `
    // });

    return new NextResponse(JSON.stringify({ 
      success: true, 
      data: contact,
      message: 'Contact form submitted successfully'
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
      details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
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
    if (client) {
      await prisma.$disconnect();
    }
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