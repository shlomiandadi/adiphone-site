import Link from 'next/link';
import type { BlogNavPost } from '../../lib/blogNav';

interface BlogNavigationProps {
  previousPost: BlogNavPost | null;
  nextPost: BlogNavPost | null;
}

export default function BlogNavigation({ previousPost, nextPost }: BlogNavigationProps) {
  if (!previousPost && !nextPost) {
    return null;
  }

  return (
    <div className="border-t border-gray-200 py-8 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center gap-4">
          {/* Previous Post */}
          <div className="flex-1">
            {previousPost ? (
              <Link 
                href={`/blog/${previousPost.slug}`}
                className="group flex items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200"
              >
                <div className="flex items-center space-x-4 space-x-reverse">
                  <div className="flex-shrink-0">
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-500 mb-1">הכתבה הקודמת</p>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {previousPost.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">{previousPost.category}</p>
                  </div>
                </div>
              </Link>
            ) : (
              <div className="p-4 bg-gray-100 rounded-lg opacity-50">
                <p className="text-gray-500 text-center">אין כתבה קודמת</p>
              </div>
            )}
          </div>

          {/* Next Post */}
          <div className="flex-1">
            {nextPost ? (
              <Link 
                href={`/blog/${nextPost.slug}`}
                className="group flex items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex-1 min-w-0 text-right">
                    <p className="text-sm text-gray-500 mb-1">הכתבה הבאה</p>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {nextPost.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">{nextPost.category}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ) : (
              <div className="p-4 bg-gray-100 rounded-lg opacity-50">
                <p className="text-gray-500 text-center">אין כתבה הבאה</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
