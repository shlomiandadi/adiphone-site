import { NextResponse } from 'next/server';
import { Category } from '@prisma/client';
import prisma from '@/lib/prisma';

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

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  let client;
  try {
    client = await prisma.$connect();
    console.log('Database connection successful');

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

    if (!posts || posts.length === 0) {
      return NextResponse.json([]);
    }

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
        keywords: post.tags || [],
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
    return NextResponse.json({ 
      error: 'Failed to fetch posts',
      details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, {
      status: 500
    });
  } finally {
    if (client) {
      await prisma.$disconnect();
    }
  }
}

export async function POST(request: Request) {
  let client;
  try {
    client = await prisma.$connect();
    console.log('Database connection successful');

    const data = await request.json();
    
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
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    if (!Object.values(Category).includes(data.category)) {
      return NextResponse.json(
        { error: 'Invalid category' },
        { status: 400 }
      );
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

    return NextResponse.json({ 
      success: true, 
      data: post,
      message: 'Post created successfully'
    });
  } catch (error) {
    console.error('Error creating post:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('Unique constraint')) {
        return NextResponse.json(
          { error: 'A post with this title already exists' },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      { 
        error: 'Failed to create post',
        details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      },
      { status: 500 }
    );
  } finally {
    if (client) {
      await prisma.$disconnect();
    }
  }
}

export async function OPTIONS(request: Request) {
  return NextResponse.json({}, { status: 200 });
}