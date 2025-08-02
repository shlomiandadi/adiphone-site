import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Received portfolio POST data:', body);
    
    const {
      name,
      description,
      descriptionRich,
      url,
      date,
      technologies,
      image,
      images,
      metaTitle,
      metaDesc,
      published,
      slug
    } = body;

    // ולידציה בסיסית
    if (!name || !description) {
      return NextResponse.json(
        { error: 'שם ותיאור הם שדות חובה' },
        { status: 400 }
      );
    }

    // בדיקה אם ה-slug כבר קיים
    const existingProject = await prisma.portfolioProject2.findUnique({
      where: { slug: slug || name.toLowerCase().replace(/\s+/g, '-') }
    });

    if (existingProject) {
      return NextResponse.json(
        { error: 'כתובת URL כבר קיימת במערכת' },
        { status: 400 }
      );
    }

    // וידוא שה-URL מכיל כתובת מלאה
    let finalUrl = url || '';
    if (finalUrl && !finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      finalUrl = 'https://' + finalUrl;
    }

    // יצירת הפרויקט
    const projectData: any = {
      name,
      description,
      descriptionRich: descriptionRich || '',
      url: finalUrl,
      date: date ? new Date(date) : new Date(),
      technologies: Array.isArray(technologies) ? technologies : [],
      image: image || '',
      images: Array.isArray(images) ? images : [],
      metaTitle: metaTitle || name,
      metaDesc: metaDesc || description,
      published: published || false,
      slug: slug || name.toLowerCase().replace(/[^\u0590-\u05FFa-z0-9\s-]/g, '').replace(/\s+/g, '-')
    };

    const project = await prisma.portfolioProject2.create({
      data: projectData
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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const published = searchParams.get('published');
    const admin = searchParams.get('admin'); // פרמטר מיוחד למערכת הניהול

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
        orderBy: { date: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          descriptionRich: true,
          url: true,
          date: true,
          technologies: true,
          image: true,
          images: true,
          published: true,
          createdAt: true,
          updatedAt: true,
          metaTitle: true,
          metaDesc: true
        }
      }),
      prisma.portfolioProject2.count({ where })
    ]);

    // עיבוד הפרויקטים לפורמט הנכון
    const formattedProjects = projects.map(project => ({
      id: project.id,
      name: project.name,
      slug: project.slug,
      description: project.description,
      descriptionRich: project.descriptionRich,
      url: project.url,
      date: project.date,
      technologies: Array.isArray(project.technologies) ? project.technologies : [],
      image: project.image,
      images: Array.isArray(project.images) ? project.images : [],
      published: project.published,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      metaTitle: project.metaTitle,
      metaDesc: project.metaDesc
    }));

    return NextResponse.json({
      projects: formattedProjects,
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