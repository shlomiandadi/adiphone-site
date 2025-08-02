'use client';
import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';

interface RobotsSettings {
  id: string;
  userAgent: string;
  allowPaths: string[];
  disallowPaths: string[];
  crawlDelay: number;
  sitemapUrl: string | null;
  isActive: boolean;
}

export default function RobotsPage() {
  const [settings, setSettings] = useState<RobotsSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [newAllowPath, setNewAllowPath] = useState('');
  const [newDisallowPath, setNewDisallowPath] = useState('');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    fetchRobotsSettings();
  }, []);

  const fetchRobotsSettings = async () => {
    try {
      const response = await fetch('/api/admin/robots-settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error('שגיאה בטעינת הגדרות robots.txt:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!settings) return;
    
    setSaving(true);
    try {
      const response = await fetch('/api/admin/robots-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      
      if (response.ok) {
        alert('הגדרות robots.txt נשמרו בהצלחה!');
      }
    } catch (error) {
      console.error('שגיאה בשמירת הגדרות robots.txt:', error);
      alert('שגיאה בשמירת ההגדרות');
    } finally {
      setSaving(false);
    }
  };

  const addAllowPath = () => {
    if (newAllowPath && settings) {
      setSettings({
        ...settings,
        allowPaths: [...settings.allowPaths, newAllowPath]
      });
      setNewAllowPath('');
    }
  };

  const removeAllowPath = (index: number) => {
    if (settings) {
      const updatedPaths = settings.allowPaths.filter((_, i) => i !== index);
      setSettings({ ...settings, allowPaths: updatedPaths });
    }
  };

  const addDisallowPath = () => {
    if (newDisallowPath && settings) {
      setSettings({
        ...settings,
        disallowPaths: [...settings.disallowPaths, newDisallowPath]
      });
      setNewDisallowPath('');
    }
  };

  const removeDisallowPath = (index: number) => {
    if (settings) {
      const updatedPaths = settings.disallowPaths.filter((_, i) => i !== index);
      setSettings({ ...settings, disallowPaths: updatedPaths });
    }
  };

  const generateRobotsTxt = () => {
    if (!settings) return '';
    
    let robotsContent = '';
    
    if (settings.userAgent) {
      robotsContent += `User-agent: ${settings.userAgent}\n`;
    }
    
    if (settings.crawlDelay > 0) {
      robotsContent += `Crawl-delay: ${settings.crawlDelay}\n`;
    }
    
    settings.allowPaths.forEach(path => {
      robotsContent += `Allow: ${path}\n`;
    });
    
    settings.disallowPaths.forEach(path => {
      robotsContent += `Disallow: ${path}\n`;
    });
    
    if (settings.sitemapUrl) {
      robotsContent += `Sitemap: ${settings.sitemapUrl}\n`;
    }
    
    return robotsContent;
  };

  if (!user) return null;

  return (
    <AdminLayout user={user}>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">ניהול Robots.txt</h1>
          <p className="text-gray-600">נהל את הגדרות קובץ robots.txt</p>
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
                    checked={settings.isActive}
                    onChange={(e) => setSettings({...settings, isActive: e.target.checked})}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">הפעל robots.txt</span>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">User Agent</label>
                  <input
                    type="text"
                    value={settings.userAgent}
                    onChange={(e) => setSettings({...settings, userAgent: e.target.value})}
                    className="block w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="*"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Crawl Delay (שניות)</label>
                  <input
                    type="number"
                    min="0"
                    value={settings.crawlDelay}
                    onChange={(e) => setSettings({...settings, crawlDelay: parseInt(e.target.value)})}
                    className="block w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">URL מפת אתר</label>
                  <input
                    type="url"
                    value={settings.sitemapUrl || ''}
                    onChange={(e) => setSettings({...settings, sitemapUrl: e.target.value})}
                    className="block w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="https://adi-phone.co.il/sitemap.xml"
                  />
                </div>
              </div>
            </div>

            {/* נתיבים מותרים */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">נתיבים מותרים (Allow)</h2>
              
              <div className="mb-4">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newAllowPath}
                    onChange={(e) => setNewAllowPath(e.target.value)}
                    placeholder="לדוגמה: /"
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2"
                  />
                  <button
                    onClick={addAllowPath}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    הוסף
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                {settings.allowPaths.map((path, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-green-50 rounded">
                    <span className="text-sm text-gray-700">{path}</span>
                    <button
                      onClick={() => removeAllowPath(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      מחק
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* נתיבים אסורים */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">נתיבים אסורים (Disallow)</h2>
              
              <div className="mb-4">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newDisallowPath}
                    onChange={(e) => setNewDisallowPath(e.target.value)}
                    placeholder="לדוגמה: /admin"
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2"
                  />
                  <button
                    onClick={addDisallowPath}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    הוסף
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                {settings.disallowPaths.map((path, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-red-50 rounded">
                    <span className="text-sm text-gray-700">{path}</span>
                    <button
                      onClick={() => removeDisallowPath(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      מחק
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* תצוגה מקדימה */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">תצוגה מקדימה של robots.txt</h2>
              
              <div className="bg-gray-100 p-4 rounded-lg">
                <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono">
                  {generateRobotsTxt()}
                </pre>
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
                
                <a
                  href="/robots.txt"
                  target="_blank"
                  className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  צפה ב-robots.txt
                </a>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600">אין הגדרות robots.txt זמינות</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
} 