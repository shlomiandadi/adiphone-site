'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaEye, FaSave, FaTimes } from 'react-icons/fa';
import TemplateForm from './TemplateForm';

interface Page {
  id: string;
  title: string;
  slug: string;
  content: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  templateRelation?: {
    id: string;
    name: string;
    description: string;
    sections: any[];
  };
}

interface Template {
  id: string;
  name: string;
  description: string;
  sections: any[];
}

export default function PagesManager() {
  const [pages, setPages] = useState<Page[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showTemplateForm, setShowTemplateForm] = useState(false);
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    templateId: '',
    published: false
  });
  
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [templateSections, setTemplateSections] = useState<any[]>([]);

  useEffect(() => {
    fetchPages();
    fetchTemplates();
  }, []);

  const fetchPages = async () => {
    try {
      const response = await fetch('/api/admin/pages');
      if (response.ok) {
        const data = await response.json();
        setPages(data);
      }
    } catch (error) {
      console.error('Error fetching pages:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/admin/templates');
      if (response.ok) {
        const data = await response.json();
        setTemplates(data);
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };

  const handleCreatePage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const pageData = {
        ...formData,
        templateSections: templateSections // שמירת הסקשנים המעודכנים
      };

      const response = await fetch('/api/admin/pages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pageData),
      });

      if (response.ok) {
        const newPage = await response.json();
        setPages([newPage, ...pages]);
        setShowCreateForm(false);
        setFormData({
          title: '',
          slug: '',
          content: '',
          templateId: '',
          published: false
        });
        setSelectedTemplate(null);
        setTemplateSections([]);
      } else {
        const error = await response.json();
        alert(error.error || 'שגיאה ביצירת הדף');
      }
    } catch (error) {
      console.error('Error creating page:', error);
      alert('שגיאה ביצירת הדף');
    }
  };

  const handleUpdatePage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingPage) return;

    try {
      const pageData = {
        ...formData,
        templateSections: templateSections // שמירת הסקשנים המעודכנים
      };

      const response = await fetch(`/api/admin/pages/${editingPage.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pageData),
      });

      if (response.ok) {
        const updatedPage = await response.json();
        setPages(pages.map(page => 
          page.id === editingPage.id ? updatedPage : page
        ));
        setEditingPage(null);
        setFormData({
          title: '',
          slug: '',
          content: '',
          templateId: '',
          published: false
        });
        setSelectedTemplate(null);
        setTemplateSections([]);
      } else {
        const error = await response.json();
        alert(error.error || 'שגיאה בעדכון הדף');
      }
    } catch (error) {
      console.error('Error updating page:', error);
      alert('שגיאה בעדכון הדף');
    }
  };

  const handleDeletePage = async (pageId: string) => {
    if (!confirm('האם אתה בטוח שברצונך למחוק דף זה?')) return;

    try {
      const response = await fetch(`/api/admin/pages/${pageId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setPages(pages.filter(page => page.id !== pageId));
      } else {
        const error = await response.json();
        alert(error.error || 'שגיאה במחיקת הדף');
      }
    } catch (error) {
      console.error('Error deleting page:', error);
      alert('שגיאה במחיקת הדף');
    }
  };

    const handleEditPage = (page: Page) => {
    setEditingPage(page);
    setFormData({
      title: page.title,
      slug: page.slug,
      content: page.content,
      templateId: page.templateRelation?.id || '',
      published: page.published
    });
    
    // טען את התבנית והסקשנים הקיימים
    if (page.templateRelation) {
      setSelectedTemplate(page.templateRelation);
      setTemplateSections(page.templateRelation.sections || []);
    } else {
      setSelectedTemplate(null);
      setTemplateSections([]);
    }
  };

  const handleCreateTemplate = async (templateData: any) => {
    try {
      const response = await fetch('/api/admin/templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(templateData),
      });

      if (response.ok) {
        const newTemplate = await response.json();
        setTemplates([...templates, newTemplate]);
        setShowTemplateForm(false);
      } else {
        const error = await response.json();
        alert(error.error || 'שגיאה ביצירת התבנית');
      }
    } catch (error) {
      console.error('Error creating template:', error);
      alert('שגיאה ביצירת התבנית');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('he-IL');
  };

  const renderSectionEditor = (section: any, index: number) => {
    const { type, content } = section;
    
    const updateSectionContent = (newContent: any) => {
      const newSections = [...templateSections];
      newSections[index] = { ...section, content: newContent };
      setTemplateSections(newSections);
    };
    
    switch (type) {
      case 'hero':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">כותרת</label>
              <input
                type="text"
                value={content.title || ''}
                onChange={(e) => updateSectionContent({ ...content, title: e.target.value })}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">תת-כותרת</label>
              <input
                type="text"
                value={content.subtitle || ''}
                onChange={(e) => updateSectionContent({ ...content, subtitle: e.target.value })}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">תמונה רקע</label>
              <input
                type="text"
                value={content.backgroundImage || ''}
                onChange={(e) => updateSectionContent({ ...content, backgroundImage: e.target.value })}
                className="w-full p-2 border rounded"
                placeholder="/images/hero-bg.jpg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">טקסט כפתור</label>
              <input
                type="text"
                value={content.buttonText || ''}
                onChange={(e) => updateSectionContent({ ...content, buttonText: e.target.value })}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">קישור כפתור</label>
              <input
                type="text"
                value={content.buttonLink || ''}
                onChange={(e) => updateSectionContent({ ...content, buttonLink: e.target.value })}
                className="w-full p-2 border rounded"
                placeholder="/contact"
              />
            </div>
          </div>
        );

      case 'content':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">כותרת</label>
              <input
                type="text"
                value={content.title || ''}
                onChange={(e) => updateSectionContent({ ...content, title: e.target.value })}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">תוכן (HTML מלא)</label>
              <textarea
                value={content.content || ''}
                onChange={(e) => updateSectionContent({ ...content, content: e.target.value })}
                className="w-full p-2 border rounded h-32 font-mono text-sm"
                placeholder="<p>תוכן עם HTML מלא</p><h2>כותרת משנה</h2>"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id={`showTOC-${section.id}`}
                checked={content.showTableOfContents || false}
                onChange={(e) => updateSectionContent({ ...content, showTableOfContents: e.target.checked })}
                className="mr-2"
              />
              <label htmlFor={`showTOC-${section.id}`} className="text-sm font-medium text-gray-700">
                הצג תוכן עניינים
              </label>
            </div>
          </div>
        );

      case 'features':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">כותרת הסקשן</label>
              <input
                type="text"
                value={content.title || ''}
                onChange={(e) => updateSectionContent({ ...content, title: e.target.value })}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">היתרונות</label>
              {content.features?.map((feature: any, featureIndex: number) => (
                <div key={featureIndex} className="border p-3 rounded mb-3 space-y-2">
                  <input
                    type="text"
                    placeholder="כותרת היתרון"
                    value={feature.title || ''}
                    onChange={(e) => {
                      const newFeatures = [...content.features];
                      newFeatures[featureIndex] = { ...feature, title: e.target.value };
                      updateSectionContent({ ...content, features: newFeatures });
                    }}
                    className="w-full p-2 border rounded"
                  />
                  <input
                    type="text"
                    placeholder="תיאור היתרון"
                    value={feature.description || ''}
                    onChange={(e) => {
                      const newFeatures = [...content.features];
                      newFeatures[featureIndex] = { ...feature, description: e.target.value };
                      updateSectionContent({ ...content, features: newFeatures });
                    }}
                    className="w-full p-2 border rounded"
                  />
                  <select
                    value={feature.icon || 'star'}
                    onChange={(e) => {
                      const newFeatures = [...content.features];
                      newFeatures[featureIndex] = { ...feature, icon: e.target.value };
                      updateSectionContent({ ...content, features: newFeatures });
                    }}
                    className="w-full p-2 border rounded"
                  >
                    <option value="star">כוכב</option>
                    <option value="check">צ'ק</option>
                    <option value="heart">לב</option>
                    <option value="bolt">ברק</option>
                    <option value="rocket">רקטה</option>
                    <option value="crown">כתר</option>
                  </select>
                </div>
              ))}
            </div>
          </div>
        );

      case 'pricing':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">כותרת הסקשן</label>
              <input
                type="text"
                value={content.title || ''}
                onChange={(e) => updateSectionContent({ ...content, title: e.target.value })}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">החבילות</label>
              {content.plans?.map((plan: any, planIndex: number) => (
                <div key={planIndex} className="border p-3 rounded mb-3 space-y-2">
                  <input
                    type="text"
                    placeholder="שם החבילה"
                    value={plan.name || ''}
                    onChange={(e) => {
                      const newPlans = [...content.plans];
                      newPlans[planIndex] = { ...plan, name: e.target.value };
                      updateSectionContent({ ...content, plans: newPlans });
                    }}
                    className="w-full p-2 border rounded"
                  />
                  <input
                    type="text"
                    placeholder="מחיר"
                    value={plan.price || ''}
                    onChange={(e) => {
                      const newPlans = [...content.plans];
                      newPlans[planIndex] = { ...plan, price: e.target.value };
                      updateSectionContent({ ...content, plans: newPlans });
                    }}
                    className="w-full p-2 border rounded"
                  />
                  <input
                    type="text"
                    placeholder="תכונות (מופרדות בפסיקים)"
                    value={plan.features?.join(', ') || ''}
                    onChange={(e) => {
                      const newPlans = [...content.plans];
                      newPlans[planIndex] = { ...plan, features: e.target.value.split(',').map(f => f.trim()) };
                      updateSectionContent({ ...content, plans: newPlans });
                    }}
                    className="w-full p-2 border rounded"
                  />
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={plan.popular || false}
                      onChange={(e) => {
                        const newPlans = [...content.plans];
                        newPlans[planIndex] = { ...plan, popular: e.target.checked };
                        updateSectionContent({ ...content, plans: newPlans });
                      }}
                      className="mr-2"
                    />
                    <label className="text-sm font-medium text-gray-700">חבילה פופולרית</label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'faq':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">כותרת הסקשן</label>
              <input
                type="text"
                value={content.title || ''}
                onChange={(e) => updateSectionContent({ ...content, title: e.target.value })}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">שאלות ותשובות</label>
              {content.questions?.map((qa: any, qaIndex: number) => (
                <div key={qaIndex} className="border p-3 rounded mb-3 space-y-2">
                  <input
                    type="text"
                    placeholder="השאלה"
                    value={qa.question || ''}
                    onChange={(e) => {
                      const newQuestions = [...content.questions];
                      newQuestions[qaIndex] = { ...qa, question: e.target.value };
                      updateSectionContent({ ...content, questions: newQuestions });
                    }}
                    className="w-full p-2 border rounded"
                  />
                  <textarea
                    placeholder="התשובה"
                    value={qa.answer || ''}
                    onChange={(e) => {
                      const newQuestions = [...content.questions];
                      newQuestions[qaIndex] = { ...qa, answer: e.target.value };
                      updateSectionContent({ ...content, questions: newQuestions });
                    }}
                    className="w-full p-2 border rounded h-20"
                  />
                </div>
              ))}
            </div>
          </div>
        );

      case 'cta':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">כותרת</label>
              <input
                type="text"
                value={content.title || ''}
                onChange={(e) => updateSectionContent({ ...content, title: e.target.value })}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">תת-כותרת</label>
              <input
                type="text"
                value={content.subtitle || ''}
                onChange={(e) => updateSectionContent({ ...content, subtitle: e.target.value })}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">טקסט כפתור</label>
              <input
                type="text"
                value={content.buttonText || ''}
                onChange={(e) => updateSectionContent({ ...content, buttonText: e.target.value })}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">קישור כפתור</label>
              <input
                type="text"
                value={content.buttonLink || ''}
                onChange={(e) => updateSectionContent({ ...content, buttonLink: e.target.value })}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        );

      default:
        return <div className="text-gray-500">עורך לא זמין לסוג סקשן זה</div>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">ניהול דפים</h1>
        <div className="flex gap-4">
          <button
            onClick={() => setShowTemplateForm(true)}
            className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            <FaPlus />
            צור תבנית חדשה
          </button>
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FaPlus />
            צור דף חדש
          </button>
        </div>
      </div>

      {/* Pages List */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  כותרת
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  URL
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
                <motion.tr
                  key={page.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {page.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      /{page.slug}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {page.templateRelation?.name || 'ללא תבנית'}
                    </div>
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
                    {formatDate(page.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <a
                        href={`/${page.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <FaEye />
                      </a>
                      <button
                        onClick={() => handleEditPage(page)}
                        className="text-green-600 hover:text-green-900"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeletePage(page.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Page Modal */}
      {(showCreateForm || editingPage) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                {editingPage ? 'ערוך דף' : 'צור דף חדש'}
              </h2>
              <button
                onClick={() => {
                  setShowCreateForm(false);
                  setEditingPage(null);
                  setFormData({
                    title: '',
                    slug: '',
                    content: '',
                    templateId: '',
                    published: false
                  });
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={editingPage ? handleUpdatePage : handleCreatePage} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">כותרת הדף</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">URL מותאם</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="לדוגמה: about-us, services"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  השאר ריק כדי ליצור URL אוטומטי מהכותרת
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">תבנית</label>
                <select
                  value={formData.templateId}
                  onChange={(e) => {
                    const templateId = e.target.value;
                    setFormData({ ...formData, templateId });
                    
                    if (templateId) {
                      const template = templates.find(t => t.id === templateId);
                      if (template) {
                        setSelectedTemplate(template);
                        setTemplateSections(JSON.parse(JSON.stringify(template.sections)));
                      }
                    } else {
                      setSelectedTemplate(null);
                      setTemplateSections([]);
                    }
                  }}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">בחר תבנית</option>
                  {templates.map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">תוכן נוסף</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="תוכן נוסף לדף (אופציונלי)"
                />
              </div>

              {/* Template Sections Editor */}
              {selectedTemplate && templateSections.length > 0 && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">עריכת סקשני התבנית</h3>
                  <div className="space-y-6">
                    {templateSections.map((section, index) => (
                      <div key={section.id} className="border rounded-lg p-4 bg-gray-50">
                        <h4 className="font-medium mb-3 text-gray-800">{section.title}</h4>
                        {renderSectionEditor(section, index)}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="published"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="published" className="mr-2 block text-sm text-gray-900">
                  פרסם מיד
                </label>
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setEditingPage(null);
                    setFormData({
                      title: '',
                      slug: '',
                      content: '',
                      templateId: '',
                      published: false
                    });
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  ביטול
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FaSave />
                  {editingPage ? 'עדכן דף' : 'צור דף'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Template Form Modal */}
      {showTemplateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">צור תבנית חדשה</h2>
              <button
                onClick={() => setShowTemplateForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>

            <TemplateForm
              onSubmit={handleCreateTemplate}
              initialData={null}
            />
          </div>
        </div>
      )}
    </div>
  );
} 