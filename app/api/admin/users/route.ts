import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getAdminUser } from '../../../../lib/adminAuth';

const prisma = new PrismaClient();
import { hash } from 'bcryptjs';

export async function GET() {
  try {
    // בדיקת הרשאות
    const user = await getAdminUser();
    if (!user) {
      return NextResponse.json(
        { error: 'לא מורשה' },
        { status: 401 }
      );
    }

    // רק מנהלים יכולים לראות משתמשים
    if (user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'אין הרשאה' },
        { status: 403 }
      );
    }

    const users = await prisma.user.findMany({
      include: {
        _count: {
          select: {
            posts: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const formattedUsers = users.map(user => ({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
      postCount: user._count.posts
    }));

    return NextResponse.json({
      users: formattedUsers
    });

  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'שגיאה בטעינת המשתמשים' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // בדיקת הרשאות
    const user = await getAdminUser();
    if (!user) {
      return NextResponse.json(
        { error: 'לא מורשה' },
        { status: 401 }
      );
    }

    // רק מנהלים יכולים ליצור משתמשים
    if (user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'אין הרשאה' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { username, email, password, role, isActive } = body;

    // ולידציה
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: 'שם משתמש, אימייל וסיסמה הם שדות חובה' },
        { status: 400 }
      );
    }

    // בדיקה אם המשתמש כבר קיים
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username },
          { email }
        ]
      }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'משתמש עם שם משתמש או אימייל זה כבר קיים' },
        { status: 400 }
      );
    }

    // הצפנת הסיסמה
    const hashedPassword = await hash(password, 12);

    // יצירת המשתמש
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role: role || 'author',
        isActive: isActive !== undefined ? isActive : true
      }
    });

    // החזרת המשתמש ללא הסיסמה
    const { password: _, ...userWithoutPassword } = newUser;

    return NextResponse.json({
      success: true,
      message: 'משתמש נוצר בהצלחה!',
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'שגיאה ביצירת המשתמש' },
      { status: 500 }
    );
  }
} 