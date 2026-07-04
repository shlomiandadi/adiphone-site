'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  mainImage: string;
  category: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  authorName: string;
  authorEmail: string;
  views: number;
  likes: number;
  metaTitle: string;
  metaDesc: string;
  tags: string[];
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

const POSTS_PER_PAGE = 10;

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

export default function PostsManager() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: POSTS_PER_PAGE,
    total: 0,
    pages: 0,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPosts(currentPage);
  }, [currentPage]);

  const fetchPosts = async (page: number) => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch(
        `/api/posts?admin=true&page=${page}&limit=${POSTS_PER_PAGE}`
      );
      if (!res.ok) {
        throw new Error('Failed to fetch posts');
      }
      const data = await res.json();
      setPosts(data.posts || []);
      setPagination(
        data.pagination || {
          page,
          limit: POSTS_PER_PAGE,
          total: data.posts?.length || 0,
          pages: 1,
        }
      );
    } catch (err) {
      setError('שגיאה בטעינת הפוסטים');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const goToPage = (page: number) => {
    if (page < 1 || page > pagination.pages || page === currentPage) return;
    setCurrentPage(page);
  };

  const handleDelete = async (slug: string) => {
    if (!window.confirm('האם אתה בטוח שברצונך למחוק פוסט זה?')) {
      return;
    }

    try {
      const res = await fetch(`/api/posts/${slug}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to delete post');
      }

      const remainingOnPage = posts.length - 1;
      if (remainingOnPage === 0 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        fetchPosts(currentPage);
      }
    } catch (err) {
      setError('שגיאה במחיקת הפוסט');
      console.error('Error:', err);
    }
  };

  const pageNumbers = getPageNumbers(pagination.page, pagination.pages);
  const showPagination = pagination.pages > 1;
  const fromPost = pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1;
  const toPost = Math.min(pagination.page * pagination.limit, pagination.total);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">ניהול פוסטים</h1>
          {!loading && pagination.total > 0 && (
            <p className="text-sm text-gray-500 mt-1">
              מציג {fromPost}–{toPost} מתוך {pagination.total} פוסטים
            </p>
          )}
        </div>
        <Link
          href="/admin/posts/new"
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          פוסט חדש
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                כותרת
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                מחבר
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                קטגוריה
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                סטטוס
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                תאריך יצירה
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                פעולות
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  טוען פוסטים...
                </td>
              </tr>
            ) : Array.isArray(posts) && posts.length > 0 ? (
              posts.map((post) => (
                <tr key={post.slug}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{post.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {post.authorName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {post.category}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      post.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {post.published ? 'פורסם' : 'טיוטה'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString('he-IL')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link
                      href={`/admin/posts/${post.slug}/edit`}
                      className="text-indigo-600 hover:text-indigo-900 ml-4"
                    >
                      עריכה
                    </Link>
                    <button
                      onClick={() => handleDelete(post.slug)}
                      className="text-red-600 hover:text-red-900"
                    >
                      מחיקה
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  אין פוסטים עדיין
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showPagination && !loading && (
        <nav
          className="mt-6 flex flex-wrap items-center justify-center gap-2"
          aria-label="ניווט בין עמודי הפוסטים"
        >
          <button
            type="button"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage <= 1}
            className="px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-700 font-medium transition-colors hover:bg-indigo-50 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white"
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
                className={`min-w-[2.5rem] px-3 py-2 rounded-md font-medium transition-colors ${
                  item === currentPage
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'border border-gray-300 bg-white text-gray-700 hover:bg-indigo-50'
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
            className="px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-700 font-medium transition-colors hover:bg-indigo-50 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white"
          >
            הבא
          </button>
        </nav>
      )}
    </div>
  );
}
