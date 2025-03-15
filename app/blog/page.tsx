'use client';

export const dynamic = 'force-dynamic';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Blog {
  _id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  date: string;
  keywords: string[];
  relatedPosts: string[];
  slug: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function Blog() {
  const [articles, setArticles] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: 'מתעניין/ת בניוזלטר',
    service: 'other'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch blogs');
        }
        const data = await response.json();
        setArticles(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching blogs:', error);
        setStatus('אירעה שגיאה בטעינת המאמרים. אנא רענן את הדף.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus('שולח...');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contact/submit`, {
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
        service: 'other'
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

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[400px] w-full">
        <Image
          src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200"
          alt="Blog Hero"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/80 to-purple-600/80 dark:from-blue-900/90 dark:to-purple-900/90" />
        <div className="absolute inset-0 flex items-center justify-center text-center">
          <div className="container mx-auto px-4">
            <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl lg:text-6xl">
              הבלוג שלנו
            </h1>
            <p className="mx-auto max-w-2xl text-xl text-white/90 md:text-2xl">
              מאמרים, טיפים וחדשות מעולם הפיתוח והשיווק הדיגיטלי
            </p>
          </div>
        </div>
      </div>

      {/* Blog Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
              <p className="mt-2 text-gray-600">טוען מאמרים...</p>
            </div>
          ) : status ? (
            <div className="text-center">
              <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-8">
                {status}
              </div>
              <button 
                onClick={() => window.location.reload()}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                נסה שוב
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article) => (
                <div key={article._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <Link href={`/blog/${article.slug}`} className="block">
                    <div className="relative h-48">
                      <Image
                        src={article.image}
                        alt={article.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </Link>
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-sm text-gray-500">{article.date}</span>
                      <span className="text-sm text-blue-600">{article.category}</span>
                    </div>
                    <Link href={`/blog/${article.slug}`} className="block">
                      <h2 className="text-xl font-bold mb-2 hover:text-blue-600 transition-colors">{article.title}</h2>
                    </Link>
                    <p className="text-gray-600 mb-4">{article.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {article.keywords?.map((keyword, index) => (
                        <span key={index} className="text-sm bg-gray-100 px-3 py-1 rounded-full">
                          {keyword}
                        </span>
                      ))}
                    </div>
                    {article.relatedPosts && article.relatedPosts.length > 0 && (
                      <div className="mt-4">
                        <h3 className="text-sm font-semibold mb-2">מאמרים קשורים:</h3>
                        <div className="space-y-1">
                          {article.relatedPosts.map((relatedSlug, index) => {
                            // Find the related article to get its title
                            const relatedArticle = articles.find(a => a.slug === relatedSlug);
                            return (
                              <Link
                                key={index}
                                href={`/blog/${relatedSlug}`}
                                className="block text-sm text-blue-600 hover:underline"
                              >
                                {relatedArticle ? relatedArticle.title : relatedSlug}
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    <Link
                      href={`/blog/${article.slug}`}
                      className="inline-block mt-4 text-blue-600 hover:text-blue-700 font-medium"
                    >
                      קרא עוד →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-gray-50 dark:bg-gray-800 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 dark:text-white">הירשמו לניוזלטר</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            קבלו עדכונים שוטפים על טיפים וחדשות מעולם הדיגיטל
          </p>
          <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
            <div>
              <input
                type="text"
                name="name"
                placeholder="שם מלא"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-6 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              />
            </div>
            <div>
              <input
                type="email"
                name="email"
                placeholder="כתובת אימייל"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-6 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              />
            </div>
            <div>
              <input
                type="tel"
                name="phone"
                placeholder="מספר טלפון"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-6 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 text-right"
              />
            </div>

            {status && (
              <div className={`p-4 rounded-lg text-center text-lg font-medium ${
                status.includes('תודה') 
                  ? 'bg-green-100 text-green-700 border border-green-500 dark:bg-green-900/30 dark:text-green-200' 
                  : status === 'שולח...'
                  ? 'bg-blue-100 text-blue-700 border border-blue-500 dark:bg-blue-900/30 dark:text-blue-200'
                  : 'bg-red-100 text-red-700 border border-red-500 dark:bg-red-900/30 dark:text-red-200'
              }`}>
                {status}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 px-6 rounded-lg transition-colors ${
                isSubmitting 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white flex items-center justify-center space-x-2 rtl:space-x-reverse`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>שולח...</span>
                </>
              ) : (
                <>
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  <span>הרשמה לניוזלטר</span>
                </>
              )}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
} 