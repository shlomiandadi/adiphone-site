import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import Contact from '../../../../models/Contact';

export async function GET() {
  try {
    // Connect to MongoDB
    await connectDB();
    
    // Create test contact data
    const testData = {
      name: "משתמש טסט",
      email: "test@example.com",
      phone: "050-1234567",
      message: "זוהי הודעת טסט לבדיקת שמירה במסד הנתונים"
    };
    
    // Save test contact data to MongoDB
    const contact = await Contact.create(testData);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Test contact created successfully',
      contact: contact 
    });

  } catch (error) {
    console.error('Error in test contact creation:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to create test contact',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 