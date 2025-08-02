'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

interface Header {
  id?: string;
  logo: string;
  logoAlt: string;
  logoWidth: number;
  logoHeight: number;
  showSearch: boolean;
  searchPlaceholder: string;
  showContactButton: boolean;
  contactButtonText: string;
  contactButtonLink: string;
  backgroundColor: string;
  textColor: string;
  stickyHeader: boolean;
  showLanguageSwitcher: boolean;
  languages: string[];
}

interface Menu {
  id: string;
  name: string;
  location: string;
  isActive: boolean;
  menuItems: MenuItem[];
}

interface MenuItem {
  id: string;
  title: string;
  url: string;
  pageId: string;
  order: number;
  isActive: boolean;
  openInNewTab: boolean;
  icon: string;
  cssClass: string;
  children: MenuItem[];
}

export default function HeaderPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [header, setHeader] = useState<Header>({
    logo: '',
    logoAlt: '',
    logoWidth: 150,
    logoHeight: 50,
    showSearch: true,
    searchPlaceholder: 'חיפוש...',
    showContactButton: true,
    contactButtonText: 'צור קשר',
    contactButtonLink: '/contact',
    backgroundColor: '#ffffff',
    textColor: '#000000',
    stickyHeader: true,
    showLanguageSwitcher: false,
    languages: [],
  });
  const [menus, setMenus] = useState<Menu[]>([]);
  const [pages, setPages] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [headerResponse, menusResponse, pagesResponse] = await Promise.all([
        fetch('/api/admin/header'),
        fetch('/api/admin/menus'),
        fetch('/api/admin/pages'),
      ]);

      if (headerResponse.ok) {
        const headerData = await headerResponse.json();
        if (headerData.header) {
          setHeader(headerData.header);
        }
      }

      if (menusResponse.ok) {
        const menusData = await menusResponse.json();
        setMenus(menusData.menus || []);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch('/api/admin/header', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(header),
      });

      if (response.ok) {
        toast.success('הגדרות ההדר נשמרו בהצלחה');
      } else {
        toast.error('שגיאה בשמירת ההגדרות');
      }
    } catch (error) {
      console.error('Error saving header:', error);
      toast.error('שגיאה בשמירת ההגדרות');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof Header, value: any) => {
    setHeader(prev => ({ ...prev, [field]: value }));
  };

  const handleLanguagesChange = (languages: string) => {
    const languagesArray = languages.split(',').map(lang => lang.trim()).filter(lang => lang);
    setHeader(prev => ({ ...prev, languages: languagesArray }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">טוען הגדרות הדר...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">ניהול הדר האתר</h1>
            <p className="mt-1 text-sm text-gray-600">
              ניהול לוגו, תפריטים, חיפוש ועיצוב ההדר
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* לוגו */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">לוגו</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    כתובת הלוגו
                  </label>
                  <input
                    type="url"
                    value={header.logo}
                    onChange={(e) => handleChange('logo', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com/logo.png"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    טקסט חלופי ללוגו
                  </label>
                  <input
                    type="text"
                    value={header.logoAlt}
                    onChange={(e) => handleChange('logoAlt', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="AdiPhone Logo"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    רוחב הלוגו (px)
                  </label>
                  <input
                    type="number"
                    value={header.logoWidth}
                    onChange={(e) => handleChange('logoWidth', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="50"
                    max="300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    גובה הלוגו (px)
                  </label>
                  <input
                    type="number"
                    value={header.logoHeight}
                    onChange={(e) => handleChange('logoHeight', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="30"
                    max="100"
                  />
                </div>
              </div>
            </div>

            {/* חיפוש */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">חיפוש</h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="showSearch"
                    checked={header.showSearch}
                    onChange={(e) => handleChange('showSearch', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="showSearch" className="mr-2 block text-sm text-gray-900">
                    הצג חיפוש
                  </label>
                </div>

                {header.showSearch && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      טקסט placeholder לחיפוש
                    </label>
                    <input
                      type="text"
                      value={header.searchPlaceholder}
                      onChange={(e) => handleChange('searchPlaceholder', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* כפתור צור קשר */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">כפתור צור קשר</h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="showContactButton"
                    checked={header.showContactButton}
                    onChange={(e) => handleChange('showContactButton', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="showContactButton" className="mr-2 block text-sm text-gray-900">
                    הצג כפתור צור קשר
                  </label>
                </div>

                {header.showContactButton && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        טקסט הכפתור
                      </label>
                      <input
                        type="text"
                        value={header.contactButtonText}
                        onChange={(e) => handleChange('contactButtonText', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        קישור הכפתור
                      </label>
                      <input
                        type="text"
                        value={header.contactButtonLink}
                        onChange={(e) => handleChange('contactButtonLink', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="/contact"
                      />
                    </div>
                  </div>
                )}
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
                    value={header.backgroundColor}
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
                    value={header.textColor}
                    onChange={(e) => handleChange('textColor', e.target.value)}
                    className="w-full h-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="mt-4 space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="stickyHeader"
                    checked={header.stickyHeader}
                    onChange={(e) => handleChange('stickyHeader', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="stickyHeader" className="mr-2 block text-sm text-gray-900">
                    הדר דביק (sticky)
                  </label>
                </div>
              </div>
            </div>

            {/* החלפת שפה */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">החלפת שפה</h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="showLanguageSwitcher"
                    checked={header.showLanguageSwitcher}
                    onChange={(e) => handleChange('showLanguageSwitcher', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="showLanguageSwitcher" className="mr-2 block text-sm text-gray-900">
                    הצג החלפת שפה
                  </label>
                </div>

                {header.showLanguageSwitcher && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      שפות זמינות (מופרדות בפסיקים)
                    </label>
                    <input
                      type="text"
                      value={header.languages.join(', ')}
                      onChange={(e) => handleLanguagesChange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="עברית, English, العربية"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* כפתורי פעולה */}
            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={() => router.push('/admin/menus')}
                className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                ניהול תפריטים →
              </button>

              <div className="flex space-x-4 space-x-reverse">
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
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 