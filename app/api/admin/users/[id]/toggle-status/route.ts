import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../../lib/prisma';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { isActive } = body;

    // בדיקה אם המשתמש קיים
    const existingUser = await prisma.user.findUnique({
      where: { id: params.id }
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: 'משתמש לא נמצא' },
        { status: 404 }
      );
    }

    // עדכון סטטוס המשתמש
    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: {
        isActive: isActive
      }
    });

    // החזרת המשתמש ללא הסיסמה
    const { password: _, ...userWithoutPassword } = updatedUser;

    return NextResponse.json({
      success: true,
      message: `משתמש ${isActive ? 'הופעל' : 'הושבת'} בהצלחה!`,
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Error toggling user status:', error);
    return NextResponse.json(
      { error: 'שגיאה בשינוי סטטוס המשתמש' },
      { status: 500 }
    );
  }
} 