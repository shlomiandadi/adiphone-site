import { NextResponse } from 'next/server';
import { Category } from '@prisma/client';
import prisma from '../../../lib/prisma';

interface CreatePostInput {
  title: string;
  content: string;
  excerpt: string;
  mainImage: string;
  images: string[];
  category: Category;
  tags: string[];
  authorName: string;
  authorEmail: string;
  metaTitle: string;
  metaDesc: string;
}

export async function GET(request: Request) {
  try {
    const posts = await prisma.post.findMany({
      where: {
        published: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        title: true,
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

    // Format the posts to match the expected structure
    const formattedPosts = posts.map(post => {
      const createdDate = new Date(post.createdAt);
      const updatedDate = new Date(post.updatedAt);

      return {
        _id: post.id,
        title: post.title,
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
    });

    return NextResponse.json(formattedPosts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  if (request.method !== 'POST') {
    return NextResponse.json(
      { success: false, error: 'Method not allowed' },
      { status: 405 }
    );
  }

  try {
    const data = await request.json();
    
    // Validate required fields
    const requiredFields: (keyof CreatePostInput)[] = [
      'title',
      'content',
      'excerpt',
      'mainImage',
      'category',
      'tags',
      'authorName',
      'authorEmail',
      'metaTitle',
      'metaDesc'
    ];

    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    const postInput: CreatePostInput = {
      ...data,
      images: Array.isArray(data.images) ? data.images : [],
      tags: Array.isArray(data.tags) ? data.tags : [],
    };

    const slug = postInput.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');

    const post = await prisma.post.create({
      data: {
        ...postInput,
        slug,
        published: false,
        views: 0,
        likes: 0,
      },
    });

    return NextResponse.json({ success: true, data: post });
  } catch (error) {
    console.error('Error creating post:', error);
    
    if (error instanceof Error) {
      // Check for unique constraint violation
      if (error.message.includes('Unique constraint')) {
        return NextResponse.json(
          { success: false, error: 'A post with this title already exists' },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      { success: false, error: 'Failed to create post' },
      { status: 500 }
    );
  }
}