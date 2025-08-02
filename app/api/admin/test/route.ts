import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // בדיקה פשוטה של חיבור למסד הנתונים
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    
    return NextResponse.json({ 
      success: true, 
      message: 'חיבור למסד הנתונים עובד',
      result 
    });
  } catch (error) {
    console.error('שגיאה בחיבור למסד הנתונים:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'שגיאה בחיבור למסד הנתונים',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 