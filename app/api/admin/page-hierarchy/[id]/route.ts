import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    const updatedHierarchy = await prisma.pageHierarchy.update({
      where: {
        id: params.id
      },
      data: {
        pageTitle: body.pageTitle,
        level: body.level,
        order: body.order,
        isActive: body.isActive,
        showInBreadcrumb: body.showInBreadcrumb,
        breadcrumbTitle: body.breadcrumbTitle
      }
    });

    return NextResponse.json(updatedHierarchy);
  } catch (error) {
    console.error('שגיאה בעדכון היררכיה:', error);
    return NextResponse.json(
      { error: 'שגיאה בעדכון היררכיה' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.pageHierarchy.delete({
      where: {
        id: params.id
      }
    });

    return NextResponse.json({ message: 'היררכיה נמחקה בהצלחה' });
  } catch (error) {
    console.error('שגיאה במחיקת היררכיה:', error);
    return NextResponse.json(
      { error: 'שגיאה במחיקת היררכיה' },
      { status: 500 }
    );
  }
} 