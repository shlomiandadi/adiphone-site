'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'react-hot-toast';

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

interface Menu {
  id: string;
  name: string;
  location: string;
  isActive: boolean;
  menuItems: MenuItem[];
}

export default function MenuItemsPage() {
  const router = useRouter();
  const params = useParams();
  const menuId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [menu, setMenu] = useState<Menu | null>(null);
  const [pages, setPages] = useState<any[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newItem, setNewItem] = useState({
    title: '',
    url: '',
    pageId: '',
    order: 0,
    isActive: true,
    openInNewTab: false,
    icon: '',
    cssClass: '',
    parentId: '',
  });

  useEffect(() => {
    if (menuId) {
      fetchData();
    }
  }, [menuId]);

  const fetchData = async () => {
    try {
      const [menuResponse, pagesResponse] = await Promise.all([
        fetch(`/api/admin/menus/${menuId}`),
        fetch('/api/admin/pages'),
      ]);

      if (menuResponse.ok) {
        const menuData = await menuResponse.json();
        setMenu(menuData.menu);
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

  const handleCreateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`/api/admin/menus/${menuId}/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newItem),
      });

      if (response.ok) {
        toast.success('פריט התפריט נוצר בהצלחה');
        setShowCreateForm(false);
        setNewItem({
          title: '',
          url: '',
          pageId: '',
          order: 0,
          isActive: true,
          openInNewTab: false,
          icon: '',
          cssClass: '',
          parentId: '',
        });
        fetchData();
      } else {
        toast.error('שגיאה ביצירת פריט התפריט');
      }
    } catch (error) {
      console.error('Error creating menu item:', error);
      toast.error('שגיאה ביצירת פריט התפריט');
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm('האם אתה בטוח שברצונך למחוק פריט זה?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/menus/${menuId}/items/${itemId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('פריט התפריט נמחק בהצלחה');
        fetchData();
      } else {
        toast.error('שגיאה במחיקת פריט התפריט');
      }
    } catch (error) {
      console.error('Error deleting menu item:', error);
      toast.error('שגיאה במחיקת פריט התפריט');
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
          <p className="mt-4 text-gray-600">טוען פריטי תפריט...</p>
        </div>
      </div>
    );
  }

  if (!menu) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">התפריט לא נמצא</p>
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
                <h1 className="text-2xl font-bold text-gray-900">ניהול פריטי תפריט</h1>
                <p className="mt-1 text-sm text-gray-600">
                  {menu.name} - {getLocationLabel(menu.location)}
                </p>
              </div>
              <button
                onClick={() => setShowCreateForm(true)}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                הוסף פריט חדש
              </button>
            </div>
          </div>

          {/* טופס יצירת פריט */}
          {showCreateForm && (
            <div className="p-6 border-b border-gray-200">
              <form onSubmit={handleCreateItem} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      כותרת הפריט
                    </label>
                    <input
                      type="text"
                      value={newItem.title}
                      onChange={(e) => setNewItem(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      קישור
                    </label>
                    <input
                      type="text"
                      value={newItem.url}
                      onChange={(e) => setNewItem(prev => ({ ...prev, url: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="/page"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      עמוד (אופציונלי)
                    </label>
                    <select
                      value={newItem.pageId}
                      onChange={(e) => setNewItem(prev => ({ ...prev, pageId: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">בחר עמוד</option>
                      {pages.map((page) => (
                        <option key={page.id} value={page.id}>
                          {page.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      סדר
                    </label>
                    <input
                      type="number"
                      value={newItem.order}
                      onChange={(e) => setNewItem(prev => ({ ...prev, order: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      אייקון (CSS class)
                    </label>
                    <input
                      type="text"
                      value={newItem.icon}
                      onChange={(e) => setNewItem(prev => ({ ...prev, icon: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="fas fa-home"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CSS Class
                    </label>
                    <input
                      type="text"
                      value={newItem.cssClass}
                      onChange={(e) => setNewItem(prev => ({ ...prev, cssClass: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="custom-class"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-4 space-x-reverse">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={newItem.isActive}
                      onChange={(e) => setNewItem(prev => ({ ...prev, isActive: e.target.checked }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isActive" className="mr-2 block text-sm text-gray-900">
                      פעיל
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="openInNewTab"
                      checked={newItem.openInNewTab}
                      onChange={(e) => setNewItem(prev => ({ ...prev, openInNewTab: e.target.checked }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="openInNewTab" className="mr-2 block text-sm text-gray-900">
                      פתח בטאב חדש
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
                    צור פריט
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* רשימת פריטי תפריט */}
          <div className="p-6">
            {menu.menuItems.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">אין פריטי תפריט עדיין</p>
              </div>
            ) : (
              <div className="space-y-4">
                {menu.menuItems.map((item) => (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-4 space-x-reverse">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">{item.title}</h3>
                          <p className="text-sm text-gray-500">
                            {item.url || 'ללא קישור'} • סדר: {item.order}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 space-x-reverse">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          item.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {item.isActive ? 'פעיל' : 'לא פעיל'}
                        </span>
                        <button
                          onClick={() => router.push(`/admin/menus/${menuId}/items/${item.id}/edit`)}
                          className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                        >
                          ערוך
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="text-red-600 hover:text-red-900 text-sm font-medium"
                        >
                          מחק
                        </button>
                      </div>
                    </div>

                    {item.children && item.children.length > 0 && (
                      <div className="mt-4 bg-gray-50 rounded-md p-3">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">תת-פריטים:</h4>
                        <div className="space-y-2">
                          {item.children.map((child) => (
                            <div key={child.id} className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">{child.title}</span>
                              <span className="text-gray-400">{child.url || 'ללא קישור'}</span>
                            </div>
                          ))}
                        </div>
                      </div>
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