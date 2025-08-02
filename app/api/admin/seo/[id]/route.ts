import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    const seoData = await prisma.sEO.update({
      where: {
        id: params.id
      },
      data: {
        title: body.title,
        description: body.description,
        keywords: body.keywords,
        ogTitle: body.ogTitle || body.title,
        ogDescription: body.ogDescription || body.description,
        ogImage: body.ogImage || '',
        canonicalUrl: body.canonicalUrl || '',
        robots: body.robots || 'index, follow'
      }
    });

    return NextResponse.json(seoData);
  } catch (error) {
    console.error('שגיאה בעדכון נתוני SEO:', error);
    return NextResponse.json(
      { error: 'שגיאה בעדכון נתוני SEO' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.sEO.delete({
      where: {
        id: params.id
      }
    });

    return NextResponse.json({ message: 'נתוני SEO נמחקו בהצלחה' });
  } catch (error) {
    console.error('שגיאה במחיקת נתוני SEO:', error);
    return NextResponse.json(
      { error: 'שגיאה במחיקת נתוני SEO' },
      { status: 500 }
    );
  }
} 