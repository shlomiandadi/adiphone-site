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
      take: limit
    });

    // Format the posts to match the expected structure
    const formattedPosts = posts.map(post => ({
      _id: post.id,
      title: post.title,
      description: post.content,
      image: post.image || '/images/blog-placeholder.jpg',
      category: post.category || 'כללי',
      date: new Date(post.createdAt).toLocaleDateString('he-IL'),
      keywords: post.keywords || [],
      relatedPosts: post.relatedPosts || [],
      slug: post.slug,
      status: post.published ? 'published' : 'draft',
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString()
    }));
      
    return new Response(JSON.stringify(formattedPosts), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error', details: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
} 