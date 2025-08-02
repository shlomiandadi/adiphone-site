'use client';
import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';

interface SitemapSettings {
  id: string;
  isEnabled: boolean;
  includePages: boolean;
  includePosts: boolean;
  includeCategories: boolean;
  includePortfolio: boolean;
  excludePages: string[];
  excludePaths: string[];
  priority: number;
  changeFreq: string;
  lastModified: string;
}

export default function SitemapPage() {
  const [settings, setSettings] = useState<SitemapSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [newExcludePage, setNewExcludePage] = useState('');
  const [newExcludePath, setNewExcludePath] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    }
    fetchSitemapSettings();
  }, []);

  const fetchSitemapSettings = async () => {
    try {
      const response = await fetch('/api/admin/sitemap-settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error('שגיאה בטעינת הגדרות מפת אתר:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!settings) return;
    
    setSaving(true);
    try {
      const response = await fetch('/api/admin/sitemap-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      
      if (response.ok) {
        alert('הגדרות מפת אתר נשמרו בהצלחה!');
      }
    } catch (error) {
      console.error('שגיאה בשמירת הגדרות מפת אתר:', error);
      alert('שגיאה בשמירת ההגדרות');
    } finally {
      setSaving(false);
    }
  };

  const addExcludePage = () => {
    if (newExcludePage && settings) {
      setSettings({
        ...settings,
        excludePages: [...settings.excludePages, newExcludePage]
      });
      setNewExcludePage('');
    }
  };

  const removeExcludePage = (index: number) => {
    if (settings) {
      const updatedPages = settings.excludePages.filter((_, i) => i !== index);
      setSettings({ ...settings, excludePages: updatedPages });
    }
  };

  const addExcludePath = () => {
    if (newExcludePath && settings) {
      setSettings({
        ...settings,
        excludePaths: [...settings.excludePaths, newExcludePath]
      });
      setNewExcludePath('');
    }
  };

  const removeExcludePath = (index: number) => {
    if (settings) {
      const updatedPaths = settings.excludePaths.filter((_, i) => i !== index);
      setSettings({ ...settings, excludePaths: updatedPaths });
    }
  };

  const generateSitemap = async () => {
    try {
      const response = await fetch('/api/admin/sitemap-settings/generate', {
        method: 'POST'
      });
      
      if (response.ok) {
        alert('מפת אתר נוצרה בהצלחה!');
      } else {
        alert('שגיאה ביצירת מפת אתר');
      }
    } catch (error) {
      console.error('שגיאה ביצירת מפת אתר:', error);
      alert('שגיאה ביצירת מפת אתר');
    }
  };

  if (!user) return null;

  return (
    <AdminLayout user={user}>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">ניהול מפת אתר</h1>
          <p className="text-gray-600">נהל את הגדרות מפת האתר XML</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : settings ? (
          <div className="space-y-6">
            {/* הגדרות כלליות */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">הגדרות כלליות</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.isEnabled}
                    onChange={(e) => setSettings({...settings, isEnabled: e.target.checked})}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">הפעל מפת אתר</span>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">עדיפות</label>
                  <input
                    type="number"
                    min="0"
                    max="1"
                    step="0.1"
                    value={settings.priority}
                    onChange={(e) => setSettings({...settings, priority: parseFloat(e.target.value)})}
                    className="block w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">תדירות שינוי</label>
                  <select
                    value={settings.changeFreq}
                    onChange={(e) => setSettings({...settings, changeFreq: e.target.value})}
                    className="block w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="always">תמיד</option>
                    <option value="hourly">שעתי</option>
                    <option value="daily">יומי</option>
                    <option value="weekly">שבועי</option>
                    <option value="monthly">חודשי</option>
                    <option value="yearly">שנתי</option>
                    <option value="never">לעולם לא</option>
                  </select>
                </div>
              </div>
            </div>

            {/* סוגי תוכן לכלול */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">סוגי תוכן לכלול</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.includePages}
                    onChange={(e) => setSettings({...settings, includePages: e.target.checked})}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">עמודים</span>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.includePosts}
                    onChange={(e) => setSettings({...settings, includePosts: e.target.checked})}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">פוסטים</span>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.includeCategories}
                    onChange={(e) => setSettings({...settings, includeCategories: e.target.checked})}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">קטגוריות</span>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.includePortfolio}
                    onChange={(e) => setSettings({...settings, includePortfolio: e.target.checked})}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">פורטפוליו</span>
                </div>
              </div>
            </div>

            {/* עמודים לא לכלול */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">עמודים לא לכלול</h2>
              
              <div className="mb-4">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newExcludePage}
                    onChange={(e) => setNewExcludePage(e.target.value)}
                    placeholder="לדוגמה: /admin"
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2"
                  />
                  <button
                    onClick={addExcludePage}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    הוסף
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                {settings.excludePages.map((page, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm text-gray-700">{page}</span>
                    <button
                      onClick={() => removeExcludePage(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      מחק
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* נתיבים לא לכלול */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">נתיבים לא לכלול</h2>
              
              <div className="mb-4">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newExcludePath}
                    onChange={(e) => setNewExcludePath(e.target.value)}
                    placeholder="לדוגמה: /api"
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2"
                  />
                  <button
                    onClick={addExcludePath}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    הוסף
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                {settings.excludePaths.map((path, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm text-gray-700">{path}</span>
                    <button
                      onClick={() => removeExcludePath(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      מחק
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* כפתורי פעולה */}
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex space-x-4">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                >
                  {saving ? 'שומר...' : 'שמור הגדרות'}
                </button>
                
                <button
                  onClick={generateSitemap}
                  className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  צור מפת אתר
                </button>
                
                <a
                  href="/sitemap.xml"
                  target="_blank"
                  className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  צפה במפת אתר
                </a>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600">אין הגדרות מפת אתר זמינות</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
} 