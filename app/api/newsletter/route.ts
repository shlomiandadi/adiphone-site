import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';
import { ContactService, ContactStatus } from '@prisma/client';
import { sendThankYouEmail } from '../../../lib/emailService';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    console.log('Newsletter data:', data);

    // Create contact record with newsletter type
    console.log('Creating contact...');
    const contact = await prisma.contact.create({
      data: {
        name: data.name || data.email.split('@')[0],
        email: data.email,
        phone: 'N/A',
        message: 'Newsletter subscription',
        service: ContactService.OTHER,
        status: ContactStatus.NEW
      }
    });
    console.log('Contact created:', contact);

    // Send thank you email
    console.log('Sending thank you email...');
    await sendThankYouEmail(data.email, data.name || data.email.split('@')[0]);
    console.log('Email sent');

    return NextResponse.json({ success: true, contact });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to subscribe to newsletter', 
        details: error instanceof Error ? error.message : 'Internal server error'
      },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'X-Requested-With, Content-Type, Authorization'
        }
      }
    );
  }
} 