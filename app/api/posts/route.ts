import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { revalidateBlogPaths } from '../../../lib/revalidateContent';
import {
  POST_ROLES,
  isAuthorRole,
  requireAdminApiUser,
} from '../../../lib/adminAuth';
import { normalizeTagNames, syncPostTags, tagPathValues } from '../../../lib/postTags';
import {
  BLOG_CACHE_TAG,
  POST_LIST_SELECT,
  PRIVATE_NO_STORE,
  PUBLIC_CACHE_CONTROL,
  contentCache,
} from '../../../lib/contentCache';

const prisma = new PrismaClient();

const getPublicPostsList = contentCache(
  'api-posts-public',
  [BLOG_CACHE_TAG],
  async (page: number, limit: number, category: string, fields: string) => {
    const skip = (page - 1) * limit;
    if (fields === 'nav') {
      const where = { published: true as const };
      const [posts, total] = await Promise.all([
        prisma.post.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit,
          select: {
            title: true,
            slug: true,
            category: { select: { name: true } },
          },
        }),
        prisma.post.count({ where }),
      ]);
      return {
        posts: posts.map((post) => ({
          title: post.title,
          slug: post.slug,
          category: post.category?.name || 'כללי',
        })),
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit) || 1,
        },
      };
    }

    const where: { published: true; category?: { slug: string } } = { published: true };
    if (category) where.category = { slug: category };

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        select: POST_LIST_SELECT,
      }),
      prisma.post.count({ where }),
    ]);

    return {
      posts: posts.map((post) => ({
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
        ogImage: post.ogImage,
        robots: post.robots,
        postTags: post.postTags,
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }
);

function publicJson(data: unknown) {
  return NextResponse.json(data, {
    headers: { 'Cache-Control': PUBLIC_CACHE_CONTROL },
  });
}

function privateJson(data: unknown, init?: { status?: number }) {
  return NextResponse.json(data, {
    ...init,
    headers: { 'Cache-Control': PRIVATE_NO_STORE },
  });
}

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

    if (admin !== 'true' && published !== 'false') {
      const payload = await getPublicPostsList(
        page,
        limit,
        category || '',
        searchParams.get('fields') === 'nav' ? 'nav' : ''
      );
      return publicJson(payload);
    }

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
        select: POST_LIST_SELECT
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
      ogImage: post.ogImage,
      robots: post.robots,
      postTags: post.postTags,
    }));

    return privateJson({
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
