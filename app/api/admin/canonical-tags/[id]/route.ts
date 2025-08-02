import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    const updatedCanonicalTag = await prisma.canonicalTag.update({
      where: {
        id: params.id
      },
      data: {
        pageSlug: body.pageSlug,
        canonicalUrl: body.canonicalUrl,
        isActive: body.isActive
      }
    });

    return NextResponse.json(updatedCanonicalTag);
  } catch (error) {
    console.error('שגיאה בעדכון תגית קנוניקל:', error);
    return NextResponse.json(
      { error: 'שגיאה בעדכון תגית קנוניקל' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.canonicalTag.delete({
      where: {
        id: params.id
      }
    });

    return NextResponse.json({ message: 'תגית קנוניקל נמחקה בהצלחה' });
  } catch (error) {
    console.error('שגיאה במחיקת תגית קנוניקל:', error);
    return NextResponse.json(
      { error: 'שגיאה במחיקת תגית קנוניקל' },
      { status: 500 }
    );
  }
} 