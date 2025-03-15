'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '../../../components/admin/AdminLayout';
import dynamic from 'next/dynamic';
import { Category } from '@prisma/client';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

interface FormData {
  title: string;
  content: string;
  excerpt: string;
  mainImage: string;
  images: string[];
  categories: string[];
  tags: string[];
  metaTitle: string;
  metaDesc: string;
  metaKeywords: string[];
}

export default function NewPostPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    mainImage: '',
    images: [] as string[],
    categories: [] as string[],
    tags: [] as string[],
    metaTitle: '',
    metaDesc: '',
    metaKeywords: [] as string[]
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/admin/login');
        return;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title: formData.title,
          content: formData.content,
          excerpt: formData.excerpt,
          mainImage: formData.mainImage,
          images: formData.images,
          categories: formData.categories,
          tags: formData.tags,
          metaTitle: formData.metaTitle,
          metaDesc: formData.metaDesc,
          metaKeywords: formData.metaKeywords
        })
      });

      if (!res.ok) {
        throw new Error('Failed to create post');
      }

      router.push('/admin/posts');
    } catch (error) {
      setError('שגיאה ביצירת הפוסט');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditorChange = (content: string) => {
    setFormData(prev => ({
      ...prev,
      content
    }));
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">פוסט חדש</h1>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          handleSubmit({
            title: formData.get('title') as string,
            content: formData.get('content') as string,
            excerpt: formData.get('excerpt') as string,
            mainImage: formData.get('mainImage') as string,
            images: (formData.get('images') as string).split(',').map(img => img.trim()),
            categories: (formData.get('categories') as string).split(',').map(cat => cat.trim()),
            tags: (formData.get('tags') as string).split(',').map(tag => tag.trim()),
            metaTitle: formData.get('metaTitle') as string,
            metaDesc: formData.get('metaDesc') as string,
            metaKeywords: (formData.get('metaKeywords') as string).split(',').map(keyword => keyword.trim()),
          });
        }} className="space-y-6 max-w-3xl">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              כותרת
            </label>
            <input
              type="text"
              name="title"
              id="title"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={formData.title}
              onChange={handleChange}
              dir="rtl"
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              תוכן
            </label>
            <div className="text-right">
              <ReactQuill
                value={formData.content}
                onChange={handleEditorChange}
                className="h-64 mb-12"
              />
            </div>
          </div>

          <div>
            <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700">
              תקציר
            </label>
            <textarea
              name="excerpt"
              id="excerpt"
              rows={3}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={formData.excerpt}
              onChange={handleChange}
              dir="rtl"
            />
          </div>

          <div>
            <label htmlFor="mainImage" className="block text-sm font-medium text-gray-700">
              תמונה ראשית
            </label>
            <input
              type="text"
              name="mainImage"
              id="mainImage"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={formData.mainImage}
              onChange={handleChange}
              dir="rtl"
            />
          </div>

          <div>
            <label htmlFor="images" className="block text-sm font-medium text-gray-700">
              תמונות נוספות (מופרדות בפסיקים)
            </label>
            <input
              type="text"
              name="images"
              id="images"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={formData.images.join(',')}
              onChange={handleChange}
              dir="rtl"
            />
          </div>

          <div>
            <label htmlFor="categories" className="block text-sm font-medium text-gray-700">
              קטגוריות (מופרדות בפסיקים)
            </label>
            <input
              type="text"
              name="categories"
              id="categories"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={formData.categories.join(',')}
              onChange={handleChange}
              dir="rtl"
            />
          </div>

          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
              תגיות (מופרדות בפסיקים)
            </label>
            <input
              type="text"
              name="tags"
              id="tags"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={formData.tags.join(',')}
              onChange={handleChange}
              dir="rtl"
            />
          </div>

          <div>
            <label htmlFor="metaTitle" className="block text-sm font-medium text-gray-700">
              כותרת Meta
            </label>
            <input
              type="text"
              name="metaTitle"
              id="metaTitle"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={formData.metaTitle}
              onChange={handleChange}
              dir="rtl"
            />
          </div>

          <div>
            <label htmlFor="metaDesc" className="block text-sm font-medium text-gray-700">
              תיאור Meta
            </label>
            <textarea
              name="metaDesc"
              id="metaDesc"
              rows={3}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={formData.metaDesc}
              onChange={handleChange}
              dir="rtl"
            />
          </div>

          <div>
            <label htmlFor="metaKeywords" className="block text-sm font-medium text-gray-700">
              מילות מפתח Meta (מופרדות בפסיקים)
            </label>
            <input
              type="text"
              name="metaKeywords"
              id="metaKeywords"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={formData.metaKeywords.join(',')}
              onChange={handleChange}
              dir="rtl"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className={`bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'שומר...' : 'שמור פוסט'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
} 