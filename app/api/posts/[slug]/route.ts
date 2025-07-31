import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const post = await prisma.post.findUnique({
      where: { slug: params.slug }
    });

    if (!post) {
      return NextResponse.json(
        { error: 'פוסט לא נמצא' },
        { status: 404 }
      );
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { error: 'שגיאה בטעינת הפוסט' },
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
      title,
      content,
      excerpt,
      mainImage,
      category,
      tags,
      metaTitle,
      metaDesc,
      published,
      slug: newSlug
    } = body;

    // ולידציה בסיסית
    if (!title || !content) {
      return NextResponse.json(
        { error: 'כותרת ותוכן הם שדות חובה' },
        { status: 400 }
      );
    }

    // בדיקה אם הפוסט קיים
    const existingPost = await prisma.post.findUnique({
      where: { slug: params.slug }
    });

    if (!existingPost) {
      return NextResponse.json(
        { error: 'פוסט לא נמצא' },
        { status: 404 }
      );
    }

    // בדיקה אם ה-slug החדש כבר קיים (אם השתנה)
    if (newSlug && newSlug !== params.slug) {
      const slugExists = await prisma.post.findUnique({
        where: { slug: newSlug }
      });

      if (slugExists) {
        return NextResponse.json(
          { error: 'כתובת URL כבר קיימת במערכת' },
          { status: 400 }
        );
      }
    }

    // עדכון הפוסט
    const updatedPost = await prisma.post.update({
      where: { slug: params.slug },
      data: {
        title,
        content,
        excerpt: excerpt || '',
        mainImage: mainImage || '',
        category: category || 'SEO',
        tags: Array.isArray(tags) ? tags : [],
        metaTitle: metaTitle || title,
        metaDesc: metaDesc || excerpt || '',
        published: published !== undefined ? published : existingPost.published,
        slug: newSlug || params.slug,
        updatedAt: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      message: published ? 'הפוסט פורסם בהצלחה!' : 'הפוסט נשמר כטיוטה!',
      post: updatedPost
    });

  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json(
      { error: 'שגיאה בעדכון הפוסט' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    // בדיקה אם הפוסט קיים
    const existingPost = await prisma.post.findUnique({
      where: { slug: params.slug }
    });

    if (!existingPost) {
      return NextResponse.json(
        { error: 'פוסט לא נמצא' },
        { status: 404 }
      );
    }

    // מחיקת הפוסט
    await prisma.post.delete({
      where: { slug: params.slug }
    });

    return NextResponse.json({
      success: true,
      message: 'הפוסט נמחק בהצלחה'
    });

  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { error: 'שגיאה במחיקת הפוסט' },
      { status: 500 }
    );
  }
} 