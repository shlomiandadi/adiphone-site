'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useAdminAuth } from '../../../lib/useAdminAuth';

interface SEOData {
  id: string;
  page: string;
  title: string;
  description: string;
  keywords: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  canonicalUrl: string;
  robots: string;
  updatedAt: string;
}

export default function SEOManagementPage() {
  const [seoData, setSeoData] = useState<SEOData[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<SEOData>>({});
  const { user, loading: authLoading } = useAdminAuth();
  const [apiError, setApiError] = useState<string | null>(null);

  console.log('SEO Page Component Rendered');

  useEffect(() => {
    if (!authLoading) {
      fetchSEOData();
    }
  }, [authLoading]);

  const fetchSEOData = async () => {
    try {
      const response = await fetch('/api/admin/seo');
      if (response.ok) {
        const data = await response.json();
        setSeoData(data);
      } else {
        console.error('שגיאה בטעינת נתוני SEO:', response.status, response.statusText);
        setApiError('שגיאה בטעינת נתוני SEO מהשרת');
        // אם ה-API לא עובד, נציג נתונים לדוגמה
        setSeoData([
          {
            id: '1',
            page: 'home',
            title: 'Top WebStack - בנייה וקידום אתרים',
            description: 'Top WebStack - בנייה וקידום אתרים מקצועי מבית עדי פון תקשורת',
            keywords: 'בניית אתרים, קידום אתרים, SEO',
            ogTitle: 'Top WebStack - בנייה וקידום אתרים',
            ogDescription: 'Top WebStack - בנייה וקידום אתרים מקצועי',
            ogImage: '',
            canonicalUrl: 'https://adi-phone.co.il',
            robots: 'index, follow',
            updatedAt: new Date().toISOString()
          },
          {
            id: '2',
            page: 'about',
            title: 'אודות Top WebStack',
            description: 'למדו על Top WebStack - חברת בנייה וקידום אתרים מקצועית',
            keywords: 'אודות, מי אנחנו, Top WebStack',
            ogTitle: 'אודות Top WebStack',
            ogDescription: 'למדו על Top WebStack',
            ogImage: '',
            canonicalUrl: 'https://adi-phone.co.il/about',
            robots: 'index, follow',
            updatedAt: new Date().toISOString()
          }
        ]);
      }
    } catch (error) {
      console.error('שגיאה בטעינת נתוני SEO:', error);
      setApiError('שגיאה בטעינת נתוני SEO מהשרת');
      // אם יש שגיאה, נציג נתונים לדוגמה
      setSeoData([
        {
          id: '1',
          page: 'home',
          title: 'Top WebStack - בנייה וקידום אתרים',
          description: 'Top WebStack - בנייה וקידום אתרים מקצועי מבית עדי פון תקשורת',
          keywords: 'בניית אתרים, קידום אתרים, SEO',
          ogTitle: 'Top WebStack - בנייה וקידום אתרים',
          ogDescription: 'Top WebStack - בנייה וקידום אתרים מקצועי',
          ogImage: '',
          canonicalUrl: 'https://adi-phone.co.il',
          robots: 'index, follow',
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          page: 'about',
          title: 'אודות Top WebStack',
          description: 'למדו על Top WebStack - חברת בנייה וקידום אתרים מקצועית',
          keywords: 'אודות, מי אנחנו, Top WebStack',
          ogTitle: 'אודות Top WebStack',
          ogDescription: 'למדו על Top WebStack',
          ogImage: '',
          canonicalUrl: 'https://adi-phone.co.il/about',
          robots: 'index, follow',
          updatedAt: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: SEOData) => {
    setEditingId(item.id);
    setFormData(item);
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/admin/seo/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setEditingId(null);
        setFormData({});
        fetchSEOData();
      }
    } catch (error) {
      console.error('שגיאה בשמירת נתוני SEO:', error);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({});
  };

  console.log('Current user state:', user);
  console.log('Current loading state:', loading);
  console.log('Current seoData state:', seoData);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">לא מאומת</h1>
          <p className="text-gray-600 mb-4">עליך להתחבר כדי לגשת לדף זה</p>
          <a href="/admin/login" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            התחבר
          </a>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout user={user}>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">ניהול SEO</h1>
          <p className="text-gray-600">נהל את הגדרות ה-SEO של האתר</p>
          <div className="mt-2 text-sm text-gray-500">
            מצב טעינה: {loading ? 'טוען...' : 'הושלם'} | 
            מספר רשומות: {seoData.length} | 
            משתמש: {user ? 'מחובר' : 'לא מחובר'}
          </div>
          {apiError && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="mr-3">
                  <p className="text-sm text-yellow-800">{apiError}</p>
                  <p className="text-sm text-yellow-700 mt-1">מציגים נתונים לדוגמה</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : seoData.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">אין נתוני SEO זמינים</p>
            <button 
              onClick={fetchSEOData}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              נסה שוב
            </button>
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">הגדרות SEO לפי עמודים</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      עמוד
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      כותרת
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      תיאור
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      מילות מפתח
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      פעולות
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {seoData.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.page}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {editingId === item.id ? (
                          <input
                            type="text"
                            value={formData.title || ''}
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        ) : (
                          item.title
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {editingId === item.id ? (
                          <textarea
                            value={formData.description || ''}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={3}
                          />
                        ) : (
                          <div className="max-w-xs truncate">{item.description}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {editingId === item.id ? (
                          <input
                            type="text"
                            value={formData.keywords || ''}
                            onChange={(e) => setFormData({...formData, keywords: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="מילה1, מילה2, מילה3"
                          />
                        ) : (
                          <div className="max-w-xs truncate">{item.keywords}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {editingId === item.id ? (
                          <div className="flex space-x-2 space-x-reverse">
                            <button
                              onClick={handleSave}
                              className="text-green-600 hover:text-green-900"
                            >
                              שמור
                            </button>
                            <button
                              onClick={handleCancel}
                              className="text-gray-600 hover:text-gray-900"
                            >
                              ביטול
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleEdit(item)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            ערוך
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
} 