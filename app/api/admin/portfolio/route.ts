import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const published = searchParams.get('published');
    const admin = searchParams.get('admin');

    const skip = (page - 1) * limit;

    // בניית תנאי החיפוש
    const where: any = {};
    
    // אם זה מערכת הניהול, הראה את כל הפרויקטים
    if (admin === 'true') {
      if (published !== null) {
        where.published = published === 'true';
      }
      // אם לא צוין published, הראה את כל הפרויקטים
    } else {
      // ברירת מחדל: רק פרויקטים מפורסמים
      if (published !== null) {
        where.published = published === 'true';
      } else {
        where.published = true;
      }
    }

    const [projects, total] = await Promise.all([
      prisma.portfolioProject2.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.portfolioProject2.count({ where })
    ]);

    return NextResponse.json({
      projects,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching portfolio projects:', error);
    return NextResponse.json(
      { error: 'שגיאה בטעינת הפרויקטים' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      description,
      descriptionRich,
      image,
      images,
      url,
      date,
      technologies,
      metaTitle,
      metaDesc,
      published
    } = body;

    // ולידציה בסיסית
    if (!name || !description) {
      return NextResponse.json(
        { error: 'שם ותיאור הם שדות חובה' },
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

    // בדיקה אם הפרויקט כבר קיים
    const existingProject = await prisma.portfolioProject2.findUnique({
      where: { slug }
    });

    if (existingProject) {
      return NextResponse.json(
        { error: 'פרויקט עם שם זה כבר קיים' },
        { status: 400 }
      );
    }

    // יצירת הפרויקט
    const project = await prisma.portfolioProject2.create({
      data: {
        name,
        slug,
        description,
        descriptionRich: descriptionRich || '',
        image: image || '',
        images: Array.isArray(images) ? images : [],
        url: url || '',
        date: date ? new Date(date) : new Date(),
        technologies: Array.isArray(technologies) ? technologies : [],
        metaTitle: metaTitle || name,
        metaDesc: metaDesc || description,
        published: published || false
      }
    });

    return NextResponse.json({
      success: true,
      message: published ? 'הפרויקט פורסם בהצלחה!' : 'הפרויקט נשמר כטיוטה!',
      project
    });

  } catch (error) {
    console.error('Error creating portfolio project:', error);
    return NextResponse.json(
      { error: 'שגיאה ביצירת הפרויקט' },
      { status: 500 }
    );
  }
} 