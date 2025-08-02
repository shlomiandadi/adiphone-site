import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    const updatedBreadcrumb = await prisma.breadcrumb.update({
      where: {
        id: params.id
      },
      data: {
        pageSlug: body.pageSlug,
        breadcrumbData: body.breadcrumbData,
        isActive: body.isActive
      }
    });

    return NextResponse.json(updatedBreadcrumb);
  } catch (error) {
    console.error('שגיאה בעדכון פירורי לחם:', error);
    return NextResponse.json(
      { error: 'שגיאה בעדכון פירורי לחם' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.breadcrumb.delete({
      where: {
        id: params.id
      }
    });

    return NextResponse.json({ message: 'פירורי לחם נמחקו בהצלחה' });
  } catch (error) {
    console.error('שגיאה במחיקת פירורי לחם:', error);
    return NextResponse.json(
      { error: 'שגיאה במחיקת פירורי לחם' },
      { status: 500 }
    );
  }
} 