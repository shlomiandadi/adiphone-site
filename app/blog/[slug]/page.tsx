'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { IBlog } from '../../../models/Blog';

interface BlogPost extends IBlog {
  _id: string;
}

async function getBlogPost(slug: string) {
  try {
    const res = await fetch(`/api/blogs/${slug}`, {
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

async function getRelatedPosts(relatedIds: string[]) {
  if (!relatedIds || relatedIds.length === 0) return [];
  
  try {
    const posts = await Promise.all(
      relatedIds.map(async (slug) => {
        const res = await fetch(`/api/blogs/${slug}`, {
          next: { revalidate: 60 }
        });
        if (!res.ok) return null;
        return res.json();
      })
    );

    return posts.filter(Boolean);
  } catch (error) {
    console.error('Error fetching related posts:', error);
    return [];
  }
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  const [post, setPost] = React.useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = React.useState<BlogPost[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchPost() {
      try {
        const postData = await getBlogPost(params.slug);
        if (!postData) {
          notFound();
        }
        setPost(postData);
        
        const relatedPostsData = await getRelatedPosts(postData.relatedPosts || []);
        setRelatedPosts(relatedPostsData);
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

  return (
    <main className="pt-24">
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center text-white">
        {post.image && (
          <div className="absolute inset-0 z-0">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-600/90" />
          </div>
        )}
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <span className="inline-block bg-blue-500 text-white px-4 py-2 rounded-full text-sm mb-4">
              {post.category}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>
            <div className="flex items-center justify-center space-x-4">
              <span>{post.date}</span>
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
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <ReactMarkdown>{post.content}</ReactMarkdown>
            </div>
          </div>
        </div>
      </section>

      {/* Related Posts Section */}
      {relatedPosts.length > 0 && (
        <section className="py-16 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">פוסטים קשורים</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => (
                <Link 
                  key={relatedPost._id} 
                  href={`/blog/${relatedPost.slug}`}
                  className="group"
                >
                  <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform group-hover:scale-[1.02]">
                    <div className="relative h-48">
                      <Image
                        src={relatedPost.image}
                        alt={relatedPost.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                    <div className="p-6">
                      <span className="text-sm text-blue-500">{relatedPost.category}</span>
                      <h3 className="text-xl font-bold mt-2 mb-3">{relatedPost.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300 line-clamp-2">{relatedPost.description}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
} 