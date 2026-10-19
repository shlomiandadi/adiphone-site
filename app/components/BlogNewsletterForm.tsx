'use client';

import { useState } from 'react';
import { ContactService } from '@prisma/client';
import { attachAttribution, createMetaLeadSubmitContext, trackGenerateLead } from '../../lib/tracking';

export default function BlogNewsletterForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: 'מתעניין/ת בניוזלטר',
    service: ContactService.OTHER,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus('שולח...');

    const metaLead = createMetaLeadSubmitContext();

    try {
      const response = await fetch('/api/contact/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify(
          attachAttribution({
            ...formData,
            form_name: 'newsletter',
            meta_event_id: metaLead.meta_event_id,
            meta_consent: metaLead.meta_consent,
          })
        ),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'שגיאה בשליחת הטופס');
      }
      trackGenerateLead('newsletter', {}, metaLead.meta_event_id);
      setStatus('תודה על ההרשמה לניוזלטר! נשלח לך עדכונים בקרוב.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: 'מתעניין/ת בניוזלטר',
        service: ContactService.OTHER,
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      setStatus('אירעה שגיאה בהרשמה לניוזלטר. אנא נסה שוב.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 sticky top-8">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        הירשם לניוזלטר
      </h3>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        קבל עדכונים על פוסטים חדשים וטיפים שימושיים
      </p>

      <form onSubmit={handleSubmit} data-form-name="newsletter" className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            שם מלא
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            דוא&quot;ל
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            טלפון
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>

        {status && (
          <div className={`p-4 rounded-lg text-center text-sm font-medium ${
            status.includes('תודה')
              ? 'bg-green-100 text-green-700 border border-green-500 dark:bg-green-900/30 dark:text-green-200'
              : 'bg-red-100 text-red-700 border border-red-500 dark:bg-red-900/30 dark:text-red-200'
          }`}>
            {status}
          </div>
        )}

        <div className="space-y-3">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            בשליחת הטופס אני מאשר/ת את{' '}
            <a href="/privacy-policy" className="text-blue-600 hover:underline">
              מדיניות הפרטיות
            </a>
          </p>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
              isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 transform hover:scale-105'
            } text-white shadow-lg`}
          >
            {isSubmitting ? 'שולח...' : 'הרשמה לניוזלטר'}
          </button>
        </div>
      </form>
    </div>
  );
}
