'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

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

export default function MenusPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [pages, setPages] = useState<any[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newMenu, setNewMenu] = useState({
    name: '',
    location: 'HEADER_MAIN',
    isActive: true,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [menusResponse, pagesResponse] = await Promise.all([
        fetch('/api/admin/menus'),
        fetch('/api/admin/pages'),
      ]);

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

  const handleCreateMenu = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/admin/menus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMenu),
      });

      if (response.ok) {
        toast.success('התפריט נוצר בהצלחה');
        setShowCreateForm(false);
        setNewMenu({ name: '', location: 'HEADER_MAIN', isActive: true });
        fetchData();
      } else {
        toast.error('שגיאה ביצירת התפריט');
      }
    } catch (error) {
      console.error('Error creating menu:', error);
      toast.error('שגיאה ביצירת התפריט');
    }
  };

  const handleDeleteMenu = async (menuId: string) => {
    if (!confirm('האם אתה בטוח שברצונך למחוק תפריט זה?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/menus/${menuId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('התפריט נמחק בהצלחה');
        fetchData();
      } else {
        toast.error('שגיאה במחיקת התפריט');
      }
    } catch (error) {
      console.error('Error deleting menu:', error);
      toast.error('שגיאה במחיקת התפריט');
    }
  };

  const getLocationLabel = (location: string) => {
    const locations = {
      HEADER_MAIN: 'הדר ראשי',
      HEADER_SECONDARY: 'הדר משני',
      FOOTER_MAIN: 'פוטר ראשי',
      FOOTER_SECONDARY: 'פוטר משני',
      MOBILE: 'נייד',
    };
    return locations[location as keyof typeof locations] || location;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">טוען תפריטים...</p>
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
                <h1 className="text-2xl font-bold text-gray-900">ניהול תפריטים</h1>
                <p className="mt-1 text-sm text-gray-600">
                  ניהול תפריטי הניווט באתר
                </p>
              </div>
              <button
                onClick={() => setShowCreateForm(true)}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                צור תפריט חדש
              </button>
            </div>
          </div>

          {/* טופס יצירת תפריט */}
          {showCreateForm && (
            <div className="p-6 border-b border-gray-200">
              <form onSubmit={handleCreateMenu} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      שם התפריט
                    </label>
                    <input
                      type="text"
                      value={newMenu.name}
                      onChange={(e) => setNewMenu(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      מיקום
                    </label>
                    <select
                      value={newMenu.location}
                      onChange={(e) => setNewMenu(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="HEADER_MAIN">הדר ראשי</option>
                      <option value="HEADER_SECONDARY">הדר משני</option>
                      <option value="FOOTER_MAIN">פוטר ראשי</option>
                      <option value="FOOTER_SECONDARY">פוטר משני</option>
                      <option value="MOBILE">נייד</option>
                    </select>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={newMenu.isActive}
                      onChange={(e) => setNewMenu(prev => ({ ...prev, isActive: e.target.checked }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isActive" className="mr-2 block text-sm text-gray-900">
                      פעיל
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
                    צור תפריט
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* רשימת תפריטים */}
          <div className="p-6">
            {menus.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">אין תפריטים עדיין</p>
              </div>
            ) : (
              <div className="space-y-6">
                {menus.map((menu) => (
                  <div key={menu.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{menu.name}</h3>
                        <p className="text-sm text-gray-500">
                          מיקום: {getLocationLabel(menu.location)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4 space-x-reverse">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          menu.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {menu.isActive ? 'פעיל' : 'לא פעיל'}
                        </span>
                        <button
                          onClick={() => router.push(`/admin/menus/${menu.id}`)}
                          className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                        >
                          ערוך פריטים
                        </button>
                        <button
                          onClick={() => handleDeleteMenu(menu.id)}
                          className="text-red-600 hover:text-red-900 text-sm font-medium"
                        >
                          מחק
                        </button>
                      </div>
                    </div>

                    {menu.menuItems.length > 0 ? (
                      <div className="bg-gray-50 rounded-md p-3">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">פריטי תפריט:</h4>
                        <div className="space-y-1">
                          {menu.menuItems.map((item) => (
                            <div key={item.id} className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">{item.title}</span>
                              <span className="text-gray-400">{item.url || 'ללא קישור'}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">אין פריטי תפריט</p>
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