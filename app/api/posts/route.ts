import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Received POST data:', body);
    
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
      slug
    } = body;

    // ולידציה בסיסית
    if (!title || !content) {
      return NextResponse.json(
        { error: 'כותרת ותוכן הם שדות חובה' },
        { status: 400 }
      );
    }

    // בדיקה אם ה-slug כבר קיים
    const existingPost = await prisma.post.findUnique({
      where: { slug: slug || title.toLowerCase().replace(/\s+/g, '-') }
    });

    if (existingPost) {
      return NextResponse.json(
        { error: 'כתובת URL כבר קיימת במערכת' },
        { status: 400 }
      );
    }

    // מציאת או יצירת קטגוריה
    let categoryRef;
    if (category) {
      categoryRef = await prisma.category.findUnique({
        where: { slug: category }
      });
    }
    
    if (!categoryRef) {
      categoryRef = await prisma.category.findFirst({
        where: { slug: 'seo' }
      });
    }

    // יצירת הפוסט
    const postData: any = {
      title,
      content,
      excerpt: excerpt || '',
      mainImage: mainImage || '',
      tags: Array.isArray(tags) ? tags : [],
      metaTitle: metaTitle || title,
      metaDesc: metaDesc || excerpt || '',
      published: published || false,
      slug: slug || title.toLowerCase().replace(/[^\u0590-\u05FFa-z0-9\s-]/g, '').replace(/\s+/g, '-'),
      authorName: 'מנהל האתר',
      authorEmail: 'admin@example.com',
      views: 0,
      likes: 0
    };

    // הוספת categoryId רק אם יש קטגוריה
    if (categoryRef?.id) {
      postData.categoryId = categoryRef.id;
    }

    const post = await prisma.post.create({
      data: postData
    });

    return NextResponse.json({
      success: true,
      message: published ? 'הפוסט פורסם בהצלחה!' : 'הפוסט נשמר כטיוטה!',
      post
    });

  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'שגיאה ביצירת הפוסט' },
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
    const category = searchParams.get('category');

    const skip = (page - 1) * limit;

    // בניית תנאי החיפוש
    const where: any = {};
    
    // ברירת מחדל: רק פוסטים מפורסמים
    if (published !== null) {
      where.published = published === 'true';
    } else {
      where.published = true;
    }
    
    if (category) {
      where.category = {
        slug: category
      };
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          mainImage: true,
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
              color: true
            }
          },
          published: true,
          createdAt: true,
          updatedAt: true,
          authorName: true,
          authorEmail: true,
          views: true,
          likes: true,
          metaTitle: true,
          metaDesc: true,
          tags: true
        }
      }),
      prisma.post.count({ where })
    ]);

    // עיבוד הפוסטים לפורמט הנכון
    const formattedPosts = posts.map(post => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      mainImage: post.mainImage,
      category: post.category?.name || 'כללי',
      categorySlug: post.category?.slug || 'general',
      categoryColor: post.category?.color || '#3B82F6',
      published: post.published,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      authorName: post.authorName,
      authorEmail: post.authorEmail,
      views: post.views,
      likes: post.likes,
      metaTitle: post.metaTitle,
      metaDesc: post.metaDesc,
      tags: Array.isArray(post.tags) ? post.tags : []
    }));

    return NextResponse.json({
      posts: formattedPosts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'שגיאה בטעינת הפוסטים' },
      { status: 500 }
    );
  }
}