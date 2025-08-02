'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'react-hot-toast';

interface FooterLink {
  id: string;
  title: string;
  url: string;
  pageId: string;
  order: number;
  isActive: boolean;
  openInNewTab: boolean;
  icon: string;
}

interface FooterColumn {
  id: string;
  title: string;
  order: number;
  isActive: boolean;
  links: FooterLink[];
}

export default function FooterLinksPage() {
  const router = useRouter();
  const params = useParams();
  const columnId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [column, setColumn] = useState<FooterColumn | null>(null);
  const [pages, setPages] = useState<any[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newLink, setNewLink] = useState({
    title: '',
    url: '',
    pageId: '',
    order: 0,
    isActive: true,
    openInNewTab: false,
    icon: '',
  });

  useEffect(() => {
    if (columnId) {
      fetchData();
    }
  }, [columnId]);

  const fetchData = async () => {
    try {
      const [columnResponse, pagesResponse] = await Promise.all([
        fetch(`/api/admin/footer/columns/${columnId}`),
        fetch('/api/admin/pages'),
      ]);

      if (columnResponse.ok) {
        const columnData = await columnResponse.json();
        setColumn(columnData.column);
      }

      if (pagesResponse.ok) {
        const pagesData = await pagesResponse.json();
        setPages(pagesData.pages || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLink = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`/api/admin/footer/columns/${columnId}/links`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newLink),
      });

      if (response.ok) {
        toast.success('הקישור נוצר בהצלחה');
        setShowCreateForm(false);
        setNewLink({
          title: '',
          url: '',
          pageId: '',
          order: 0,
          isActive: true,
          openInNewTab: false,
          icon: '',
        });
        fetchData();
      } else {
        toast.error('שגיאה ביצירת הקישור');
      }
    } catch (error) {
      console.error('Error creating footer link:', error);
      toast.error('שגיאה ביצירת הקישור');
    }
  };

  const handleDeleteLink = async (linkId: string) => {
    if (!confirm('האם אתה בטוח שברצונך למחוק קישור זה?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/footer/columns/${columnId}/links/${linkId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('הקישור נמחק בהצלחה');
        fetchData();
      } else {
        toast.error('שגיאה במחיקת הקישור');
      }
    } catch (error) {
      console.error('Error deleting footer link:', error);
      toast.error('שגיאה במחיקת הקישור');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">טוען קישורי פוטר...</p>
        </div>
      </div>
    );
  }

  if (!column) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">עמודת הפוטר לא נמצאה</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">ניהול קישורי פוטר</h1>
                <p className="mt-1 text-sm text-gray-600">
                  {column.title} - סדר: {column.order}
                </p>
              </div>
              <button
                onClick={() => setShowCreateForm(true)}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                הוסף קישור חדש
              </button>
            </div>
          </div>

          {/* טופס יצירת קישור */}
          {showCreateForm && (
            <div className="p-6 border-b border-gray-200">
              <form onSubmit={handleCreateLink} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      כותרת הקישור
                    </label>
                    <input
                      type="text"
                      value={newLink.title}
                      onChange={(e) => setNewLink(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      קישור
                    </label>
                    <input
                      type="text"
                      value={newLink.url}
                      onChange={(e) => setNewLink(prev => ({ ...prev, url: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="/page"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      עמוד (אופציונלי)
                    </label>
                    <select
                      value={newLink.pageId}
                      onChange={(e) => setNewLink(prev => ({ ...prev, pageId: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">בחר עמוד</option>
                      {pages.map((page) => (
                        <option key={page.id} value={page.id}>
                          {page.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      סדר
                    </label>
                    <input
                      type="number"
                      value={newLink.order}
                      onChange={(e) => setNewLink(prev => ({ ...prev, order: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      אייקון (CSS class)
                    </label>
                    <input
                      type="text"
                      value={newLink.icon}
                      onChange={(e) => setNewLink(prev => ({ ...prev, icon: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="fas fa-link"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-4 space-x-reverse">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={newLink.isActive}
                      onChange={(e) => setNewLink(prev => ({ ...prev, isActive: e.target.checked }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isActive" className="mr-2 block text-sm text-gray-900">
                      פעיל
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="openInNewTab"
                      checked={newLink.openInNewTab}
                      onChange={(e) => setNewLink(prev => ({ ...prev, openInNewTab: e.target.checked }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="openInNewTab" className="mr-2 block text-sm text-gray-900">
                      פתח בטאב חדש
                    </label>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 space-x-reverse">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    ביטול
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    צור קישור
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* רשימת קישורים */}
          <div className="p-6">
            {column.links.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">אין קישורים עדיין</p>
              </div>
            ) : (
              <div className="space-y-4">
                {column.links.map((link) => (
                  <div key={link.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-4 space-x-reverse">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">{link.title}</h3>
                          <p className="text-sm text-gray-500">
                            {link.url || 'ללא קישור'} • סדר: {link.order}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 space-x-reverse">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          link.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {link.isActive ? 'פעיל' : 'לא פעיל'}
                        </span>
                        <button
                          onClick={() => router.push(`/admin/footer/columns/${columnId}/links/${link.id}/edit`)}
                          className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                        >
                          ערוך
                        </button>
                        <button
                          onClick={() => handleDeleteLink(link.id)}
                          className="text-red-600 hover:text-red-900 text-sm font-medium"
                        >
                          מחק
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 