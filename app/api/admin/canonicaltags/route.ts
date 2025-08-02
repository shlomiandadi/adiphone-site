import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const canonicalTags = await prisma.canonicalTag.findMany({
      orderBy: {
        pageSlug: 'asc'
      }
    });

    return NextResponse.json(canonicalTags);
  } catch (error) {
    console.error('שגיאה בטעינת תגיות קנוניקל:', error);
    return NextResponse.json(
      { error: 'שגיאה בטעינת תגיות קנוניקל' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const newCanonicalTag = await prisma.canonicalTag.create({
      data: {
        pageSlug: body.pageSlug,
        canonicalUrl: body.canonicalUrl,
        isActive: body.isActive !== undefined ? body.isActive : true
      }
    });

    return NextResponse.json(newCanonicalTag);
  } catch (error) {
    console.error('שגיאה ביצירת תגית קנוניקל:', error);
    return NextResponse.json(
      { error: 'שגיאה ביצירת תגית קנוניקל' },
      { status: 500 }
    );
  }
} 