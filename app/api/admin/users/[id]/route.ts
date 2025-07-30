import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';
import { hash } from 'bcryptjs';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { username, email, password, role, isActive } = body;

    // ולידציה
    if (!username || !email) {
      return NextResponse.json(
        { error: 'שם משתמש ואימייל הם שדות חובה' },
        { status: 400 }
      );
    }

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

    // בדיקה אם שם המשתמש או האימייל כבר קיימים אצל משתמש אחר
    const duplicateUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username },
          { email }
        ],
        NOT: {
          id: params.id
        }
      }
    });

    if (duplicateUser) {
      return NextResponse.json(
        { error: 'משתמש עם שם משתמש או אימייל זה כבר קיים' },
        { status: 400 }
      );
    }

    // הכנת נתוני העדכון
    const updateData: any = {
      username,
      email,
      role: role || existingUser.role,
      isActive: isActive !== undefined ? isActive : existingUser.isActive
    };

    // אם יש סיסמה חדשה, הצפן אותה
    if (password) {
      updateData.password = await hash(password, 12);
    }

    // עדכון המשתמש
    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: updateData
    });

    // החזרת המשתמש ללא הסיסמה
    const { password: _, ...userWithoutPassword } = updatedUser;

    return NextResponse.json({
      success: true,
      message: 'משתמש עודכן בהצלחה!',
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'שגיאה בעדכון המשתמש' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // בדיקה אם המשתמש קיים
    const existingUser = await prisma.user.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            posts: true
          }
        }
      }
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: 'משתמש לא נמצא' },
        { status: 404 }
      );
    }

    // בדיקה אם יש פוסטים למשתמש
    if (existingUser._count.posts > 0) {
      return NextResponse.json(
        { error: 'לא ניתן למחוק משתמש שיש לו פוסטים' },
        { status: 400 }
      );
    }

    // מחיקת המשתמש
    await prisma.user.delete({
      where: { id: params.id }
    });

    return NextResponse.json({
      success: true,
      message: 'משתמש נמחק בהצלחה'
    });

  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'שגיאה במחיקת המשתמש' },
      { status: 500 }
    );
  }
} 