import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'עדי פון תקשורת | עמוד 404 - הדף לא נמצא',
  description: 'מצטערים, העמוד שחיפשת לא נמצא. אנא נסה לחפש בעמוד הבית או צור איתנו קשר.',
  robots: 'noindex, follow'
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center space-y-8">
        <div>
          <h1 className="text-9xl font-bold text-blue-600 dark:text-blue-500">404</h1>
          <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
            אופס! העמוד לא נמצא
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            מצטערים, אבל העמוד שחיפשת לא קיים או הוסר.
            <br />
            אנא נסה לחפש בעמוד הבית או צור איתנו קשר.
          </p>
        </div>
        
        <div className="mt-8 space-y-4">
          <Link 
            href="/"
            className="inline-flex items-center justify-center w-full px-8 py-3 text-base font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200 dark:bg-blue-700 dark:hover:bg-blue-800"
          >
            <svg 
              className="w-5 h-5 ml-2 rtl:rotate-180" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            חזרה לעמוד הבית
          </Link>
          
          <Link 
            href="/contact"
            className="inline-flex items-center justify-center w-full px-8 py-3 text-base font-medium text-blue-600 bg-transparent border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-200 dark:text-blue-500 dark:border-blue-500 dark:hover:bg-blue-900/20"
          >
            <svg 
              className="w-5 h-5 ml-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            צור קשר
          </Link>
        </div>

        <div className="mt-8">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            אם אתה חושב שזו טעות, אנא{' '}
            <Link 
              href="/contact" 
              className="text-blue-600 hover:text-blue-700 dark:text-blue-500 dark:hover:text-blue-400"
            >
              דווח לנו
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 