'use client';

import React, { useState, useEffect } from 'react';
import { ContactService } from '@prisma/client';
import BlogCard from '../components/BlogCard';
import BlogSchema from '../components/BlogSchema';
import { metadata } from './metadata';

interface BlogPost {
  id: string;
  title: string;
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

const POSTS_PER_PAGE = 6;

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

function getPageNumbers(current: number, total: number): (number | 'ellipsis')[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | 'ellipsis')[] = [1];

  if (current > 3) pages.push('ellipsis');

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) pages.push(i);

  if (current < total - 2) pages.push('ellipsis');

  pages.push(total);
  return pages;
}

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: POSTS_PER_PAGE,
    total: 0,
    pages: 0,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: 'מתעניין/ת בניוזלטר',
    service: ContactService.OTHER,
    newsletter: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/posts?page=${currentPage}&limit=${POSTS_PER_PAGE}`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch blogs');
        }
        const data = await response.json();
        setPosts(data.posts || []);
        setPagination(
          data.pagination || {
            page: currentPage,
            limit: POSTS_PER_PAGE,
            total: data.posts?.length || 0,
            pages: 1,
          }
        );
      } catch (err) {
        console.error('Error fetching blogs:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch blogs');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [currentPage]);

  const goToPage = (page: number) => {
    if (page < 1 || page > pagination.pages || page === currentPage) return;
    setCurrentPage(page);
    document.getElementById('blog-posts')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus('שולח...');

    try {
      const response = await fetch('/api/contact/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'שגיאה בשליחת הטופס');
      }

      setStatus('תודה על ההרשמה לניוזלטר! נשלח לך עדכונים בקרוב.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: 'מתעניין/ת בניוזלטר',
        service: ContactService.OTHER,
        newsletter: true
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      setStatus('אירעה שגיאה בהרשמה לניוזלטר. אנא נסה שוב.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.checked
    }));
  };

  const pageNumbers = getPageNumbers(pagination.page, pagination.pages);
  const showPagination = pagination.pages > 1;
  const fromPost = pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1;
  const toPost = Math.min(pagination.page * pagination.limit, pagination.total);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <BlogSchema posts={posts} />
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">בלוג</h1>
          <p className="text-xl max-w-2xl mx-auto">
            טיפים, מדריכים ועדכונים מהעולם הדיגיטלי
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Blog Posts */}
          <div id="blog-posts" className="lg:col-span-2 scroll-mt-28">
            {error ? (
              <div className="text-center py-12">
                <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 text-red-700 dark:text-red-200 px-4 py-3 rounded max-w-md mx-auto">
                  <p>שגיאה בטעינת הפוסטים: {error}</p>
                </div>
              </div>
            ) : loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600 dark:text-gray-300">טוען פוסטים...</p>
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  אין פוסטים זמינים כרגע
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  בקרוב נוסיף תוכן מעניין לבלוג שלנו
                </p>
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                  מציג {fromPost}–{toPost} מתוך {pagination.total} מאמרים
                </p>

                <div className="grid md:grid-cols-2 gap-8">
                  {posts.map((post) => (
                    <BlogCard key={post.id} post={post} />
                  ))}
                </div>

                {showPagination && (
                  <nav
                    className="mt-12 flex flex-wrap items-center justify-center gap-2"
                    aria-label="ניווט בין עמודי הבלוג"
                  >
                    <button
                      type="button"
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage <= 1}
                      className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-medium transition-colors hover:bg-blue-50 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white dark:disabled:hover:bg-gray-800"
                    >
                      הקודם
                    </button>

                    {pageNumbers.map((item, index) =>
                      item === 'ellipsis' ? (
                        <span
                          key={`ellipsis-${index}`}
                          className="px-2 text-gray-400"
                          aria-hidden="true"
                        >
                          …
                        </span>
                      ) : (
                        <button
                          type="button"
                          key={item}
                          onClick={() => goToPage(item)}
                          aria-current={item === currentPage ? 'page' : undefined}
                          className={`min-w-[2.5rem] px-3 py-2 rounded-lg font-medium transition-colors ${
                            item === currentPage
                              ? 'bg-blue-600 text-white shadow-md'
                              : 'border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-700'
                          }`}
                        >
                          {item}
                        </button>
                      )
                    )}

                    <button
                      type="button"
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage >= pagination.pages}
                      className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-medium transition-colors hover:bg-blue-50 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white dark:disabled:hover:bg-gray-800"
                    >
                      הבא
                    </button>
                  </nav>
                )}
              </>
            )}
          </div>

          {/* Newsletter Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 sticky top-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                הירשם לניוזלטר
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                קבל עדכונים על פוסטים חדשים וטיפים שימושיים
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    שם מלא
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    דוא"ל
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    טלפון
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div className="flex items-start space-x-3 space-x-reverse">
                  <input
                    type="checkbox"
                    id="newsletter"
                    name="newsletter"
                    checked={formData.newsletter}
                    onChange={handleCheckboxChange}
                    className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="newsletter" className="text-sm text-gray-700 dark:text-gray-300">
                    אני מעוניין/ת לקבל עדכונים, טיפים מקצועיים וחומרים שיווקיים על שירותי עדי פון תקשורת
                  </label>
                </div>

                {status && (
                  <div className={`p-4 rounded-lg text-center text-sm font-medium ${
                    status.includes('תודה') 
                      ? 'bg-green-100 text-green-700 border border-green-500 dark:bg-green-900/30 dark:text-green-200' 
                      : 'bg-red-100 text-red-700 border border-red-500 dark:bg-red-900/30 dark:text-red-200'
                  }`}>
                    {status}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
                    isSubmitting
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 transform hover:scale-105'
                  } text-white shadow-lg`}
                >
                  {isSubmitting ? 'שולח...' : 'הרשמה לניוזלטר'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 