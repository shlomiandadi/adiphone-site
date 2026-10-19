'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { attachAttribution, createMetaLeadSubmitContext, trackGenerateLead } from '../../lib/tracking';
import {
  LEAD_PLACEHOLDER_EMAIL,
  LEAD_SERVICE_OPTIONS,
  defaultLeadMessage,
  labelForLeadService,
} from '../../lib/lead-form';

type Props = {
  formName: string;
  className?: string;
  compact?: boolean;
};

export default function LeadForm({ formName, className = '', compact = false }: Props) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    service: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    if (!formData.name.trim()) {
      setError('נא למלא שם');
      setIsSubmitting(false);
      return;
    }
    if (!formData.phone.trim()) {
      setError('נא למלא מספר טלפון');
      setIsSubmitting(false);
      return;
    }
    if (!formData.service) {
      setError('נא לבחור סוג שירות');
      setIsSubmitting(false);
      return;
    }

    const serviceLabel = labelForLeadService(formData.service);
    const metaLead = createMetaLeadSubmitContext();

    try {
      const response = await fetch('/api/contact/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify(
          attachAttribution({
            name: formData.name.trim(),
            phone: formData.phone.trim(),
            service: serviceLabel,
            service_key: formData.service,
            email: LEAD_PLACEHOLDER_EMAIL,
            message: defaultLeadMessage(serviceLabel),
            form_name: formName,
            meta_event_id: metaLead.meta_event_id,
            meta_consent: metaLead.meta_consent,
          })
        ),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to submit form');
      }

      trackGenerateLead(formName, { service_name: serviceLabel }, metaLead.meta_event_id);
      setSuccess('הטופס נשלח בהצלחה!');
      setFormData({ name: '', phone: '', service: '' });
      router.push('/thank-you');
    } catch (submitError) {
      console.error('Error submitting form:', submitError);
      setError(submitError instanceof Error ? submitError.message : 'שגיאה בשליחת הטופס');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fieldClass = compact
    ? 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white'
    : 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white';

  return (
    <form onSubmit={handleSubmit} data-form-name={formName} className={`space-y-5 ${className}`}>
      <div>
        <label htmlFor={`${formName}-name`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          שם
        </label>
        <input
          type="text"
          id={`${formName}-name`}
          name="name"
          value={formData.name}
          onChange={handleChange}
          autoComplete="name"
          className={fieldClass}
          required
        />
      </div>

      <div>
        <label htmlFor={`${formName}-phone`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          טלפון
        </label>
        <input
          type="tel"
          id={`${formName}-phone`}
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          autoComplete="tel"
          inputMode="tel"
          className={fieldClass}
          required
        />
      </div>

      <div>
        <label htmlFor={`${formName}-service`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          סוג שירות
        </label>
        <select
          id={`${formName}-service`}
          name="service"
          value={formData.service}
          onChange={handleChange}
          className={fieldClass}
          required
        >
          <option value="">בחרו סוג שירות</option>
          {LEAD_SERVICE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="p-4 rounded-lg text-center font-medium bg-red-100 text-red-700 border border-red-500">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 rounded-lg text-center font-medium bg-green-100 text-green-700 border border-green-500">
          {success}
        </div>
      )}

      <div className="space-y-3">
        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          בשליחת הטופס אני מאשר/ת את{' '}
          <a href="/privacy-policy" className="text-blue-600 hover:underline">
            מדיניות הפרטיות
          </a>
        </p>
        <button
          type="submit"
          data-cta="true"
          disabled={isSubmitting}
          className={`w-full py-3.5 rounded-lg font-semibold transition-colors ${
            isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-700 hover:bg-blue-800'
          } text-white`}
        >
          {isSubmitting ? 'שולח...' : 'שלחו ואחזור אליכם עוד היום ←'}
        </button>
      </div>

      <p className="text-center text-sm text-gray-600 dark:text-gray-400">
        ללא התחייבות · 500+ לקוחות מרוצים · ⭐ ביקורות גוגל
      </p>
    </form>
  );
}
