import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const seoData = await prisma.sEO.findMany({
      orderBy: {
        page: 'asc'
      }
    });

    return NextResponse.json(seoData);
  } catch (error) {
    console.error('שגיאה בטעינת נתוני SEO:', error);
    return NextResponse.json(
      { error: 'שגיאה בטעינת נתוני SEO' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const seoData = await prisma.sEO.create({
      data: {
        page: body.page,
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
    console.error('שגיאה ביצירת נתוני SEO:', error);
    return NextResponse.json(
      { error: 'שגיאה ביצירת נתוני SEO' },
      { status: 500 }
    );
  }
} 