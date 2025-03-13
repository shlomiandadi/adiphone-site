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
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ success: true, data: posts });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch posts' },
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