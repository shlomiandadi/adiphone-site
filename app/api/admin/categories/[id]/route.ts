import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, description, color } = body;

    // ולידציה
    if (!name) {
      return NextResponse.json(
        { error: 'שם הקטגוריה הוא שדה חובה' },
        { status: 400 }
      );
    }

    // בדיקה אם הקטגוריה קיימת
    const existingCategory = await prisma.category.findUnique({
      where: { id: params.id }
    });

    if (!existingCategory) {
      return NextResponse.json(
        { error: 'קטגוריה לא נמצאה' },
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
    if (newSlug !== existingCategory.slug) {
      const slugExists = await prisma.category.findUnique({
        where: { slug: newSlug }
      });

      if (slugExists) {
        return NextResponse.json(
          { error: 'קטגוריה עם שם זה כבר קיימת' },
          { status: 400 }
        );
      }
    }

    // עדכון הקטגוריה
    const updatedCategory = await prisma.category.update({
      where: { id: params.id },
      data: {
        name,
        slug: newSlug,
        description: description || '',
        color: color || '#3B82F6'
      }
    });

    return NextResponse.json({
      success: true,
      message: 'קטגוריה עודכנה בהצלחה!',
      category: updatedCategory
    });

  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json(
      { error: 'שגיאה בעדכון הקטגוריה' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // בדיקה אם הקטגוריה קיימת
    const existingCategory = await prisma.category.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            posts: true
          }
        }
      }
    });

    if (!existingCategory) {
      return NextResponse.json(
        { error: 'קטגוריה לא נמצאה' },
        { status: 404 }
      );
    }

    // בדיקה אם יש פוסטים בקטגוריה
    if (existingCategory._count.posts > 0) {
      return NextResponse.json(
        { error: 'לא ניתן למחוק קטגוריה שיש בה פוסטים' },
        { status: 400 }
      );
    }

    // מחיקת הקטגוריה
    await prisma.category.delete({
      where: { id: params.id }
    });

    return NextResponse.json({
      success: true,
      message: 'קטגוריה נמחקה בהצלחה'
    });

  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { error: 'שגיאה במחיקת הקטגוריה' },
      { status: 500 }
    );
  }
} 