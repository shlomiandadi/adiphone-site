import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const breadcrumbs = await prisma.breadcrumb.findMany({
      orderBy: {
        pageSlug: 'asc'
      }
    });

    return NextResponse.json(breadcrumbs);
  } catch (error) {
    console.error('שגיאה בטעינת פירורי לחם:', error);
    return NextResponse.json(
      { error: 'שגיאה בטעינת פירורי לחם' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const newBreadcrumb = await prisma.breadcrumb.create({
      data: {
        pageSlug: body.pageSlug,
        breadcrumbData: body.breadcrumbData,
        isActive: body.isActive !== undefined ? body.isActive : true
      }
    });

    return NextResponse.json(newBreadcrumb);
  } catch (error) {
    console.error('שגיאה ביצירת פירורי לחם:', error);
    return NextResponse.json(
      { error: 'שגיאה ביצירת פירורי לחם' },
      { status: 500 }
    );
  }
} 