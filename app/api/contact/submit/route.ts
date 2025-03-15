import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { ContactService, ContactStatus } from '@prisma/client';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    // Test database connection
    try {
      await prisma.$connect();
      console.log('Database connection successful');
    } catch (dbError) {
      console.error('Database connection failed:', dbError);
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      );
    }

    const data = await request.json();

    // Validate required fields
    const requiredFields = ['name', 'email', 'phone', 'message', 'service'];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate phone format (Israeli phone number)
    const phoneRegex = /^(\+972|0)([23489]|5[0248]|77)[1-9]\d{6}$/;
    if (!phoneRegex.test(data.phone)) {
      return NextResponse.json(
        { error: 'Invalid phone number format' },
        { status: 400 }
      );
    }

    // Validate service type
    if (!Object.values(ContactService).includes(data.service)) {
      return NextResponse.json(
        { error: 'Invalid service type' },
        { status: 400 }
      );
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

    return NextResponse.json({ 
      success: true, 
      data: contact,
      message: 'Contact form submitted successfully'
    });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return NextResponse.json(
      { 
        error: 'Failed to submit contact form',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS(request: Request) {
  return NextResponse.json({}, { status: 200 });
} 