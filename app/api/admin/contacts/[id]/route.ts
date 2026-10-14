import { NextRequest, NextResponse } from 'next/server';
import { ContactStatus } from '@prisma/client';
import prisma from '@/lib/prisma';
import { requireAdminApiAuth } from '@/lib/adminAuth';

export const dynamic = 'force-dynamic';

const ALLOWED_STATUSES = new Set<string>([
  ContactStatus.NEW,
  ContactStatus.IN_PROGRESS,
  ContactStatus.COMPLETED,
  ContactStatus.ARCHIVED,
]);

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const unauthorized = await requireAdminApiAuth();
  if (unauthorized) return unauthorized;

  try {
    const body = await request.json();
    const status = typeof body?.status === 'string' ? body.status : '';

    if (!ALLOWED_STATUSES.has(status)) {
      return NextResponse.json(
        { error: 'סטטוס לא תקין' },
        { status: 400 }
      );
    }

    const existing = await prisma.contact.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return NextResponse.json({ error: 'פנייה לא נמצאה' }, { status: 404 });
    }

    const contact = await prisma.contact.update({
      where: { id: params.id },
      data: { status: status as ContactStatus },
    });

    return NextResponse.json({ success: true, contact });
  } catch (error) {
    console.error('Error updating contact:', error);
    return NextResponse.json(
      { error: 'שגיאה בעדכון הפנייה' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const unauthorized = await requireAdminApiAuth();
  if (unauthorized) return unauthorized;

  try {
    const existing = await prisma.contact.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return NextResponse.json({ error: 'פנייה לא נמצאה' }, { status: 404 });
    }

    await prisma.contact.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting contact:', error);
    return NextResponse.json(
      { error: 'שגיאה במחיקת הפנייה' },
      { status: 500 }
    );
  }
}
