import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { revalidateBlogPaths } from '../../../lib/revalidateContent';
import {
  POST_ROLES,
  isAuthorRole,
  requireAdminApiUser,
} from '../../../lib/adminAuth';
import { normalizeTagNames, syncPostTags, tagPathValues } from '../../../lib/postTags';

const prisma = new PrismaClient();

function parseSchemaMarkup(value: unknown): string | null | NextResponse {
  if (value == null || value === '') return null;
  const text = String(value).trim();
  if (!text) return null;
  try {
    JSON.parse(text);
    return text;
  } catch {
    return NextResponse.json({ error: 'schemaMarkup חייב להיות JSON תקין' }, { status: 400 });
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAdminApiUser({ role: [...POST_ROLES] });
  if (!auth.ok) return auth.response;

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
      slug,
      canonicalUrl,
      schemaMarkup,
      ogImage,
      robots,
    } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: 'כותרת ותוכן הם שדות חובה' },
        { status: 400 }
      );
    }

    if (!category || !String(category).trim()) {
      return NextResponse.json(
        { error: 'יש לבחור קטגוריה' },
        { status: 400 }
      );
    }

    const parsedSchema = parseSchemaMarkup(schemaMarkup);
    if (parsedSchema instanceof NextResponse) return parsedSchema;

    const postSlug = slug || title.toLowerCase().replace(/[^\u0590-\u05FFa-z0-9\s-]/g, '').replace(/\s+/g, '-');
    const existingPost = await prisma.post.findUnique({
      where: { slug: postSlug }
    });

    if (existingPost) {
      return NextResponse.json(
        { error: 'כתובת URL כבר קיימת במערכת' },
        { status: 400 }
      );
    }

    const categoryRef = await prisma.category.findFirst({
      where: {
        OR: [{ slug: String(category) }, { id: String(category) }],
      },
    });

    if (!categoryRef) {
      return NextResponse.json(
        { error: 'קטגוריה לא נמצאה' },
        { status: 400 }
      );
    }

    const tagNames = normalizeTagNames(tags);

    const post = await prisma.post.create({
      data: {
        title,
        content,
        excerpt: excerpt || '',
        mainImage: mainImage || '',
        tags: tagNames,
        metaTitle: metaTitle || title,
        metaDesc: metaDesc || excerpt || '',
        published: published || false,
        slug: postSlug,
        authorId: auth.user.id,
        authorName: auth.user.username,
        authorEmail: auth.user.email,
        categoryId: categoryRef.id,
        canonicalUrl: canonicalUrl || null,
        schemaMarkup: parsedSchema,
        ogImage: ogImage || null,
        robots: robots || null,
      },
      include: {
        category: true,
        postTags: { include: { tag: true } },
      },
    });

    await syncPostTags(prisma, post.id, tagNames);

    revalidateBlogPaths(post.slug, null, {
      categorySlugs: [categoryRef.slug],
      tags: tagPathValues(tagNames, []),
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
    const admin = searchParams.get('admin');

    let authorIdFilter: string | null = null;
    if (admin === 'true' || published === 'false') {
      const auth = await requireAdminApiUser({ role: [...POST_ROLES] });
      if (!auth.ok) return auth.response;
      if (isAuthorRole(auth.user)) {
        authorIdFilter = auth.user.id;
      }
    }

    const skip = (page - 1) * limit;
    const where: any = {};

    if (admin === 'true') {
      if (published !== null) {
        where.published = published === 'true';
      }
    } else {
      where.published = true;
    }

    if (authorIdFilter) {
      where.authorId = authorIdFilter;
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
              color: true,
              description: true,
            }
          },
          published: true,
          createdAt: true,
          updatedAt: true,
          authorName: true,
          authorEmail: true,
          authorId: true,
          views: true,
          likes: true,
          metaTitle: true,
          metaDesc: true,
          tags: true,
          canonicalUrl: true,
          schemaMarkup: true,
          ogImage: true,
          robots: true,
          postTags: {
            include: { tag: true },
          },
        }
      }),
      prisma.post.count({ where })
    ]);

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
      authorId: post.authorId,
      views: post.views,
      likes: post.likes,
      metaTitle: post.metaTitle,
      metaDesc: post.metaDesc,
      tags: Array.isArray(post.tags) ? post.tags : [],
      canonicalUrl: post.canonicalUrl,
      schemaMarkup: post.schemaMarkup,
      ogImage: post.ogImage,
      robots: post.robots,
      postTags: post.postTags,
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
