import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import BlogPostSchema from '../../components/BlogPostSchema';

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
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/posts/${slug}`, {
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

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getBlogPost(params.slug);
  
  if (!post) {
    return {
      title: 'פוסט לא נמצא | Top WebStack',
      description: 'הפוסט שחיפשת לא נמצא',
    };
  }

  return {
    title: post.metaTitle || post.title,
    description: post.metaDesc || post.excerpt,
    keywords: post.tags?.join(', '),
    authors: [{ name: post.authorName }],
    openGraph: {
      title: post.metaTitle || post.title,
      description: post.metaDesc || post.excerpt,
      type: 'article',
      publishedTime: post.createdAt,
      modifiedTime: post.updatedAt,
      authors: [post.authorName],
      images: [
        {
          url: post.mainImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.metaTitle || post.title,
      description: post.metaDesc || post.excerpt,
      images: [post.mainImage],
    },
  };
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await getBlogPost(params.slug);

  if (!post) {
    notFound();
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
      <BlogPostSchema post={post} />
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
              className="prose prose-lg dark:prose-invert max-w-none prose-img:max-w-full prose-img:h-auto prose-img:rounded-lg prose-img:shadow-lg prose-img:my-6 prose-img:mx-auto"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </div>
      </section>
    </main>
  );
} 
