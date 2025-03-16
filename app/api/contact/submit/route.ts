import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { ContactService, ContactStatus } from '@prisma/client';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const validateContactData = (data: any): { isValid: boolean; error?: string } => {
  if (!data) {
    return { isValid: false, error: 'No data provided' };
  }

  if (!data.name?.trim()) {
    return { isValid: false, error: 'Name is required' };
  }

  if (!data.email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return { isValid: false, error: 'Valid email is required' };
  }

  if (!data.phone?.trim()) {
    return { isValid: false, error: 'Phone is required' };
  }

  if (!data.message?.trim()) {
    return { isValid: false, error: 'Message is required' };
  }

  if (!Object.values(ContactService).includes(data.service)) {
    return { isValid: false, error: 'Invalid service type' };
  }

  return { isValid: true };
};

export async function POST(request: Request) {
  try {
    await prisma.$connect();
    
    const data = await request.json();
    
    const validation = validateContactData(data);
    if (!validation.isValid) {
      return new NextResponse(JSON.stringify({ error: validation.error }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'X-Requested-With, Content-Type, Authorization'
        }
      });
    }

    const contact = await prisma.contact.create({
      data: {
        name: data.name.trim(),
        email: data.email.trim(),
        phone: data.phone.trim(),
        message: data.message.trim(),
        service: data.service,
        status: ContactStatus.NEW
      },
    });

    return new NextResponse(JSON.stringify({ 
      success: true,
      message: 'Contact form submitted successfully',
      data: contact
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