'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

interface Footer {
  id?: string;
  logo: string;
  logoAlt: string;
  logoWidth: number;
  logoHeight: number;
  description: string;
  backgroundColor: string;
  textColor: string;
  linkColor: string;
  linkHoverColor: string;
  showNewsletter: boolean;
  newsletterTitle: string;
  newsletterDescription: string;
  newsletterPlaceholder: string;
  newsletterButtonText: string;
  showSocialLinks: boolean;
  copyrightText: string;
  columns: FooterColumn[];
}

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

export default function FooterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [footer, setFooter] = useState<Footer>({
    logo: '',
    logoAlt: '',
    logoWidth: 120,
    logoHeight: 40,
    description: '',
    backgroundColor: '#1f2937',
    textColor: '#ffffff',
    linkColor: '#9ca3af',
    linkHoverColor: '#ffffff',
    showNewsletter: true,
    newsletterTitle: 'הישארו מעודכנים',
    newsletterDescription: 'הירשמו לניוזלטר שלנו',
    newsletterPlaceholder: 'האימייל שלכם',
    newsletterButtonText: 'הרשמה',
    showSocialLinks: true,
    copyrightText: '© 2024 AdiPhone. כל הזכויות שמורות.',
    columns: [],
  });

  useEffect(() => {
    fetchFooter();
  }, []);

  const fetchFooter = async () => {
    try {
      const response = await fetch('/api/admin/footer');
      if (response.ok) {
        const data = await response.json();
        if (data.footer) {
          setFooter(data.footer);
        }
      }
    } catch (error) {
      console.error('Error fetching footer:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch('/api/admin/footer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(footer),
      });

      if (response.ok) {
        toast.success('הגדרות הפוטר נשמרו בהצלחה');
      } else {
        toast.error('שגיאה בשמירת ההגדרות');
      }
    } catch (error) {
      console.error('Error saving footer:', error);
      toast.error('שגיאה בשמירת ההגדרות');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof Footer, value: any) => {
    setFooter(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">טוען הגדרות פוטר...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">ניהול פוטר האתר</h1>
            <p className="mt-1 text-sm text-gray-600">
              ניהול לוגו, תוכן, עמודות וקישורי הפוטר
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
                    value={footer.logo}
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
                    value={footer.logoAlt}
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
                    value={footer.logoWidth}
                    onChange={(e) => handleChange('logoWidth', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="50"
                    max="200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    גובה הלוגו (px)
                  </label>
                  <input
                    type="number"
                    value={footer.logoHeight}
                    onChange={(e) => handleChange('logoHeight', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="20"
                    max="80"
                  />
                </div>
              </div>
            </div>

            {/* תיאור */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">תיאור</h2>
              <textarea
                value={footer.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="תיאור קצר על החברה או האתר"
              />
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
                    value={footer.backgroundColor}
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
                    value={footer.textColor}
                    onChange={(e) => handleChange('textColor', e.target.value)}
                    className="w-full h-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    צבע קישורים
                  </label>
                  <input
                    type="color"
                    value={footer.linkColor}
                    onChange={(e) => handleChange('linkColor', e.target.value)}
                    className="w-full h-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    צבע קישורים בהובר
                  </label>
                  <input
                    type="color"
                    value={footer.linkHoverColor}
                    onChange={(e) => handleChange('linkHoverColor', e.target.value)}
                    className="w-full h-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* ניוזלטר */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">ניוזלטר</h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="showNewsletter"
                    checked={footer.showNewsletter}
                    onChange={(e) => handleChange('showNewsletter', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="showNewsletter" className="mr-2 block text-sm text-gray-900">
                    הצג ניוזלטר
                  </label>
                </div>

                {footer.showNewsletter && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        כותרת הניוזלטר
                      </label>
                      <input
                        type="text"
                        value={footer.newsletterTitle}
                        onChange={(e) => handleChange('newsletterTitle', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        טקסט כפתור
                      </label>
                      <input
                        type="text"
                        value={footer.newsletterButtonText}
                        onChange={(e) => handleChange('newsletterButtonText', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        תיאור הניוזלטר
                      </label>
                      <textarea
                        value={footer.newsletterDescription}
                        onChange={(e) => handleChange('newsletterDescription', e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        טקסט placeholder
                      </label>
                      <input
                        type="text"
                        value={footer.newsletterPlaceholder}
                        onChange={(e) => handleChange('newsletterPlaceholder', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* רשתות חברתיות */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">רשתות חברתיות</h2>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="showSocialLinks"
                  checked={footer.showSocialLinks}
                  onChange={(e) => handleChange('showSocialLinks', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="showSocialLinks" className="mr-2 block text-sm text-gray-900">
                  הצג קישורים לרשתות חברתיות
                </label>
              </div>
            </div>

            {/* זכויות יוצרים */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">זכויות יוצרים</h2>
              <input
                type="text"
                value={footer.copyrightText}
                onChange={(e) => handleChange('copyrightText', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="© 2024 AdiPhone. כל הזכויות שמורות."
              />
            </div>

            {/* כפתורי פעולה */}
            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={() => router.push('/admin/footer/columns')}
                className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                ניהול עמודות פוטר →
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