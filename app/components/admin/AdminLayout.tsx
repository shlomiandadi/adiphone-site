import Link from 'next/link';
import { AdminUser } from '../../../lib/adminAuth';
import BrandLogo from '../BrandLogo';

interface AdminLayoutProps {
  children: React.ReactNode;
  user: AdminUser;
}

export default function AdminLayout({ children, user }: AdminLayoutProps) {
  const role = String(user.role).toUpperCase();
  const isAdmin = role === 'ADMIN';
  const isEditor = isAdmin || role === 'EDITOR';

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center gap-3">
                <Link href="/" className="flex items-center">
                  <BrandLogo height={28} />
                </Link>
                <span className="text-xl font-semibold">מערכת ניהול</span>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-gray-700 ml-4">{user.username}</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <div className="fixed top-16 bottom-0 left-0 w-64 bg-white shadow-lg z-20">
        <nav className="mt-12 overflow-y-auto h-full pb-20 space-y-2">
          <Link href="/admin" className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100">
            <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            לוח בקרה
          </Link>
          <Link href="/admin/posts" className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100">
            <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15" />
            </svg>
            פוסטים
          </Link>
          {isEditor && (
            <>
              <Link href="/admin/portfolio" className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100">
                <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                פרויקטים
              </Link>
              <Link href="/admin/categories" className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100">
                <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                קטגוריות
              </Link>
              <Link href="/admin/tags" className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100">
                <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                תגיות
              </Link>
            </>
          )}
          <Link href="/admin/contacts" className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100">
            <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            פניות
          </Link>
          {isAdmin && (
            <Link href="/admin/users" className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100">
              <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              משתמשים
            </Link>
          )}
          <div className="px-6 pt-4 pb-1 text-xs font-semibold text-gray-400 uppercase">CMS</div>
          <Link href="/admin/seo/canonicals" className="flex items-center px-6 py-2 text-gray-700 hover:bg-gray-100">קנוניקל</Link>
          <Link href="/admin/seo/pages" className="flex items-center px-6 py-2 text-gray-700 hover:bg-gray-100">SEO עמודים</Link>
          <Link href="/admin/settings/general" className="flex items-center px-6 py-2 text-gray-700 hover:bg-gray-100">הגדרות כלליות</Link>
          <Link href="/admin/settings/robots" className="flex items-center px-6 py-2 text-gray-700 hover:bg-gray-100">Robots</Link>
          <Link href="/admin/settings/sitemap" className="flex items-center px-6 py-2 text-gray-700 hover:bg-gray-100">Sitemap</Link>
          <Link href="/admin/navigation" className="flex items-center px-6 py-2 text-gray-700 hover:bg-gray-100">ניווט</Link>
          <Link href="/admin/footer" className="flex items-center px-6 py-2 text-gray-700 hover:bg-gray-100">פוטר</Link>
          <Link href="/admin/announcement" className="flex items-center px-6 py-2 text-gray-700 hover:bg-gray-100">סרט הודעות</Link>
        </nav>
      </div>

      {/* Main content */}
      <div className="ml-64 pt-16 min-h-screen bg-gray-100">
        {children}
      </div>
    </div>
  );
}
