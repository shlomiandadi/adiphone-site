import { NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
import Contact from '../../../models/Contact';
import { sendThankYouEmail } from '../../../lib/emailService';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    console.log('Newsletter data:', data);

    console.log('Connecting to DB...');
    await connectDB();
    console.log('DB connected');

    // Create contact record with newsletter type
    console.log('Creating contact...');
    const contact = await Contact.create({
      name: data.name || data.email.split('@')[0],
      email: data.email,
      phone: 'N/A',
      message: 'Newsletter subscription',
      service: 'newsletter'
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
      { error: 'Failed to subscribe to newsletter', details: error.message },
      { status: 500 }
    );
  }
} 