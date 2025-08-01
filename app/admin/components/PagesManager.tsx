'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import TemplateForm from './TemplateForm';

interface Page {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  template: string;
  published: boolean;
  order: number;
  metaTitle?: string;
  metaDesc?: string;
  metaKeywords?: string;
  featuredImage?: string;
  // שדות מותאמים לתבניות
  heroTitle?: string;
  heroSubtitle?: string;
  heroImage?: string;
  heroButtonText?: string;
  heroButtonLink?: string;
  // שדות לשירותים
  serviceFeatures?: any[];
  serviceBenefits?: any[];
  servicePricing?: any[];
  // שדות לאודות
  aboutImage?: string;
  aboutStats?: any[];
  teamMembers?: any[];
  // שדות לצור קשר
  contactInfo?: any;
  contactForm?: any;
  // שדות לדף נחיתה
  landingSections?: any[];
  testimonials?: any[];
  // שדות לבלוג
  blogAuthor?: string;
  blogCategory?: string;
  blogTags?: string[];
  createdAt: string;
  updatedAt: string;
}

interface PageFormData {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  template: string;
  published: boolean;
  order: number;
  metaTitle: string;
  metaDesc: string;
  metaKeywords: string;
  featuredImage: string;
  // שדות מותאמים לתבניות
  heroTitle?: string;
  heroSubtitle?: string;
  heroImage?: string;
  heroButtonText?: string;
  heroButtonLink?: string;
  // שדות לשירותים
  serviceFeatures?: any[];
  serviceBenefits?: any[];
  servicePricing?: any[];
  // שדות לאודות
  aboutImage?: string;
  aboutStats?: any[];
  teamMembers?: any[];
  // שדות לצור קשר
  contactInfo?: any;
  contactForm?: any;
  // שדות לדף נחיתה
  landingSections?: any[];
  testimonials?: any[];
  // שדות לבלוג
  blogAuthor?: string;
  blogCategory?: string;
  blogTags?: string[];
}

const TEMPLATE_OPTIONS = [
  { value: 'GENERAL', label: 'דף כללי' },
  { value: 'SERVICE', label: 'דף שירות' },
  { value: 'ABOUT', label: 'דף אודות' },
  { value: 'CONTACT', label: 'דף צור קשר' },
  { value: 'LANDING', label: 'דף נחיתה' },
  { value: 'BLOG', label: 'דף בלוג' }
];

export default function PagesManager() {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const [formData, setFormData] = useState<PageFormData>({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    template: 'GENERAL',
    published: true,
    order: 0,
    metaTitle: '',
    metaDesc: '',
    metaKeywords: '',
    featuredImage: '',
    // שדות מותאמים לתבניות
    heroTitle: '',
    heroSubtitle: '',
    heroImage: '',
    heroButtonText: '',
    heroButtonLink: '',
    // שדות לשירותים
    serviceFeatures: [],
    serviceBenefits: [],
    servicePricing: [],
    // שדות לאודות
    aboutImage: '',
    aboutStats: [],
    teamMembers: [],
    // שדות לצור קשר
    contactInfo: {},
    contactForm: {},
    // שדות לדף נחיתה
    landingSections: [],
    testimonials: [],
    // שדות לבלוג
    blogAuthor: '',
    blogCategory: '',
    blogTags: []
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [templateFilter, setTemplateFilter] = useState('');

  useEffect(() => {
    fetchPages();
  }, [searchTerm, templateFilter]);

  const fetchPages = async () => {
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (templateFilter) params.append('template', templateFilter);
      
      const response = await fetch(`/api/admin/pages?${params}`);
      if (response.ok) {
        const data = await response.json();
        setPages(data.pages || []);
      }
    } catch (error) {
      setError('שגיאה בטעינת הדפים');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const url = editingPage 
        ? `/api/admin/pages/${editingPage.id}`
        : '/api/admin/pages';
      
      const method = editingPage ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        setSuccess(editingPage ? 'דף עודכן בהצלחה!' : 'דף נוצר בהצלחה!');
        resetForm();
        fetchPages();
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'שגיאה בשמירת הדף');
      }
    } catch (error) {
      setError('שגיאה בחיבור לשרת');
    }
  };

  const handleEdit = (page: Page) => {
    setEditingPage(page);
    setFormData({
      title: page.title,
      slug: page.slug,
      content: page.content,
      excerpt: page.excerpt || '',
      template: page.template,
      published: page.published,
      order: page.order,
      metaTitle: page.metaTitle || '',
      metaDesc: page.metaDesc || '',
      metaKeywords: page.metaKeywords || '',
      featuredImage: page.featuredImage || '',
      // שדות מותאמים לתבניות
      heroTitle: page.heroTitle || '',
      heroSubtitle: page.heroSubtitle || '',
      heroImage: page.heroImage || '',
      heroButtonText: page.heroButtonText || '',
      heroButtonLink: page.heroButtonLink || '',
      // שדות לשירותים
      serviceFeatures: page.serviceFeatures || [],
      serviceBenefits: page.serviceBenefits || [],
      servicePricing: page.servicePricing || [],
      // שדות לאודות
      aboutImage: page.aboutImage || '',
      aboutStats: page.aboutStats || [],
      teamMembers: page.teamMembers || [],
      // שדות לצור קשר
      contactInfo: page.contactInfo || {},
      contactForm: page.contactForm || {},
      // שדות לדף נחיתה
      landingSections: page.landingSections || [],
      testimonials: page.testimonials || [],
      // שדות לבלוג
      blogAuthor: page.blogAuthor || '',
      blogCategory: page.blogCategory || '',
      blogTags: page.blogTags || []
    });
    setShowForm(true);
  };

  const handleDelete = async (pageId: string) => {
    if (!confirm('האם אתה בטוח שברצונך למחוק דף זה?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/pages/${pageId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSuccess('דף נמחק בהצלחה!');
        fetchPages();
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'שגיאה במחיקת הדף');
      }
    } catch (error) {
      setError('שגיאה בחיבור לשרת');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      content: '',
      excerpt: '',
      template: 'GENERAL',
      published: true,
      order: 0,
      metaTitle: '',
      metaDesc: '',
      metaKeywords: '',
      featuredImage: '',
      // שדות מותאמים לתבניות
      heroTitle: '',
      heroSubtitle: '',
      heroImage: '',
      heroButtonText: '',
      heroButtonLink: '',
      // שדות לשירותים
      serviceFeatures: [],
      serviceBenefits: [],
      servicePricing: [],
      // שדות לאודות
      aboutImage: '',
      aboutStats: [],
      teamMembers: [],
      // שדות לצור קשר
      contactInfo: {},
      contactForm: {},
      // שדות לדף נחיתה
      landingSections: [],
      testimonials: [],
      // שדות לבלוג
      blogAuthor: '',
      blogCategory: '',
      blogTags: []
    });
    setEditingPage(null);
    setShowForm(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const getTemplateLabel = (template: string) => {
    const option = TEMPLATE_OPTIONS.find(opt => opt.value === template);
    return option ? option.label : template;
  };

  if (loading) {
    return <div className="p-6">טוען...</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">ניהול דפים</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          הוסף דף חדש
        </button>
      </div>

      {/* חיפוש וסינון */}
      <div className="mb-6 flex gap-4">
        <input
          type="text"
          placeholder="חיפוש דפים..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md flex-1"
        />
        <select
          value={templateFilter}
          onChange={(e) => setTemplateFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="">כל התבניות</option>
          {TEMPLATE_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* הודעות */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          {success}
        </div>
      )}

      {/* טופס יצירה/עריכה */}
      {showForm && (
        <div className="mb-6 p-6 bg-gray-50 rounded-lg admin-form modal" style={{ position: 'relative', zIndex: 999999 }}>
          <h2 className="text-xl font-semibold mb-4">
            {editingPage ? 'עריכת דף' : 'יצירת דף חדש'}
          </h2>
          {/* בחירת תבנית */}
          <div className="mb-6 relative template-selector" style={{ position: 'relative', zIndex: 999999 }}>
            <label className="block text-sm font-medium mb-2">תבנית</label>
            <select
              name="template"
              value={formData.template}
              onChange={(e) => setFormData({ ...formData, template: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white relative z-50 template-dropdown"
              style={{ zIndex: 999999, position: 'relative' }}
            >
              {TEMPLATE_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* טופס מותאם לתבנית */}
          <TemplateForm
            template={formData.template}
            formData={formData}
            onChange={(field, value) => setFormData({ ...formData, [field]: value })}
          />

          {/* שדות נוספים */}
          <div className="mt-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">סדר</label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.published}
                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                className="mr-2"
              />
              <label className="text-sm font-medium">מפורסם</label>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={handleSubmit}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md"
              >
                {editingPage ? 'עדכן' : 'צור'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md"
              >
                ביטול
              </button>
            </div>
          </div>
        </div>
      )}

      {/* רשימת הדפים */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                כותרת
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                תבנית
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                סטטוס
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                תאריך יצירה
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                פעולות
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {pages.map((page) => (
              <tr key={page.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{page.title}</div>
                  <div className="text-sm text-gray-500">/{page.slug}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                    {getTemplateLabel(page.template)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    page.published 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {page.published ? 'מפורסם' : 'טיוטה'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(page.createdAt).toLocaleDateString('he-IL')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(page)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      ערוך
                    </button>
                    <button
                      onClick={() => handleDelete(page.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      מחק
                    </button>
                    <Link
                      href={`/${page.slug}`}
                      target="_blank"
                      className="text-blue-600 hover:text-blue-900"
                    >
                      צפה
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 