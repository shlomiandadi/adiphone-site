import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    const cookieStore = cookies();
    
    // מחיקת ה-cookie
    cookieStore.delete('admin-token');

    return NextResponse.json({
      success: true,
      message: 'התנתקות מוצלחת'
    });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'שגיאה בהתנתקות' 
      },
      { status: 500 }
    );
  }
} 