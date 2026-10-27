import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { revalidateBlogPaths } from '../../../../lib/revalidateContent';
import {
  POST_ROLES,
  canManagePost,
  requireAdminApiAuth,
  requireAdminApiUser,
} from '../../../../lib/adminAuth';
import { normalizeTagNames, syncPostTags, tagPathValues } from '../../../../lib/postTags';
import { PRIVATE_NO_STORE, PUBLIC_CACHE_CONTROL } from '../../../../lib/contentCache';
import { getPostBySlug } from '../../../../lib/posts';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

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

function extraFromPost(post: {
  category?: { slug: string } | null;
  tags?: string[];
  postTags?: { tag: { name: string; slug: string } }[];
}) {
  return {
    categorySlugs: [post.category?.slug],
    tags: tagPathValues(
      [...(post.tags || []), ...(post.postTags || []).map((item) => item.tag.name)],
      (post.postTags || []).map((item) => item.tag.slug)
    ),
  };
}

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const admin = searchParams.get('admin');

    if (admin === 'true') {
      const unauthorized = await requireAdminApiAuth({ role: [...POST_ROLES] });
      if (unauthorized) return unauthorized;
    }

    if (admin !== 'true') {
      const post = await getPostBySlug(params.slug);
      if (!post || !post.published) {
        return NextResponse.json(
          { error: 'פוסט לא נמצא' },
          { status: 404 }
        );
      }
      return NextResponse.json(post, {
        headers: { 'Cache-Control': PUBLIC_CACHE_CONTROL },
      });
    }

    const post = await prisma.post.findUnique({
      where: { slug: params.slug },
      include: {
        category: true,
        postTags: { include: { tag: true } },
      },
    });

    if (!post) {
      return NextResponse.json(
        { error: 'פוסט לא נמצא' },
        { status: 404 }
      );
    }

    return NextResponse.json(post, {
      headers: { 'Cache-Control': PRIVATE_NO_STORE },
    });
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
      slug: newSlug,
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

    const existingPost = await prisma.post.findUnique({
      where: { slug: params.slug },
      include: {
        category: true,
        postTags: { include: { tag: true } },
      },
    });

    if (!existingPost) {
      return NextResponse.json(
        { error: 'פוסט לא נמצא' },
        { status: 404 }
      );
    }

    if (!canManagePost(auth.user, existingPost.authorId)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

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

    const updatedPost = await prisma.post.update({
      where: { slug: params.slug },
      data: {
        title,
        content,
        excerpt: excerpt || '',
        mainImage: mainImage || '',
        categoryId: categoryRef.id,
        tags: tagNames,
        metaTitle: metaTitle || title,
        metaDesc: metaDesc || excerpt || '',
        published: published !== undefined ? published : existingPost.published,
        slug: newSlug || params.slug,
        canonicalUrl: canonicalUrl || null,
        schemaMarkup: parsedSchema,
        ogImage: ogImage || null,
        robots: robots || null,
        updatedAt: new Date()
      },
      include: {
        category: true,
        postTags: { include: { tag: true } },
      },
    });

    await syncPostTags(prisma, updatedPost.id, tagNames);

    const previous = extraFromPost(existingPost);
    revalidateBlogPaths(updatedPost.slug, params.slug, {
      categorySlugs: [...previous.categorySlugs, categoryRef.slug],
      tags: [...previous.tags, ...tagPathValues(tagNames)],
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
  const auth = await requireAdminApiUser({ role: [...POST_ROLES] });
  if (!auth.ok) return auth.response;

  try {
    const existingPost = await prisma.post.findUnique({
      where: { slug: params.slug },
      include: {
        category: true,
        postTags: { include: { tag: true } },
      },
    });

    if (!existingPost) {
      return NextResponse.json(
        { error: 'פוסט לא נמצא' },
        { status: 404 }
      );
    }

    if (!canManagePost(auth.user, existingPost.authorId)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.post.delete({
      where: { slug: params.slug }
    });

    revalidateBlogPaths(params.slug, null, extraFromPost(existingPost));

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
