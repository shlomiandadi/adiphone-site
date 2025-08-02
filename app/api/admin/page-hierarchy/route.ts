import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const hierarchy = await prisma.pageHierarchy.findMany({
      include: {
        children: {
          include: {
            children: true
          }
        }
      },
      where: {
        parentId: null // רק עמודים ראשיים
      },
      orderBy: [
        { level: 'asc' },
        { order: 'asc' }
      ]
    });

    return NextResponse.json(hierarchy);
  } catch (error) {
    console.error('שגיאה בטעינת היררכיה:', error);
    return NextResponse.json(
      { error: 'שגיאה בטעינת היררכיה' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const newHierarchy = await prisma.pageHierarchy.create({
      data: {
        pageId: body.pageId,
        pageSlug: body.pageSlug,
        pageTitle: body.pageTitle,
        parentId: body.parentId || null,
        level: body.level || 0,
        order: body.order || 0,
        isActive: body.isActive !== undefined ? body.isActive : true,
        showInBreadcrumb: body.showInBreadcrumb !== undefined ? body.showInBreadcrumb : true,
        breadcrumbTitle: body.breadcrumbTitle || null
      }
    });

    return NextResponse.json(newHierarchy);
  } catch (error) {
    console.error('שגיאה ביצירת היררכיה:', error);
    return NextResponse.json(
      { error: 'שגיאה ביצירת היררכיה' },
      { status: 500 }
    );
  }
} 