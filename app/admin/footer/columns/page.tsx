'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

interface FooterColumn {
  id: string;
  title: string;
  order: number;
  isActive: boolean;
  links: FooterLink[];
}

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

export default function FooterColumnsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [columns, setColumns] = useState<FooterColumn[]>([]);
  const [pages, setPages] = useState<any[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newColumn, setNewColumn] = useState({
    title: '',
    order: 0,
    isActive: true,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [footerResponse, pagesResponse] = await Promise.all([
        fetch('/api/admin/footer'),
        fetch('/api/admin/pages'),
      ]);

      if (footerResponse.ok) {
        const footerData = await footerResponse.json();
        if (footerData.footer) {
          setColumns(footerData.footer.columns || []);
        }
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

  const handleCreateColumn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/admin/footer/columns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newColumn),
      });

      if (response.ok) {
        toast.success('עמודת הפוטר נוצרה בהצלחה');
        setShowCreateForm(false);
        setNewColumn({ title: '', order: 0, isActive: true });
        fetchData();
      } else {
        toast.error('שגיאה ביצירת עמודת הפוטר');
      }
    } catch (error) {
      console.error('Error creating footer column:', error);
      toast.error('שגיאה ביצירת עמודת הפוטר');
    }
  };

  const handleDeleteColumn = async (columnId: string) => {
    if (!confirm('האם אתה בטוח שברצונך למחוק עמודה זו?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/footer/columns/${columnId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('עמודת הפוטר נמחקה בהצלחה');
        fetchData();
      } else {
        toast.error('שגיאה במחיקת עמודת הפוטר');
      }
    } catch (error) {
      console.error('Error deleting footer column:', error);
      toast.error('שגיאה במחיקת עמודת הפוטר');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">טוען עמודות פוטר...</p>
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
                <h1 className="text-2xl font-bold text-gray-900">ניהול עמודות פוטר</h1>
                <p className="mt-1 text-sm text-gray-600">
                  ניהול עמודות וקישורי הפוטר
                </p>
              </div>
              <button
                onClick={() => setShowCreateForm(true)}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                צור עמודה חדשה
              </button>
            </div>
          </div>

          {/* טופס יצירת עמודה */}
          {showCreateForm && (
            <div className="p-6 border-b border-gray-200">
              <form onSubmit={handleCreateColumn} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      כותרת העמודה
                    </label>
                    <input
                      type="text"
                      value={newColumn.title}
                      onChange={(e) => setNewColumn(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      סדר
                    </label>
                    <input
                      type="number"
                      value={newColumn.order}
                      onChange={(e) => setNewColumn(prev => ({ ...prev, order: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={newColumn.isActive}
                      onChange={(e) => setNewColumn(prev => ({ ...prev, isActive: e.target.checked }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isActive" className="mr-2 block text-sm text-gray-900">
                      פעילה
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
                    צור עמודה
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* רשימת עמודות */}
          <div className="p-6">
            {columns.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">אין עמודות פוטר עדיין</p>
              </div>
            ) : (
              <div className="space-y-6">
                {columns.map((column) => (
                  <div key={column.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{column.title}</h3>
                        <p className="text-sm text-gray-500">
                          סדר: {column.order}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4 space-x-reverse">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          column.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {column.isActive ? 'פעילה' : 'לא פעילה'}
                        </span>
                        <button
                          onClick={() => router.push(`/admin/footer/columns/${column.id}/links`)}
                          className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                        >
                          ערוך קישורים
                        </button>
                        <button
                          onClick={() => handleDeleteColumn(column.id)}
                          className="text-red-600 hover:text-red-900 text-sm font-medium"
                        >
                          מחק
                        </button>
                      </div>
                    </div>

                    {column.links.length > 0 ? (
                      <div className="bg-gray-50 rounded-md p-3">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">קישורים:</h4>
                        <div className="space-y-1">
                          {column.links.map((link) => (
                            <div key={link.id} className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">{link.title}</span>
                              <span className="text-gray-400">{link.url || 'ללא קישור'}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">אין קישורים</p>
                    )}
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