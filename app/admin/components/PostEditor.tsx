'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Link from 'next/link';

// Dynamic import for React Quill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { 
  ssr: false,
  loading: () => <div className="h-64 bg-gray-100 rounded animate-pulse"></div>
});

import 'react-quill/dist/quill.snow.css';

interface PostData {
  title: string;
  content: string;
  excerpt: string;
  mainImage: string;
  category: string;
  tags: string;
  metaTitle: string;
  metaDesc: string;
  published: boolean;
  slug: string;
}

interface PostEditorProps {
  mode: 'create' | 'edit';
  postId?: string;
}

export default function PostEditor({ mode, postId }: PostEditorProps) {
  const router = useRouter();
  const [postData, setPostData] = useState<PostData>({
    title: '',
    content: '',
    excerpt: '',
    mainImage: '',
    category: '',
    tags: '',
    metaTitle: '',
    metaDesc: '',
    published: false,
    slug: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [categories, setCategories] = useState<Array<{id: string, name: string, slug: string}>>([]);

  useEffect(() => {
    fetchCategories();
    if (mode === 'edit' && postId) {
      fetchPost();
    }
  }, [mode, postId]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/categories');
      if (response.ok) {
        const categoriesData = await response.json();
        setCategories(categoriesData);
      }
    } catch (error) {
      console.error('שגיאה בטעינת קטגוריות:', error);
    }
  };

  const fetchPost = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/posts/${postId}`);
      if (response.ok) {
        const post = await response.json();
        setPostData({
          title: post.title || '',
          content: post.content || '',
          excerpt: post.excerpt || '',
          mainImage: post.mainImage || '',
          category: post.category || '',
          tags: Array.isArray(post.tags) ? post.tags.join(', ') : post.tags || '',
          metaTitle: post.metaTitle || '',
          metaDesc: post.metaDesc || '',
          published: post.published || false,
          slug: post.slug || ''
        });
      }
    } catch (error) {
      setError('שגיאה בטעינת הפוסט');
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\u0590-\u05FFa-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setPostData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));

    // יצירת slug אוטומטית מהכותרת
    if (name === 'title' && !postData.slug) {
      setPostData(prev => ({
        ...prev,
        slug: generateSlug(value)
      }));
    }
  };

  const handleContentChange = (content: string) => {
    setPostData(prev => ({
      ...prev,
      content
    }));
  };

  const handleSave = async (publish: boolean = false) => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const finalData = {
        ...postData,
        published: publish ? true : postData.published,
        tags: postData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };

      const url = mode === 'create' ? '/api/posts' : `/api/posts/${postId}`;
      const method = mode === 'create' ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalData),
      });

      if (response.ok) {
        const result = await response.json();
        setSuccess(publish ? 'הפוסט פורסם בהצלחה!' : 'הפוסט נשמר כטיוטה!');
        
        if (mode === 'create') {
          setTimeout(() => {
            router.push('/admin');
          }, 1500);
        }
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'שגיאה בשמירת הפוסט');
      }
    } catch (error) {
      setError('שגיאה בחיבור לשרת');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="space-y-4">
              <div className="h-12 bg-gray-200 rounded"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {mode === 'create' ? 'פוסט חדש' : 'עריכת פוסט'}
              </h1>
            </div>
            <div className="flex items-center space-x-4 space-x-reverse">
              <Link
                href="/admin"
                className="text-gray-600 hover:text-gray-900 text-sm"
              >
                חזרה לדשבורד
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Editor */}
          <div className="lg:col-span-2 space-y-6">
            {/* Messages */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                {error}
              </div>
            )}
            
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
                {success}
              </div>
            )}

            {/* Title */}
            <div className="bg-white rounded-lg shadow p-6">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                כותרת הפוסט *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={postData.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="הכנס כותרת לפוסט..."
                required
              />
            </div>

            {/* Content Editor */}
            <div className="bg-white rounded-lg shadow p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                תוכן הפוסט *
              </label>
              <div className="border border-gray-300 rounded-md">
                <ReactQuill
                  value={postData.content}
                  onChange={handleContentChange}
                  placeholder="כתוב את תוכן הפוסט כאן..."
                  modules={{
                    toolbar: [
                      [{ 'header': [1, 2, 3, false] }],
                      ['bold', 'italic', 'underline', 'strike'],
                      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                      [{ 'color': [] }, { 'background': [] }],
                      ['link', 'image'],
                      ['clean']
                    ]
                  }}
                  style={{ height: '400px' }}
                />
              </div>
            </div>

            {/* Excerpt */}
            <div className="bg-white rounded-lg shadow p-6">
              <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">
                תקציר
              </label>
              <textarea
                id="excerpt"
                name="excerpt"
                value={postData.excerpt}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="תקציר קצר של הפוסט..."
              />
            </div>

            {/* Main Image */}
            <div className="bg-white rounded-lg shadow p-6">
              <label htmlFor="mainImage" className="block text-sm font-medium text-gray-700 mb-2">
                תמונה ראשית
              </label>
              <input
                type="url"
                id="mainImage"
                name="mainImage"
                value={postData.mainImage}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/image.jpg"
              />
              {postData.mainImage && (
                <div className="mt-2">
                  <img 
                    src={postData.mainImage} 
                    alt="תמונה ראשית" 
                    className="w-32 h-32 object-cover rounded"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publish Settings */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">הגדרות פרסום</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="published"
                      checked={postData.published}
                      onChange={handleInputChange}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="mr-2 text-sm text-gray-700">פרסם מיד</span>
                  </label>
                </div>

                <div className="flex space-x-2 space-x-reverse">
                  <button
                    onClick={() => handleSave(false)}
                    disabled={saving}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
                  >
                    {saving ? 'שומר...' : 'שמור כטיוטה'}
                  </button>
                  
                  <button
                    onClick={() => handleSave(true)}
                    disabled={saving}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
                  >
                    {saving ? 'מפרסם...' : 'פרסם'}
                  </button>
                </div>
              </div>
            </div>

            {/* SEO Settings */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">הגדרות SEO</h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
                    URL ידידותי
                  </label>
                  <input
                    type="text"
                    id="slug"
                    name="slug"
                    value={postData.slug}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="url-ידידותי"
                  />
                </div>

                <div>
                  <label htmlFor="metaTitle" className="block text-sm font-medium text-gray-700 mb-1">
                    כותרת Meta
                  </label>
                  <input
                    type="text"
                    id="metaTitle"
                    name="metaTitle"
                    value={postData.metaTitle}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="כותרת למנועי חיפוש"
                  />
                </div>

                <div>
                  <label htmlFor="metaDesc" className="block text-sm font-medium text-gray-700 mb-1">
                    תיאור Meta
                  </label>
                  <textarea
                    id="metaDesc"
                    name="metaDesc"
                    value={postData.metaDesc}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="תיאור קצר למנועי חיפוש"
                  />
                </div>
              </div>
            </div>

            {/* Categories & Tags */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">קטגוריות ותגיות</h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    קטגוריה
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={postData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">בחר קטגוריה</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.slug}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                    תגיות
                  </label>
                  <input
                    type="text"
                    id="tags"
                    name="tags"
                    value={postData.tags}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="תגיות מופרדות בפסיקים"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 