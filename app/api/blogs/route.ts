import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
    
    // Get posts directly from the database using Prisma
    const posts = await prisma.post.findMany({
      where: {
        published: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit,
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
    const formattedPosts = posts.map(post => ({
      _id: post.id,
      title: post.title,
      description: post.excerpt,
      image: post.mainImage || '/images/blog-placeholder.jpg',
      category: post.category,
      date: new Date(post.createdAt).toLocaleDateString('he-IL', {
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
      createdAt: post.createdAt instanceof Date ? post.createdAt.toISOString() : new Date(post.createdAt).toISOString(),
      updatedAt: post.updatedAt instanceof Date ? post.updatedAt.toISOString() : new Date(post.updatedAt).toISOString()
    }));
      
    return new Response(JSON.stringify(formattedPosts), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, max-age=0'
      },
    });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal Server Error', 
      details: process.env.NODE_ENV === 'development' ? error.message : undefined 
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
} 