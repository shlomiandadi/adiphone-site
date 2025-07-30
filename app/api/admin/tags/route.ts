import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function GET() {
  try {
    const tags = await prisma.tag.findMany({
      include: {
        _count: {
          select: {
            posts: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    const formattedTags = tags.map(tag => ({
      id: tag.id,
      name: tag.name,
      slug: tag.slug,
      postCount: tag._count.posts,
      createdAt: tag.createdAt
    }));

    return NextResponse.json({
      tags: formattedTags
    });

  } catch (error) {
    console.error('Error fetching tags:', error);
    return NextResponse.json(
      { error: 'שגיאה בטעינת התגיות' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name } = body;

    // ולידציה
    if (!name) {
      return NextResponse.json(
        { error: 'שם התגית הוא שדה חובה' },
        { status: 400 }
      );
    }

    // יצירת slug
    const slug = name
      .toLowerCase()
      .replace(/[^\u0590-\u05FFa-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    // בדיקה אם התגית כבר קיימת
    const existingTag = await prisma.tag.findUnique({
      where: { slug }
    });

    if (existingTag) {
      return NextResponse.json(
        { error: 'תגית עם שם זה כבר קיימת' },
        { status: 400 }
      );
    }

    // יצירת התגית
    const tag = await prisma.tag.create({
      data: {
        name,
        slug
      }
    });

    return NextResponse.json({
      success: true,
      message: 'תגית נוצרה בהצלחה!',
      tag
    });

  } catch (error) {
    console.error('Error creating tag:', error);
    return NextResponse.json(
      { error: 'שגיאה ביצירת התגית' },
      { status: 500 }
    );
  }
} 