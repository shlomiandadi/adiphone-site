'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

interface Post {
  title: string;
  content: string;
  excerpt: string;
  mainImage: string;
  category: string;
  tags: string[];
  slug: string;
  published: boolean;
  authorName: string;
  authorEmail: string;
  metaTitle: string;
  metaDesc: string;
}

export default function EditPost({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState('');
  const { register, handleSubmit, setValue, watch } = useForm<Post>();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/${params.slug}`, {
          cache: 'no-store',
        });
        
        if (!res.ok) {
          throw new Error('Failed to fetch post');
        }

        const post = await res.json();
        Object.keys(post).forEach((key) => {
          setValue(key as keyof Post, post[key]);
        });
        setContent(post.content);
      } catch (error) {
        console.error('Error:', error);
        toast.error('Failed to fetch post');
      }
    };

    fetchPost();
  }, [params.slug, router, setValue]);

  const onSubmit = async (data: Post) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/${params.slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          content,
          tags: data.tags.toString().split(',').map(tag => tag.trim()),
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to update post');
      }

      toast.success('Post updated successfully');
      router.push('/admin/posts');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to update post');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Post</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block mb-2">Title</label>
          <input
            {...register('title')}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-2">Content</label>
          <ReactQuill
            value={content}
            onChange={setContent}
            className="h-64 mb-12"
          />
        </div>

        <div>
          <label className="block mb-2">Excerpt</label>
          <textarea
            {...register('excerpt')}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-2">Main Image URL</label>
          <input
            {...register('mainImage')}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-2">Category</label>
          <input
            {...register('category')}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-2">Tags (comma-separated)</label>
          <input
            {...register('tags')}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-2">Slug</label>
          <input
            {...register('slug')}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-2">Author Name</label>
          <input
            {...register('authorName')}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-2">Author Email</label>
          <input
            {...register('authorEmail')}
            type="email"
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-2">Meta Title</label>
          <input
            {...register('metaTitle')}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-2">Meta Description</label>
          <textarea
            {...register('metaDesc')}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              {...register('published')}
              className="mr-2"
            />
            Published
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {isLoading ? 'Updating...' : 'Update Post'}
        </button>
      </form>
    </div>
  );
} 