'use client';
import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';

interface CanonicalTag {
  id: string;
  pageSlug: string;
  canonicalUrl: string;
  isActive: boolean;
}

export default function CanonicalTagsPage() {
  const [canonicalTags, setCanonicalTags] = useState<CanonicalTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<CanonicalTag>>({});
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    }
    fetchCanonicalTags();
  }, []);

  const fetchCanonicalTags = async () => {
    try {
      const response = await fetch('/api/admin/canonicaltags');
      if (response.ok) {
        const data = await response.json();
        setCanonicalTags(data);
      } else {
        console.error('שגיאה בטעינת תגיות קנוניקל:', response.status, response.statusText);
        // אם ה-API לא עובד, נציג נתונים לדוגמה
        setCanonicalTags([
          {
            id: '1',
            pageSlug: 'home',
            canonicalUrl: 'https://adi-phone.co.il',
            isActive: true
          },
          {
            id: '2',
            pageSlug: 'about',
            canonicalUrl: 'https://adi-phone.co.il/about',
            isActive: true
          }
        ]);
      }
    } catch (error) {
      console.error('שגיאה בטעינת תגיות קנוניקל:', error);
      // אם יש שגיאה, נציג נתונים לדוגמה
      setCanonicalTags([
        {
          id: '1',
          pageSlug: 'home',
          canonicalUrl: 'https://adi-phone.co.il',
          isActive: true
        },
        {
          id: '2',
          pageSlug: 'about',
          canonicalUrl: 'https://adi-phone.co.il/about',
          isActive: true
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: CanonicalTag) => {
    setEditingId(item.id);
    setFormData(item);
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/admin/canonicaltags/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        setEditingId(null);
        setFormData({});
        fetchCanonicalTags();
      }
    } catch (error) {
      console.error('שגיאה בעדכון תגיות קנוניקל:', error);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({});
  };

  if (!user) return null;

  return (
    <AdminLayout user={user}>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">ניהול תגיות קנוניקל</h1>
          <p className="text-gray-600">נהל את תגיות הקנוניקל למניעת תוכן כפול</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg p-6">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900">תגיות קנוניקל קיימות</h2>
              <p className="text-sm text-gray-600">לחץ על "ערוך" כדי לשנות תגית קנוניקל</p>
            </div>
            
            {canonicalTags.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">אין תגיות קנוניקל זמינות</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        נתיב עמוד
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        URL קנוניקל
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        סטטוס
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        פעולות
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {canonicalTags.map((tag) => (
                      <tr key={tag.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {tag.pageSlug}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <a 
                            href={tag.canonicalUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 underline"
                          >
                            {tag.canonicalUrl}
                          </a>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${tag.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {tag.isActive ? 'פעיל' : 'לא פעיל'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleEdit(tag)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            ערוך
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            {editingId && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-4">עריכת תגית קנוניקל</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">נתיב עמוד</label>
                    <input
                      type="text"
                      value={formData.pageSlug || ''}
                      onChange={(e) => setFormData({...formData, pageSlug: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      placeholder="/example-page"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">URL קנוניקל</label>
                    <input
                      type="url"
                      value={formData.canonicalUrl || ''}
                      onChange={(e) => setFormData({...formData, canonicalUrl: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      placeholder="https://adi-phone.co.il/example-page"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      ה-URL הקנוניקל צריך להיות מלא עם https://
                    </p>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isActive || false}
                      onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">פעיל</span>
                  </div>
                </div>
                <div className="mt-4 flex space-x-2">
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    שמור
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                  >
                    ביטול
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
} 