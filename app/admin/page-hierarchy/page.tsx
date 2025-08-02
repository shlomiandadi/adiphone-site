'use client';
import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useAdminAuth } from '../../../lib/useAdminAuth';

interface PageHierarchy {
  id: string;
  pageId: string;
  pageSlug: string;
  pageTitle: string;
  parentId: string | null;
  level: number;
  order: number;
  isActive: boolean;
  showInBreadcrumb: boolean;
  breadcrumbTitle: string | null;
  children?: PageHierarchy[];
}

export default function PageHierarchyPage() {
  const [hierarchy, setHierarchy] = useState<PageHierarchy[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<PageHierarchy>>({});
  const { user, loading: authLoading } = useAdminAuth();

  useEffect(() => {
    if (!authLoading) {
      fetchHierarchy();
    }
  }, [authLoading]);

  const fetchHierarchy = async () => {
    try {
      const response = await fetch('/api/admin/page-hierarchy');
      if (response.ok) {
        const data = await response.json();
        setHierarchy(data);
      }
    } catch (error) {
      console.error('שגיאה בטעינת היררכיה:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: PageHierarchy) => {
    setEditingId(item.id);
    setFormData(item);
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/admin/page-hierarchy/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        setEditingId(null);
        setFormData({});
        fetchHierarchy();
      }
    } catch (error) {
      console.error('שגיאה בעדכון היררכיה:', error);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({});
  };

  const renderHierarchyTree = (items: PageHierarchy[], level = 0) => {
    return items.map((item) => (
      <div key={item.id} className="border-l-2 border-gray-200 pl-4 mb-2">
        <div className={`flex items-center justify-between p-3 bg-white rounded-lg shadow-sm ${level > 0 ? 'ml-4' : ''}`}>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">רמה {item.level}</span>
              <span className="text-sm text-gray-500">סדר {item.order}</span>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">{item.pageTitle}</h3>
              <p className="text-sm text-gray-500">{item.pageSlug}</p>
              {item.breadcrumbTitle && (
                <p className="text-xs text-blue-600">פירור: {item.breadcrumbTitle}</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 text-xs rounded-full ${item.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {item.isActive ? 'פעיל' : 'לא פעיל'}
            </span>
            <span className={`px-2 py-1 text-xs rounded-full ${item.showInBreadcrumb ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
              {item.showInBreadcrumb ? 'בפירורים' : 'לא בפירורים'}
            </span>
            <button
              onClick={() => handleEdit(item)}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              ערוך
            </button>
          </div>
        </div>
        
        {editingId === item.id && (
          <div className="mt-3 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">כותרת עמוד</label>
                <input
                  type="text"
                  value={formData.pageTitle || ''}
                  onChange={(e) => setFormData({...formData, pageTitle: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">כותרת בפירורים</label>
                <input
                  type="text"
                  value={formData.breadcrumbTitle || ''}
                  onChange={(e) => setFormData({...formData, breadcrumbTitle: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">רמה</label>
                <input
                  type="number"
                  value={formData.level || 0}
                  onChange={(e) => setFormData({...formData, level: parseInt(e.target.value)})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">סדר</label>
                <input
                  type="number"
                  value={formData.order || 0}
                  onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isActive || false}
                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">פעיל</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.showInBreadcrumb || false}
                    onChange={(e) => setFormData({...formData, showInBreadcrumb: e.target.checked})}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">הצג בפירורים</span>
                </label>
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
        
        {item.children && item.children.length > 0 && (
          <div className="mt-2">
            {renderHierarchyTree(item.children, level + 1)}
          </div>
        )}
      </div>
    ));
  };

  console.log('Page Hierarchy Component Rendered');
  console.log('Current user state:', user);
  console.log('Current loading state:', loading);
  console.log('Current hierarchy state:', hierarchy);
  
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">לא מאומת</h1>
          <p className="text-gray-600 mb-4">עליך להתחבר כדי לגשת לדף זה</p>
          <a href="/admin/login" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            התחבר
          </a>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout user={user}>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">היררכיה של עמודים</h1>
          <p className="text-gray-600">נהל את מבנה העמודים והיחסים ביניהם</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg p-6">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900">מבנה העמודים</h2>
              <p className="text-sm text-gray-600">לחץ על "ערוך" כדי לשנות הגדרות עמוד</p>
            </div>
            
            {hierarchy.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">אין נתוני היררכיה זמינים</p>
              </div>
            ) : (
              <div className="space-y-2">
                {renderHierarchyTree(hierarchy)}
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
} 