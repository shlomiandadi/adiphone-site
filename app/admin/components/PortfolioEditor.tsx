'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Link from 'next/link';

// Dynamic import for React Quill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { 
  ssr: false,
  loading: () => <div className="h-64 bg-gray-100 rounded animate-pulse"></div>
});

import 'react-quill/dist/quill.snow.css';

interface PortfolioData {
  name: string;
  description: string;
  descriptionRich: string;
  url: string;
  date: string;
  technologies: string;
  image: string;
  images: string;
  metaTitle: string;
  metaDesc: string;
  published: boolean;
  slug: string;
}

interface PortfolioEditorProps {
  mode: 'create' | 'edit';
  projectId?: string;
}

export default function PortfolioEditor({ mode, projectId }: PortfolioEditorProps) {
  const router = useRouter();
  const [projectData, setProjectData] = useState<PortfolioData>({
    name: '',
    description: '',
    descriptionRich: '',
    url: '',
    date: new Date().toISOString().split('T')[0],
    technologies: '',
    image: '',
    images: '',
    metaTitle: '',
    metaDesc: '',
    published: false,
    slug: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (mode === 'edit' && projectId) {
      fetchProject();
    }
  }, [mode, projectId]);

  const fetchProject = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/portfolio/${projectId}?admin=true`);
      if (response.ok) {
        const project = await response.json();
        setProjectData({
          name: project.name || '',
          description: project.description || '',
          descriptionRich: project.descriptionRich || '',
          url: project.url || '',
          date: project.date ? new Date(project.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          technologies: Array.isArray(project.technologies) ? project.technologies.join(', ') : project.technologies || '',
          image: project.image || '',
          images: Array.isArray(project.images) ? project.images.join(', ') : project.images || '',
          metaTitle: project.metaTitle || '',
          metaDesc: project.metaDesc || '',
          published: project.published || false,
          slug: project.slug || ''
        });
      }
    } catch (error) {
      setError('שגיאה בטעינת הפרויקט');
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^\u0590-\u05FFa-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setProjectData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));

    // יצירת slug אוטומטית מהשם
    if (name === 'name' && !projectData.slug) {
      setProjectData(prev => ({
        ...prev,
        slug: generateSlug(value)
      }));
    }
  };

  const handleContentChange = (content: string) => {
    setProjectData(prev => ({
      ...prev,
      descriptionRich: content
    }));
  };

  const handleSave = async (publish: boolean = false) => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const finalData = {
        ...projectData,
        published: publish ? true : projectData.published,
        technologies: projectData.technologies.split(',').map(tech => tech.trim()).filter(tech => tech),
        images: projectData.images.split(',').map(img => img.trim()).filter(img => img)
      };

      console.log('Sending portfolio data:', finalData);

      const url = mode === 'create' ? '/api/portfolio' : `/api/portfolio/${projectId}`;
      const method = mode === 'create' ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalData),
      });

      if (response.ok) {
        const result = await response.json();
        setSuccess(publish ? 'הפרויקט פורסם בהצלחה!' : 'הפרויקט נשמר כטיוטה!');
        
        if (mode === 'create') {
          setTimeout(() => {
            router.push('/admin/portfolio');
          }, 1500);
        }
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'שגיאה בשמירת הפרויקט');
      }
    } catch (error) {
      setError('שגיאה בחיבור לשרת');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="space-y-4">
              <div className="h-12 bg-gray-200 rounded"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {mode === 'create' ? 'פרויקט חדש' : 'עריכת פרויקט'}
              </h1>
            </div>
            <div className="flex items-center space-x-4 space-x-reverse">
              <Link
                href="/admin/portfolio"
                className="text-gray-600 hover:text-gray-900 text-sm"
              >
                חזרה לפרויקטים
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Editor */}
          <div className="lg:col-span-2 space-y-6">
            {/* Messages */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                {error}
              </div>
            )}
            
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
                {success}
              </div>
            )}

            {/* Project Name */}
            <div className="bg-white rounded-lg shadow p-6">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                שם הפרויקט *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={projectData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="הכנס שם לפרויקט..."
                required
              />
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg shadow p-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                תיאור קצר *
              </label>
              <textarea
                id="description"
                name="description"
                value={projectData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="תיאור קצר של הפרויקט..."
                required
              />
            </div>

            {/* Rich Description */}
            <div className="bg-white rounded-lg shadow p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                תיאור מפורט
              </label>
              <div className="border border-gray-300 rounded-md">
                <ReactQuill
                  value={projectData.descriptionRich}
                  onChange={handleContentChange}
                  placeholder="כתוב תיאור מפורט של הפרויקט כאן..."
                  modules={{
                    toolbar: [
                      [{ 'header': [1, 2, 3, false] }],
                      ['bold', 'italic', 'underline', 'strike'],
                      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                      [{ 'color': [] }, { 'background': [] }],
                      ['link', 'image'],
                      ['clean']
                    ]
                  }}
                  style={{ height: '300px' }}
                />
              </div>
            </div>

            {/* Project URL */}
            <div className="bg-white rounded-lg shadow p-6">
              <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
                כתובת הפרויקט
              </label>
              <input
                type="url"
                id="url"
                name="url"
                value={projectData.url}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com"
              />
            </div>

            {/* Project Date */}
            <div className="bg-white rounded-lg shadow p-6">
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                תאריך הפרויקט
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={projectData.date}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Technologies */}
            <div className="bg-white rounded-lg shadow p-6">
              <label htmlFor="technologies" className="block text-sm font-medium text-gray-700 mb-2">
                טכנולוגיות
              </label>
              <input
                type="text"
                id="technologies"
                name="technologies"
                value={projectData.technologies}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="React, Node.js, MongoDB (מופרדות בפסיקים)"
              />
            </div>

            {/* Main Image */}
            <div className="bg-white rounded-lg shadow p-6">
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                תמונה ראשית
              </label>
              <input
                type="url"
                id="image"
                name="image"
                value={projectData.image}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/image.jpg"
              />
              {projectData.image && (
                <div className="mt-2">
                  <img 
                    src={projectData.image} 
                    alt="תמונה ראשית" 
                    className="w-32 h-32 object-cover rounded"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>

            {/* Additional Images */}
            <div className="bg-white rounded-lg shadow p-6">
              <label htmlFor="images" className="block text-sm font-medium text-gray-700 mb-2">
                תמונות נוספות
              </label>
              <input
                type="text"
                id="images"
                name="images"
                value={projectData.images}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
              />
              <p className="text-sm text-gray-500 mt-1">הפרד כתובות URL בפסיקים</p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publish Settings */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">הגדרות פרסום</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="published"
                      checked={projectData.published}
                      onChange={handleInputChange}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="mr-2 text-sm text-gray-700">פרסם מיד</span>
                  </label>
                </div>

                <div className="flex space-x-2 space-x-reverse">
                  <button
                    onClick={() => handleSave(false)}
                    disabled={saving}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
                  >
                    {saving ? 'שומר...' : 'שמור כטיוטה'}
                  </button>
                  
                  <button
                    onClick={() => handleSave(true)}
                    disabled={saving}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
                  >
                    {saving ? 'מפרסם...' : 'פרסם'}
                  </button>
                </div>
              </div>
            </div>

            {/* SEO Settings */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">הגדרות SEO</h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
                    URL ידידותי
                  </label>
                  <input
                    type="text"
                    id="slug"
                    name="slug"
                    value={projectData.slug}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="url-ידידותי"
                  />
                </div>

                <div>
                  <label htmlFor="metaTitle" className="block text-sm font-medium text-gray-700 mb-1">
                    כותרת Meta
                  </label>
                  <input
                    type="text"
                    id="metaTitle"
                    name="metaTitle"
                    value={projectData.metaTitle}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="כותרת למנועי חיפוש"
                  />
                </div>

                <div>
                  <label htmlFor="metaDesc" className="block text-sm font-medium text-gray-700 mb-1">
                    תיאור Meta
                  </label>
                  <textarea
                    id="metaDesc"
                    name="metaDesc"
                    value={projectData.metaDesc}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="תיאור קצר למנועי חיפוש"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 