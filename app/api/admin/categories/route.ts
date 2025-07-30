import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
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

    const formattedCategories = categories.map(category => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      color: category.color,
      postCount: category._count.posts,
      createdAt: category.createdAt
    }));

    return NextResponse.json({
      categories: formattedCategories
    });

  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'שגיאה בטעינת הקטגוריות' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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

    // יצירת slug
    const slug = name
      .toLowerCase()
      .replace(/[^\u0590-\u05FFa-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    // בדיקה אם הקטגוריה כבר קיימת
    const existingCategory = await prisma.category.findUnique({
      where: { slug }
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: 'קטגוריה עם שם זה כבר קיימת' },
        { status: 400 }
      );
    }

    // יצירת הקטגוריה
    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description: description || '',
        color: color || '#3B82F6'
      }
    });

    return NextResponse.json({
      success: true,
      message: 'קטגוריה נוצרה בהצלחה!',
      category
    });

  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'שגיאה ביצירת הקטגוריה' },
      { status: 500 }
    );
  }
} 