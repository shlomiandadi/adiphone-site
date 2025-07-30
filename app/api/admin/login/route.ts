import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { sign } from 'jsonwebtoken';
import { compare } from 'bcryptjs';
import { prisma } from '../../../../lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // חיפוש המשתמש במסד הנתונים
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { username },
          { email: username }
        ]
      }
    });

    // בדיקה אם המשתמש קיים ופעיל
    if (!user || !user.isActive) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'פרטי התחברות שגויים או משתמש לא פעיל' 
        },
        { status: 401 }
      );
    }

    // בדיקת הסיסמה
    const isPasswordValid = await compare(password, user.password);
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'פרטי התחברות שגויים' 
        },
        { status: 401 }
      );
    }

    // עדכון זמן התחברות אחרונה
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    });

    // יצירת JWT token
    const token = sign(
      { 
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 שעות
      },
      JWT_SECRET
    );

    // הגדרת cookie
    const cookieStore = cookies();
    cookieStore.set('admin-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 // 24 שעות
    });

    return NextResponse.json({
      success: true,
      message: 'התחברות מוצלחת',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'שגיאה בשרת' 
      },
      { status: 500 }
    );
  }
} 