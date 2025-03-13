import { NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
import Contact from '../../../models/Contact';
import { sendContactEmail, sendThankYouEmail } from '../../../lib/emailService';

// Add GET endpoint to fetch contacts
export async function GET() {
  try {
    await connectDB();
    const contacts = await Contact.find().sort({ createdAt: -1 }).exec();
    return NextResponse.json({ contacts });
  } catch (error) {
    console.error('GET Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contacts', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    console.log('Received data:', data);

    console.log('Connecting to DB...');
    await connectDB();
    console.log('DB connected');

    // Create contact record
    console.log('Creating contact...');
    const contact = await Contact.create(data);
    console.log('Contact created:', contact);

    // Try to send emails but don't fail if it doesn't work
    try {
      console.log('Sending emails...');
      await Promise.all([
        sendContactEmail(data),
        sendThankYouEmail(data.email, data.name)
      ]);
      console.log('Emails sent');
    } catch (emailError) {
      console.error('Error sending emails:', emailError);
      // Continue without failing the request
    }

    return NextResponse.json({ success: true, contact });
  } catch (error) {
    console.error('POST Error:', error);
    return NextResponse.json(
      { error: 'Failed to submit contact form', details: error.message },
      { status: 500 }
    );
  }
} 