import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // בדיקה אם הטבלה CanonicalTag קיימת
    const canonicalTags = await prisma.canonicalTag.findMany();
    
    return NextResponse.json({ 
      success: true, 
      message: 'הטבלה CanonicalTag קיימת',
      count: canonicalTags.length,
      data: canonicalTags
    });
  } catch (error) {
    console.error('שגיאה בגישה לטבלה CanonicalTag:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'שגיאה בגישה לטבלה CanonicalTag',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 