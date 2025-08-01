'use client';

import React, { useState } from 'react';

interface TemplateFormProps {
  template: string;
  formData: any;
  onChange: (field: string, value: any) => void;
}

export default function TemplateForm({ template, formData, onChange }: TemplateFormProps) {
  const [activeTab, setActiveTab] = useState('basic');

  const renderBasicFields = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">כותרת ראשית</label>
          <input
            type="text"
            value={formData.title || ''}
            onChange={(e) => onChange('title', e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">URL מותאם (Slug)</label>
          <input
            type="text"
            value={formData.slug || ''}
            onChange={(e) => onChange('slug', e.target.value)}
            placeholder="לדוגמה: about-us, services"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
          <p className="text-xs text-gray-500 mt-1">
            השאר ריק כדי ליצור URL אוטומטי מהכותרת
          </p>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">תקציר</label>
        <textarea
          value={formData.excerpt || ''}
          onChange={(e) => onChange('excerpt', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">תוכן ראשי</label>
        <textarea
          value={formData.content || ''}
          onChange={(e) => onChange('content', e.target.value)}
          required
          rows={8}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">תמונה ראשית</label>
        <input
          type="url"
          value={formData.featuredImage || ''}
          onChange={(e) => onChange('featuredImage', e.target.value)}
          placeholder="https://example.com/image.jpg"
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>
    </div>
  );

  const renderHeroFields = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">כותרת הירו</label>
          <input
            type="text"
            value={formData.heroTitle || ''}
            onChange={(e) => onChange('heroTitle', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">כותרת משנה הירו</label>
          <input
            type="text"
            value={formData.heroSubtitle || ''}
            onChange={(e) => onChange('heroSubtitle', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">תמונת הירו</label>
          <input
            type="url"
            value={formData.heroImage || ''}
            onChange={(e) => onChange('heroImage', e.target.value)}
            placeholder="https://example.com/hero-image.jpg"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">טקסט כפתור</label>
          <input
            type="text"
            value={formData.heroButtonText || ''}
            onChange={(e) => onChange('heroButtonText', e.target.value)}
            placeholder="לחץ כאן"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">קישור כפתור</label>
        <input
          type="url"
          value={formData.heroButtonLink || ''}
          onChange={(e) => onChange('heroButtonLink', e.target.value)}
          placeholder="https://example.com"
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>
    </div>
  );

  const renderServiceFields = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-3">תכונות השירות</h3>
        <div className="space-y-3">
          {(formData.serviceFeatures || []).map((feature: any, index: number) => (
            <div key={index} className="p-3 border border-gray-200 rounded-md">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="כותרת"
                  value={feature.title || ''}
                  onChange={(e) => {
                    const newFeatures = [...(formData.serviceFeatures || [])];
                    newFeatures[index] = { ...feature, title: e.target.value };
                    onChange('serviceFeatures', newFeatures);
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                />
                <input
                  type="text"
                  placeholder="תיאור"
                  value={feature.description || ''}
                  onChange={(e) => {
                    const newFeatures = [...(formData.serviceFeatures || [])];
                    newFeatures[index] = { ...feature, description: e.target.value };
                    onChange('serviceFeatures', newFeatures);
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                />
                <input
                  type="text"
                  placeholder="אייקון (FontAwesome)"
                  value={feature.icon || ''}
                  onChange={(e) => {
                    const newFeatures = [...(formData.serviceFeatures || [])];
                    newFeatures[index] = { ...feature, icon: e.target.value };
                    onChange('serviceFeatures', newFeatures);
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  const newFeatures = (formData.serviceFeatures || []).filter((_: any, i: number) => i !== index);
                  onChange('serviceFeatures', newFeatures);
                }}
                className="mt-2 text-red-600 text-sm"
              >
                מחק תכונה
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => {
              const newFeatures = [...(formData.serviceFeatures || []), { title: '', description: '', icon: '' }];
              onChange('serviceFeatures', newFeatures);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm"
          >
            הוסף תכונה
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-3">יתרונות השירות</h3>
        <div className="space-y-3">
          {(formData.serviceBenefits || []).map((benefit: any, index: number) => (
            <div key={index} className="p-3 border border-gray-200 rounded-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="כותרת"
                  value={benefit.title || ''}
                  onChange={(e) => {
                    const newBenefits = [...(formData.serviceBenefits || [])];
                    newBenefits[index] = { ...benefit, title: e.target.value };
                    onChange('serviceBenefits', newBenefits);
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                />
                <input
                  type="text"
                  placeholder="תיאור"
                  value={benefit.description || ''}
                  onChange={(e) => {
                    const newBenefits = [...(formData.serviceBenefits || [])];
                    newBenefits[index] = { ...benefit, description: e.target.value };
                    onChange('serviceBenefits', newBenefits);
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  const newBenefits = (formData.serviceBenefits || []).filter((_: any, i: number) => i !== index);
                  onChange('serviceBenefits', newBenefits);
                }}
                className="mt-2 text-red-600 text-sm"
              >
                מחק יתרון
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => {
              const newBenefits = [...(formData.serviceBenefits || []), { title: '', description: '' }];
              onChange('serviceBenefits', newBenefits);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm"
          >
            הוסף יתרון
          </button>
        </div>
      </div>
    </div>
  );

  const renderAboutFields = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-1">תמונת אודות</label>
        <input
          type="url"
          value={formData.aboutImage || ''}
          onChange={(e) => onChange('aboutImage', e.target.value)}
          placeholder="https://example.com/about-image.jpg"
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>

      <div>
        <h3 className="text-lg font-medium mb-3">סטטיסטיקות</h3>
        <div className="space-y-3">
          {(formData.aboutStats || []).map((stat: any, index: number) => (
            <div key={index} className="p-3 border border-gray-200 rounded-md">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="תגית"
                  value={stat.label || ''}
                  onChange={(e) => {
                    const newStats = [...(formData.aboutStats || [])];
                    newStats[index] = { ...stat, label: e.target.value };
                    onChange('aboutStats', newStats);
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                />
                <input
                  type="text"
                  placeholder="ערך"
                  value={stat.value || ''}
                  onChange={(e) => {
                    const newStats = [...(formData.aboutStats || [])];
                    newStats[index] = { ...stat, value: e.target.value };
                    onChange('aboutStats', newStats);
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                />
                <input
                  type="text"
                  placeholder="אייקון"
                  value={stat.icon || ''}
                  onChange={(e) => {
                    const newStats = [...(formData.aboutStats || [])];
                    newStats[index] = { ...stat, icon: e.target.value };
                    onChange('aboutStats', newStats);
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  const newStats = (formData.aboutStats || []).filter((_: any, i: number) => i !== index);
                  onChange('aboutStats', newStats);
                }}
                className="mt-2 text-red-600 text-sm"
              >
                מחק סטטיסטיקה
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => {
              const newStats = [...(formData.aboutStats || []), { label: '', value: '', icon: '' }];
              onChange('aboutStats', newStats);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm"
          >
            הוסף סטטיסטיקה
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-3">חברי הצוות</h3>
        <div className="space-y-3">
          {(formData.teamMembers || []).map((member: any, index: number) => (
            <div key={index} className="p-3 border border-gray-200 rounded-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="שם"
                  value={member.name || ''}
                  onChange={(e) => {
                    const newMembers = [...(formData.teamMembers || [])];
                    newMembers[index] = { ...member, name: e.target.value };
                    onChange('teamMembers', newMembers);
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                />
                <input
                  type="text"
                  placeholder="תפקיד"
                  value={member.role || ''}
                  onChange={(e) => {
                    const newMembers = [...(formData.teamMembers || [])];
                    newMembers[index] = { ...member, role: e.target.value };
                    onChange('teamMembers', newMembers);
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                <input
                  type="url"
                  placeholder="תמונה"
                  value={member.image || ''}
                  onChange={(e) => {
                    const newMembers = [...(formData.teamMembers || [])];
                    newMembers[index] = { ...member, image: e.target.value };
                    onChange('teamMembers', newMembers);
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                />
                <textarea
                  placeholder="ביוגרפיה"
                  value={member.bio || ''}
                  onChange={(e) => {
                    const newMembers = [...(formData.teamMembers || [])];
                    newMembers[index] = { ...member, bio: e.target.value };
                    onChange('teamMembers', newMembers);
                  }}
                  rows={2}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  const newMembers = (formData.teamMembers || []).filter((_: any, i: number) => i !== index);
                  onChange('teamMembers', newMembers);
                }}
                className="mt-2 text-red-600 text-sm"
              >
                מחק חבר צוות
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => {
              const newMembers = [...(formData.teamMembers || []), { name: '', role: '', image: '', bio: '' }];
              onChange('teamMembers', newMembers);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm"
          >
            הוסף חבר צוות
          </button>
        </div>
      </div>
    </div>
  );

  const renderContactFields = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-3">פרטי קשר</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">טלפון</label>
            <input
              type="tel"
              value={formData.contactInfo?.phone || ''}
              onChange={(e) => onChange('contactInfo', { ...formData.contactInfo, phone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">אימייל</label>
            <input
              type="email"
              value={formData.contactInfo?.email || ''}
              onChange={(e) => onChange('contactInfo', { ...formData.contactInfo, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium mb-1">כתובת</label>
            <input
              type="text"
              value={formData.contactInfo?.address || ''}
              onChange={(e) => onChange('contactInfo', { ...formData.contactInfo, address: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">שעות פעילות</label>
            <input
              type="text"
              value={formData.contactInfo?.hours || ''}
              onChange={(e) => onChange('contactInfo', { ...formData.contactInfo, hours: e.target.value })}
              placeholder="א-ה 9:00-18:00"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-3">טופס יצירת קשר</h3>
        <div>
          <label className="block text-sm font-medium mb-1">הודעת הצלחה</label>
          <input
            type="text"
            value={formData.contactForm?.successMessage || ''}
            onChange={(e) => onChange('contactForm', { ...formData.contactForm, successMessage: e.target.value })}
            placeholder="תודה! נחזור אליך בהקדם"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>
    </div>
  );

  const renderBlogFields = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">מחבר</label>
          <input
            type="text"
            value={formData.blogAuthor || ''}
            onChange={(e) => onChange('blogAuthor', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">קטגוריה</label>
          <input
            type="text"
            value={formData.blogCategory || ''}
            onChange={(e) => onChange('blogCategory', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">תגיות (מופרדות בפסיקים)</label>
        <input
          type="text"
          value={formData.blogTags?.join(', ') || ''}
          onChange={(e) => onChange('blogTags', e.target.value.split(',').map(tag => tag.trim()))}
          placeholder="תגית 1, תגית 2, תגית 3"
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>
    </div>
  );

  const renderSeoFields = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Meta Title</label>
        <input
          type="text"
          value={formData.metaTitle || ''}
          onChange={(e) => onChange('metaTitle', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Meta Description</label>
        <textarea
          value={formData.metaDesc || ''}
          onChange={(e) => onChange('metaDesc', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Meta Keywords</label>
        <input
          type="text"
          value={formData.metaKeywords || ''}
          onChange={(e) => onChange('metaKeywords', e.target.value)}
          placeholder="מילות מפתח, מופרדות בפסיקים"
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>
    </div>
  );

  const getTabs = () => {
    const tabs = [
      { id: 'basic', label: 'שדות בסיסיים' },
      { id: 'hero', label: 'הירו' },
      { id: 'seo', label: 'SEO' }
    ];

    if (template === 'SERVICE') {
      tabs.splice(2, 0, { id: 'service', label: 'פרטי שירות' });
    } else if (template === 'ABOUT') {
      tabs.splice(2, 0, { id: 'about', label: 'פרטי אודות' });
    } else if (template === 'CONTACT') {
      tabs.splice(2, 0, { id: 'contact', label: 'פרטי קשר' });
    } else if (template === 'BLOG') {
      tabs.splice(2, 0, { id: 'blog', label: 'פרטי בלוג' });
    }

    return tabs;
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'basic':
        return renderBasicFields();
      case 'hero':
        return renderHeroFields();
      case 'service':
        return renderServiceFields();
      case 'about':
        return renderAboutFields();
      case 'contact':
        return renderContactFields();
      case 'blog':
        return renderBlogFields();
      case 'seo':
        return renderSeoFields();
      default:
        return renderBasicFields();
    }
  };

  return (
    <div>
      {/* כרטיסיות ניווט */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {getTabs().map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* תוכן הכרטיסייה */}
      <div className="min-h-[400px]">
        {renderTabContent()}
      </div>
    </div>
  );
} 