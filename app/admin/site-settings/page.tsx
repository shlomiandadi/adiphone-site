'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

interface SiteSettings {
  id?: string;
  siteName: string;
  siteDescription: string;
  siteKeywords: string;
  siteUrl: string;
  siteLogo: string;
  siteFavicon: string;
  googleAnalyticsId: string;
  googleTagManagerId: string;
  facebookPixelId: string;
  twitterHandle: string;
  facebookPage: string;
  instagramHandle: string;
  linkedinPage: string;
}

export default function SiteSettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<SiteSettings>({
    siteName: 'AdiPhone',
    siteDescription: '',
    siteKeywords: '',
    siteUrl: '',
    siteLogo: '',
    siteFavicon: '',
    googleAnalyticsId: '',
    googleTagManagerId: '',
    facebookPixelId: '',
    twitterHandle: '',
    facebookPage: '',
    instagramHandle: '',
    linkedinPage: '',
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/site-settings');
      if (response.ok) {
        const data = await response.json();
        if (data.settings) {
          setSettings(data.settings);
        }
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch('/api/admin/site-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        toast.success('הגדרות האתר נשמרו בהצלחה');
      } else {
        toast.error('שגיאה בשמירת ההגדרות');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('שגיאה בשמירת ההגדרות');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof SiteSettings, value: string) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">טוען הגדרות...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">הגדרות האתר</h1>
            <p className="mt-1 text-sm text-gray-600">
              ניהול הגדרות כלליות של האתר ותגיות מטא ל-SEO
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* הגדרות בסיסיות */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">הגדרות בסיסיות</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    שם האתר
                  </label>
                  <input
                    type="text"
                    value={settings.siteName}
                    onChange={(e) => handleChange('siteName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    כתובת האתר
                  </label>
                  <input
                    type="url"
                    value={settings.siteUrl}
                    onChange={(e) => handleChange('siteUrl', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    תיאור האתר
                  </label>
                  <textarea
                    value={settings.siteDescription}
                    onChange={(e) => handleChange('siteDescription', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="תיאור קצר של האתר למנועי חיפוש"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    מילות מפתח
                  </label>
                  <input
                    type="text"
                    value={settings.siteKeywords}
                    onChange={(e) => handleChange('siteKeywords', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="מילה1, מילה2, מילה3"
                  />
                </div>
              </div>
            </div>

            {/* לוגו ופאביקון */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">לוגו ופאביקון</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    לוגו האתר
                  </label>
                  <input
                    type="url"
                    value={settings.siteLogo}
                    onChange={(e) => handleChange('siteLogo', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com/logo.png"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    פאביקון
                  </label>
                  <input
                    type="url"
                    value={settings.siteFavicon}
                    onChange={(e) => handleChange('siteFavicon', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com/favicon.ico"
                  />
                </div>
              </div>
            </div>

            {/* כלי מעקב */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">כלי מעקב</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Google Analytics ID
                  </label>
                  <input
                    type="text"
                    value={settings.googleAnalyticsId}
                    onChange={(e) => handleChange('googleAnalyticsId', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="G-XXXXXXXXXX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Google Tag Manager ID
                  </label>
                  <input
                    type="text"
                    value={settings.googleTagManagerId}
                    onChange={(e) => handleChange('googleTagManagerId', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="GTM-XXXXXXX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Facebook Pixel ID
                  </label>
                  <input
                    type="text"
                    value={settings.facebookPixelId}
                    onChange={(e) => handleChange('facebookPixelId', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="XXXXXXXXXX"
                  />
                </div>
              </div>
            </div>

            {/* רשתות חברתיות */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">רשתות חברתיות</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Twitter Handle
                  </label>
                  <input
                    type="text"
                    value={settings.twitterHandle}
                    onChange={(e) => handleChange('twitterHandle', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="@username"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Facebook Page
                  </label>
                  <input
                    type="url"
                    value={settings.facebookPage}
                    onChange={(e) => handleChange('facebookPage', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://facebook.com/pagename"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Instagram Handle
                  </label>
                  <input
                    type="text"
                    value={settings.instagramHandle}
                    onChange={(e) => handleChange('instagramHandle', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="@username"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    LinkedIn Page
                  </label>
                  <input
                    type="url"
                    value={settings.linkedinPage}
                    onChange={(e) => handleChange('linkedinPage', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://linkedin.com/company/name"
                  />
                </div>
              </div>
            </div>

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