'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

interface TopStrip {
  id?: string;
  text: string;
  backgroundColor: string;
  textColor: string;
  isActive: boolean;
  showCloseButton: boolean;
  linkUrl: string;
  linkText: string;
}

export default function TopStripPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [topStrip, setTopStrip] = useState<TopStrip>({
    text: '',
    backgroundColor: '#3b82f6',
    textColor: '#ffffff',
    isActive: false,
    showCloseButton: true,
    linkUrl: '',
    linkText: '',
  });

  useEffect(() => {
    fetchTopStrip();
  }, []);

  const fetchTopStrip = async () => {
    try {
      const response = await fetch('/api/admin/top-strip');
      if (response.ok) {
        const data = await response.json();
        if (data.topStrip) {
          setTopStrip(data.topStrip);
        }
      }
    } catch (error) {
      console.error('Error fetching top strip:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch('/api/admin/top-strip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(topStrip),
      });

      if (response.ok) {
        toast.success('הגדרות הסטריפ העליון נשמרו בהצלחה');
      } else {
        toast.error('שגיאה בשמירת ההגדרות');
      }
    } catch (error) {
      console.error('Error saving top strip:', error);
      toast.error('שגיאה בשמירת ההגדרות');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof TopStrip, value: any) => {
    setTopStrip(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">טוען הגדרות סטריפ עליון...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">ניהול סטריפ עליון</h1>
            <p className="mt-1 text-sm text-gray-600">
              ניהול הסטריפ העליון שמופיע בראש האתר
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* מצב פעיל */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">מצב</h2>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={topStrip.isActive}
                  onChange={(e) => handleChange('isActive', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="mr-2 block text-sm text-gray-900">
                  הסטריפ פעיל
                </label>
              </div>
            </div>

            {/* תוכן */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">תוכן</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    טקסט הסטריפ
                  </label>
                  <textarea
                    value={topStrip.text}
                    onChange={(e) => handleChange('text', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="הכנס את הטקסט שתרצה להציג בסטריפ העליון..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      טקסט הקישור
                    </label>
                    <input
                      type="text"
                      value={topStrip.linkText}
                      onChange={(e) => handleChange('linkText', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="לחץ כאן"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      כתובת הקישור
                    </label>
                    <input
                      type="url"
                      value={topStrip.linkUrl}
                      onChange={(e) => handleChange('linkUrl', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://example.com"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* עיצוב */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">עיצוב</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    צבע רקע
                  </label>
                  <input
                    type="color"
                    value={topStrip.backgroundColor}
                    onChange={(e) => handleChange('backgroundColor', e.target.value)}
                    className="w-full h-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    צבע טקסט
                  </label>
                  <input
                    type="color"
                    value={topStrip.textColor}
                    onChange={(e) => handleChange('textColor', e.target.value)}
                    className="w-full h-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="mt-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="showCloseButton"
                    checked={topStrip.showCloseButton}
                    onChange={(e) => handleChange('showCloseButton', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="showCloseButton" className="mr-2 block text-sm text-gray-900">
                    הצג כפתור סגירה
                  </label>
                </div>
              </div>
            </div>

            {/* תצוגה מקדימה */}
            {topStrip.isActive && topStrip.text && (
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">תצוגה מקדימה</h2>
                <div 
                  className="p-4 rounded-md text-center"
                  style={{
                    backgroundColor: topStrip.backgroundColor,
                    color: topStrip.textColor,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 text-center">
                      <span className="text-sm">{topStrip.text}</span>
                      {topStrip.linkText && topStrip.linkUrl && (
                        <a 
                          href={topStrip.linkUrl}
                          className="mr-2 text-sm underline hover:no-underline"
                          style={{ color: topStrip.textColor }}
                        >
                          {topStrip.linkText}
                        </a>
                      )}
                    </div>
                    {topStrip.showCloseButton && (
                      <button
                        type="button"
                        className="text-sm opacity-70 hover:opacity-100"
                        style={{ color: topStrip.textColor }}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* כפתורי פעולה */}
            <div className="flex justify-end space-x-4 space-x-reverse">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                ביטול
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {saving ? 'שומר...' : 'שמור הגדרות'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 