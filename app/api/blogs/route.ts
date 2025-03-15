import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  console.log('Fetching blogs...');
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
    console.log('Limit:', limit);
    
    // Test database connection
    try {
      await prisma.$connect();
      console.log('Database connection successful');
    } catch (dbError) {
      console.error('Database connection failed:', dbError);
      throw new Error('Database connection failed');
    }
    
    // Get posts directly from the database using Prisma
    console.log('Querying posts...');
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

    console.log('Found posts:', posts.length);

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
      
    return new Response(JSON.stringify(formattedPosts), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, max-age=0'
      },
    });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    console.error('Error stack:', error.stack);
    return new Response(JSON.stringify({ 
      error: 'Internal Server Error', 
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } finally {
    await prisma.$disconnect();
  }
} 