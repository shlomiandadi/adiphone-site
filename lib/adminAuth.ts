import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import { cookies } from 'next/headers';

export function getJwtSecret(): string | null {
  const secret = process.env.JWT_SECRET;
  return secret ? secret : null;
}

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: string;
  exp: number;
}

export function verifyAdminToken(token: string): AdminUser | null {
  const jwtSecret = getJwtSecret();
  if (!jwtSecret) {
    return null;
  }

  try {
    const decoded = verify(token, jwtSecret) as AdminUser;
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

export const ADMIN_ROLES = ['ADMIN'] as const;
export const EDITOR_ROLES = ['ADMIN', 'EDITOR'] as const;
export const POST_ROLES = ['ADMIN', 'EDITOR', 'AUTHOR'] as const;

export function adminRole(user: AdminUser): string {
  return String(user.role).toUpperCase();
}

export function isAuthorRole(user: AdminUser): boolean {
  return adminRole(user) === 'AUTHOR';
}

export function canManagePost(user: AdminUser, authorId?: string | null): boolean {
  const role = adminRole(user);
  if (role === 'ADMIN' || role === 'EDITOR') return true;
  if (role === 'AUTHOR') return Boolean(authorId) && authorId === user.id;
  return false;
}

export type AdminAuthSuccess = { ok: true; user: AdminUser };
export type AdminAuthFailure = { ok: false; response: NextResponse };
export type AdminAuthResult = AdminAuthSuccess | AdminAuthFailure;

export async function requireAdminApiUser(options?: {
  role?: string | string[];
}): Promise<AdminAuthResult> {
  const user = await getAdminUser();
  if (!user) {
    return { ok: false, response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }

  if (options?.role) {
    const allowed = Array.isArray(options.role) ? options.role : [options.role];
    if (!allowed.some((allowedRole) => allowedRole.toUpperCase() === adminRole(user))) {
      return { ok: false, response: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) };
    }
  }

  return { ok: true, user };
}

/** JSON 401/403 for API routes. Uses the same admin-token cookie as /admin pages. */
export async function requireAdminApiAuth(options?: {
  role?: string | string[];
}): Promise<NextResponse | null> {
  const result = await requireAdminApiUser(options);
  return result.ok ? null : result.response;
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