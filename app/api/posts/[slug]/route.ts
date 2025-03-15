import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const post = await prisma.post.findUnique({
      where: {
        slug: params.slug,
        published: true
      },
      select: {
        id: true,
        title: true,
        content: true,
        excerpt: true,
        mainImage: true,
        category: true,
        createdAt: true,
        tags: true,
        slug: true,
        published: true,
        authorName: true,
        authorEmail: true,
        views: true,
        likes: true,
        metaTitle: true,
        metaDesc: true,
        updatedAt: true
      }
    });

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    const createdDate = new Date(post.createdAt);
    const updatedDate = new Date(post.updatedAt);

    const formattedPost = {
      _id: post.id,
      title: post.title,
      content: post.content,
      description: post.excerpt,
      image: post.mainImage || '/images/blog-placeholder.jpg',
      category: post.category,
      date: createdDate.toLocaleDateString('he-IL', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      keywords: post.tags,
      relatedPosts: [],
      slug: post.slug,
      published: post.published,
      authorName: post.authorName || 'Admin',
      authorEmail: post.authorEmail,
      views: post.views,
      likes: post.likes,
      metaTitle: post.metaTitle,
      metaDesc: post.metaDesc,
      createdAt: createdDate.toISOString(),
      updatedAt: updatedDate.toISOString()
    };

    return NextResponse.json(formattedPost);
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    );
  }
} 