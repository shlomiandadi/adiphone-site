import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const admin = searchParams.get('admin');

    const where: any = { slug: params.slug };
    
    // אם זה לא מערכת הניהול, בדוק שרק פרויקטים מפורסמים
    if (admin !== 'true') {
      where.published = true;
    }

    const project = await prisma.portfolioProject2.findUnique({
      where
    });

    if (!project) {
      return NextResponse.json(
        { error: 'פרויקט לא נמצא' },
        { status: 404 }
      );
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error('Error fetching portfolio project:', error);
    return NextResponse.json(
      { error: 'שגיאה בטעינת הפרויקט' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const body = await request.json();
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
      slug: newSlug
    } = body;

    // ולידציה בסיסית
    if (!name || !description) {
      return NextResponse.json(
        { error: 'שם ותיאור הם שדות חובה' },
        { status: 400 }
      );
    }

    // בדיקה אם הפרויקט קיים
    const existingProject = await prisma.portfolioProject2.findUnique({
      where: { slug: params.slug }
    });

    if (!existingProject) {
      return NextResponse.json(
        { error: 'פרויקט לא נמצא' },
        { status: 404 }
      );
    }

    // בדיקה אם ה-slug החדש כבר קיים (אם השתנה)
    if (newSlug && newSlug !== params.slug) {
      const slugExists = await prisma.portfolioProject2.findUnique({
        where: { slug: newSlug }
      });

      if (slugExists) {
        return NextResponse.json(
          { error: 'כתובת URL כבר קיימת במערכת' },
          { status: 400 }
        );
      }
    }

    // וידוא שה-URL מכיל כתובת מלאה
    let finalUrl = url || '';
    if (finalUrl && !finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      finalUrl = 'https://' + finalUrl;
    }

    // עדכון הפרויקט
    const updatedProject = await prisma.portfolioProject2.update({
      where: { slug: params.slug },
      data: {
        name,
        description,
        descriptionRich: descriptionRich || '',
        url: finalUrl,
        date: date ? new Date(date) : existingProject.date,
        technologies: Array.isArray(technologies) ? technologies : [],
        image: image || '',
        images: Array.isArray(images) ? images : [],
        metaTitle: metaTitle || name,
        metaDesc: metaDesc || description,
        published: published !== undefined ? published : existingProject.published,
        slug: newSlug || params.slug,
        updatedAt: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      message: published ? 'הפרויקט פורסם בהצלחה!' : 'הפרויקט נשמר כטיוטה!',
      project: updatedProject
    });

  } catch (error) {
    console.error('Error updating portfolio project:', error);
    return NextResponse.json(
      { error: 'שגיאה בעדכון הפרויקט' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    // בדיקה אם הפרויקט קיים
    const existingProject = await prisma.portfolioProject2.findUnique({
      where: { slug: params.slug }
    });

    if (!existingProject) {
      return NextResponse.json(
        { error: 'פרויקט לא נמצא' },
        { status: 404 }
      );
    }

    // מחיקת הפרויקט
    await prisma.portfolioProject2.delete({
      where: { slug: params.slug }
    });

    return NextResponse.json({
      success: true,
      message: 'הפרויקט נמחק בהצלחה'
    });

  } catch (error) {
    console.error('Error deleting portfolio project:', error);
    return NextResponse.json(
      { error: 'שגיאה במחיקת הפרויקט' },
      { status: 500 }
    );
  }
} 