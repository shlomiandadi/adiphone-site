import { NextResponse } from 'next/server';
import { Category, Post } from '@prisma/client';
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

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    await prisma.$connect();
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

    const formattedPosts = posts.map((post) => {
      const createdDate = new Date(post.createdAt);
      const updatedDate = new Date(post.updatedAt);

      return {
        id: post.id,
        title: post.title,
        content: post.content,
        excerpt: post.excerpt,
        mainImage: post.mainImage || '/images/blog/nextjs-guide.jpg',
        category: post.category,
        createdAt: createdDate.toISOString(),
        tags: post.tags || [],
        slug: post.slug,
        published: post.published,
        authorName: post.authorName || 'Admin',
        authorEmail: post.authorEmail,
        views: post.views,
        likes: post.likes,
        metaTitle: post.metaTitle,
        metaDesc: post.metaDesc,
        updatedAt: updatedDate.toISOString()
      };
    });

    return new NextResponse(JSON.stringify({ posts: formattedPosts }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'X-Requested-With, Content-Type, Authorization'
      }
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return new NextResponse(JSON.stringify({ 
      error: 'Failed to fetch posts',
      details: error instanceof Error ? error.message : 'Internal server error',
      stack: error instanceof Error && process.env.NODE_ENV === 'development' ? error.stack : undefined
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'X-Requested-With, Content-Type, Authorization'
      }
    });
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: Request) {
  try {
    await prisma.$connect();
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
        return new NextResponse(JSON.stringify({ 
          error: `Missing required field: ${field}` 
        }), {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'X-Requested-With, Content-Type, Authorization'
          }
        });
      }
    }

    if (!Object.values(Category).includes(data.category)) {
      return new NextResponse(JSON.stringify({ 
        error: 'Invalid category' 
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'X-Requested-With, Content-Type, Authorization'
        }
      });
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

    return new NextResponse(JSON.stringify({ 
      success: true, 
      data: post,
      message: 'Post created successfully'
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'X-Requested-With, Content-Type, Authorization'
      }
    });
  } catch (error) {
    console.error('Error creating post:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('Unique constraint')) {
        return new NextResponse(JSON.stringify({ 
          error: 'A post with this title already exists' 
        }), {
          status: 409,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'X-Requested-With, Content-Type, Authorization'
          }
        });
      }
    }

    return new NextResponse(JSON.stringify({ 
      error: 'Failed to create post',
      details: error instanceof Error ? error.message : 'Internal server error'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'X-Requested-With, Content-Type, Authorization'
      }
    });
  } finally {
    await prisma.$disconnect();
  }
}

export async function OPTIONS(request: Request) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, Content-Type, Authorization'
    }
  });
}