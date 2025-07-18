'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  mainImage: string;
  category: string;
  createdAt: string;
  tags: string[];
  slug: string;
  published: boolean;
  authorName: string;
  authorEmail: string;
  views: number;
  likes: number;
  metaTitle: string;
  metaDesc: string;
  updatedAt: string;
}

async function getBlogPost(slug: string) {
  try {
    const res = await fetch(`/api/posts/${slug}`, {
      next: { revalidate: 60 } // Revalidate every minute
    });
    
    if (!res.ok) {
      return null;
    }

    return res.json();
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  const [post, setPost] = React.useState<BlogPost | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchPost() {
      try {
        const postData = await getBlogPost(params.slug);
        if (!postData) {
          notFound();
        }
        setPost(postData);
      } catch (error) {
        console.error('Error fetching post:', error);
        notFound();
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [params.slug]);

  if (loading) {
    return (
      <main className="pt-24">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-[400px] bg-gray-200 rounded-lg mb-8"></div>
            <div className="max-w-3xl mx-auto">
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!post) {
    return notFound();
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('he-IL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <main className="pt-24">
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center text-white">
        <div className="absolute inset-0 z-0">
          <Image
            src={post.mainImage || '/images/blog/seo-guide.jpg'}
            alt={post.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-600/90" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <span className="inline-block bg-blue-500 text-white px-4 py-2 rounded-full text-sm mb-4">
              {post.category}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>
            <div className="flex items-center justify-center space-x-4">
              <span>{formatDate(post.createdAt)}</span>
              <span>•</span>
              <span>{Math.ceil(post.content.length / 1000)} דקות קריאה</span>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div 
              className="prose prose-lg dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </div>
      </section>
    </main>
  );
} 
