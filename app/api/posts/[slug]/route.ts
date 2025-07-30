import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

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
      id: post.id,
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

export async function PATCH(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const data = await request.json();
    
    const updateData: any = {};
    
    if (data.published !== undefined) {
      updateData.published = data.published;
    }
    
    if (data.slug) {
      updateData.slug = data.slug;
    }
    
    if (data.content) {
      updateData.content = data.content;
    }
    
    if (data.title) {
      updateData.title = data.title;
    }
    
    if (data.excerpt) {
      updateData.excerpt = data.excerpt;
    }
    
    if (data.mainImage) {
      updateData.mainImage = data.mainImage;
    }
    
    if (data.category) {
      updateData.category = data.category;
    }
    
    if (data.tags) {
      updateData.tags = data.tags;
    }
    
    if (data.metaTitle) {
      updateData.metaTitle = data.metaTitle;
    }
    
    if (data.metaDesc) {
      updateData.metaDesc = data.metaDesc;
    }
    
    const post = await prisma.post.update({
      where: {
        slug: params.slug
      },
      data: updateData
    });

    return NextResponse.json({ 
      success: true, 
      message: `Post updated successfully`,
      data: post
    });
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    );
  }
} 