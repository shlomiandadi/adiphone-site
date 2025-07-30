import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: string;
  exp: number;
}

export function verifyAdminToken(token: string): AdminUser | null {
  try {
    const decoded = verify(token, JWT_SECRET) as AdminUser;
    return decoded;
  } catch (error) {
    return null;
  }
}

export async function getAdminUser(): Promise<AdminUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin-token')?.value;
  
  if (!token) {
    return null;
  }

  return verifyAdminToken(token);
}

export async function requireAdminAuth(request: NextRequest): Promise<NextResponse | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin-token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  const user = verifyAdminToken(token);
  if (!user || user.role !== 'admin') {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  // בדיקה אם הטוקן פג תוקף
  if (user.exp < Math.floor(Date.now() / 1000)) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  return null; // המשתמש מאומת
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete('admin-token');
} 