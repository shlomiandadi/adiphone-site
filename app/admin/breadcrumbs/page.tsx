'use client';
import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';

interface BreadcrumbItem {
  title: string;
  url: string;
  isActive: boolean;
}

interface Breadcrumb {
  id: string;
  pageSlug: string;
  breadcrumbData: BreadcrumbItem[];
  isActive: boolean;
}

export default function BreadcrumbsPage() {
  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Breadcrumb>>({});
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    }
    fetchBreadcrumbs();
  }, []);

  const fetchBreadcrumbs = async () => {
    try {
      const response = await fetch('/api/admin/breadcrumbs');
      if (response.ok) {
        const data = await response.json();
        setBreadcrumbs(data);
      }
    } catch (error) {
      console.error('שגיאה בטעינת פירורי לחם:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: Breadcrumb) => {
    setEditingId(item.id);
    setFormData(item);
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/admin/breadcrumbs/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        setEditingId(null);
        setFormData({});
        fetchBreadcrumbs();
      }
    } catch (error) {
      console.error('שגיאה בעדכון פירורי לחם:', error);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({});
  };

  const addBreadcrumbItem = () => {
    const newItem: BreadcrumbItem = {
      title: '',
      url: '',
      isActive: false
    };
    
    const currentData = formData.breadcrumbData || [];
    setFormData({
      ...formData,
      breadcrumbData: [...currentData, newItem]
    });
  };

  const updateBreadcrumbItem = (index: number, field: keyof BreadcrumbItem, value: any) => {
    const currentData = [...(formData.breadcrumbData || [])];
    currentData[index] = { ...currentData[index], [field]: value };
    setFormData({ ...formData, breadcrumbData: currentData });
  };

  const removeBreadcrumbItem = (index: number) => {
    const currentData = [...(formData.breadcrumbData || [])];
    currentData.splice(index, 1);
    setFormData({ ...formData, breadcrumbData: currentData });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">טוען...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout user={user}>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">ניהול פירורי לחם</h1>
          <p className="text-gray-600">נהל את ניווט פירורי הלחם באתר</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg p-6">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900">פירורי לחם קיימים</h2>
              <p className="text-sm text-gray-600">לחץ על "ערוך" כדי לשנות פירורי לחם</p>
            </div>
            
            {breadcrumbs.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">אין פירורי לחם זמינים</p>
              </div>
            ) : (
              <div className="space-y-4">
                {breadcrumbs.map((breadcrumb) => (
                  <div key={breadcrumb.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-medium text-gray-900">{breadcrumb.pageSlug}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`px-2 py-1 text-xs rounded-full ${breadcrumb.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {breadcrumb.isActive ? 'פעיל' : 'לא פעיל'}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleEdit(breadcrumb)}
                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        ערוך
                      </button>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      {breadcrumb.breadcrumbData.map((item, index) => (
                        <div key={index} className="flex items-center">
                          <span className={item.isActive ? 'font-medium text-blue-600' : 'text-gray-500'}>
                            {item.title}
                          </span>
                          {index < breadcrumb.breadcrumbData.length - 1 && (
                            <span className="mx-2 text-gray-400">/</span>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    {editingId === breadcrumb.id && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">נתיב עמוד</label>
                          <input
                            type="text"
                            value={formData.pageSlug || ''}
                            onChange={(e) => setFormData({...formData, pageSlug: e.target.value})}
                            className="block w-full border border-gray-300 rounded-md px-3 py-2"
                          />
                        </div>
                        
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-medium text-gray-700">פירורי לחם</label>
                            <button
                              onClick={addBreadcrumbItem}
                              className="px-2 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                            >
                              הוסף פריט
                            </button>
                          </div>
                          
                          <div className="space-y-2">
                            {(formData.breadcrumbData || []).map((item, index) => (
                              <div key={index} className="flex items-center space-x-2">
                                <input
                                  type="text"
                                  placeholder="כותרת"
                                  value={item.title}
                                  onChange={(e) => updateBreadcrumbItem(index, 'title', e.target.value)}
                                  className="flex-1 border border-gray-300 rounded-md px-3 py-2"
                                />
                                <input
                                  type="text"
                                  placeholder="URL"
                                  value={item.url}
                                  onChange={(e) => updateBreadcrumbItem(index, 'url', e.target.value)}
                                  className="flex-1 border border-gray-300 rounded-md px-3 py-2"
                                />
                                <label className="flex items-center">
                                  <input
                                    type="checkbox"
                                    checked={item.isActive}
                                    onChange={(e) => updateBreadcrumbItem(index, 'isActive', e.target.checked)}
                                    className="mr-1"
                                  />
                                  <span className="text-sm text-gray-700">פעיל</span>
                                </label>
                                <button
                                  onClick={() => removeBreadcrumbItem(index)}
                                  className="px-2 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                                >
                                  מחק
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4 mb-4">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={formData.isActive || false}
                              onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                              className="mr-2"
                            />
                            <span className="text-sm text-gray-700">פעיל</span>
                          </label>
                        </div>
                        
                        <div className="flex space-x-2">
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
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
} 