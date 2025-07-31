import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // בדיקה אם התגית קיימת
    const existingTag = await prisma.tag.findUnique({
      where: { id: params.id }
    });

    if (!existingTag) {
      return NextResponse.json(
        { error: 'תגית לא נמצאה' },
        { status: 404 }
      );
    }

    // יצירת slug חדש
    const newSlug = name
      .toLowerCase()
      .replace(/[^\u0590-\u05FFa-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    // בדיקה אם ה-slug החדש כבר קיים (אם השתנה)
    if (newSlug !== existingTag.slug) {
      const slugExists = await prisma.tag.findUnique({
        where: { slug: newSlug }
      });

      if (slugExists) {
        return NextResponse.json(
          { error: 'תגית עם שם זה כבר קיימת' },
          { status: 400 }
        );
      }
    }

    // עדכון התגית
    const updatedTag = await prisma.tag.update({
      where: { id: params.id },
      data: {
        name,
        slug: newSlug
      }
    });

    return NextResponse.json({
      success: true,
      message: 'תגית עודכנה בהצלחה!',
      tag: updatedTag
    });

  } catch (error) {
    console.error('Error updating tag:', error);
    return NextResponse.json(
      { error: 'שגיאה בעדכון התגית' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // בדיקה אם התגית קיימת
    const existingTag = await prisma.tag.findUnique({
      where: { id: params.id }
    });

    if (!existingTag) {
      return NextResponse.json(
        { error: 'תגית לא נמצאה' },
        { status: 404 }
      );
    }

    // מחיקת התגית (Prisma יטפל במחיקת הקשרים אוטומטית)
    await prisma.tag.delete({
      where: { id: params.id }
    });

    return NextResponse.json({
      success: true,
      message: 'תגית נמחקה בהצלחה'
    });

  } catch (error) {
    console.error('Error deleting tag:', error);
    return NextResponse.json(
      { error: 'שגיאה במחיקת התגית' },
      { status: 500 }
    );
  }
} 