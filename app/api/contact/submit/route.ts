import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
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

    // Create contact in database
    const contact = await prisma.contact.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        message: data.message,
        service: data.service,
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

    return NextResponse.json({ success: true, data: contact });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return NextResponse.json(
      { error: 'Failed to submit contact form' },
      { status: 500 }
    );
  }
} 