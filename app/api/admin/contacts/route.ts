import { NextRequest, NextResponse } from 'next/server';
import { ContactStatus, Prisma } from '@prisma/client';
import prisma from '@/lib/prisma';
import { requireAdminApiAuth } from '@/lib/adminAuth';

export const dynamic = 'force-dynamic';

const STATUSES = new Set<string>(Object.values(ContactStatus));

export async function GET(request: NextRequest) {
  const unauthorized = await requireAdminApiAuth();
  if (unauthorized) return unauthorized;

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const q = searchParams.get('q')?.trim();

    const where: Prisma.ContactWhereInput = {};

    if (status && STATUSES.has(status)) {
      where.status = status as ContactStatus;
    }

    if (q) {
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { email: { contains: q, mode: 'insensitive' } },
        { phone: { contains: q, mode: 'insensitive' } },
        { message: { contains: q, mode: 'insensitive' } },
      ];
    }

    const contacts = await prisma.contact.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ contacts });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
