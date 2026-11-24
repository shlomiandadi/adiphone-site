'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { attachAttribution, createMetaLeadSubmitContext, trackGenerateLead } from '../../lib/tracking';
import { LEAD_PLACEHOLDER_EMAIL } from '../../lib/lead-form';
import {
  isValidPhone,
  normalizeWebsiteUrl,
  websiteCheckLeadPayload,
  WEBSITE_CHECK_FORM_NAME,
  WEBSITE_CHECK_SERVICE,
} from '../../lib/website-check';

const fieldClass =
  'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base';

export default function WebsiteCheckForm() {
  const router = useRouter();
  const [website, setWebsite] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    const websiteUrl = normalizeWebsiteUrl(website);
    if (!websiteUrl) {
      setError('נא למלא כתובת אתר תקינה, למשל example.co.il');
      setIsSubmitting(false);
      return;
    }
    if (!isValidPhone(phone)) {
      setError('נא למלא מספר טלפון או וואטסאפ תקין');
      setIsSubmitting(false);
      return;
    }

    const metaLead = createMetaLeadSubmitContext();
    const lead = websiteCheckLeadPayload(websiteUrl, phone.trim());

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
            ...lead,
            email: LEAD_PLACEHOLDER_EMAIL,
            meta_event_id: metaLead.meta_event_id,
            meta_consent: metaLead.meta_consent,
          })
        ),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'שגיאה בשליחת הטופס');
      }

      trackGenerateLead(WEBSITE_CHECK_FORM_NAME, { service_name: WEBSITE_CHECK_SERVICE }, metaLead.meta_event_id);
      setSuccess('הטופס נשלח בהצלחה! נחזור אליכם עם הבדיקה.');
      setWebsite('');
      setPhone('');
      router.push('/thank-you');
    } catch (submitError) {
      console.error('Error submitting website check form:', submitError);
      setError(submitError instanceof Error ? submitError.message : 'שגיאה בשליחת הטופס. אפשר לנסות שוב או לפנות בוואטסאפ.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      data-form-name={WEBSITE_CHECK_FORM_NAME}
      noValidate
      className="space-y-5"
    >
      <div>
        <label htmlFor="website-check-url" className="mb-1 block text-sm font-medium text-gray-700">
          כתובת האתר
        </label>
        <input
          type="text"
          id="website-check-url"
          name="website"
          value={website}
          onChange={(event) => setWebsite(event.target.value)}
          autoComplete="url"
          inputMode="url"
          dir="ltr"
          placeholder="https://www.example.co.il"
          className={fieldClass}
          required
          aria-required="true"
        />
      </div>

      <div>
        <label htmlFor="website-check-phone" className="mb-1 block text-sm font-medium text-gray-700">
          טלפון / וואטסאפ
        </label>
        <input
          type="tel"
          id="website-check-phone"
          name="phone"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          autoComplete="tel"
          inputMode="tel"
          dir="ltr"
          placeholder="050-0000000"
          className={fieldClass}
          required
          aria-required="true"
        />
      </div>

      {error ? (
        <div className="rounded-lg border border-red-500 bg-red-100 p-4 text-center font-medium text-red-700" role="alert">
          {error}
        </div>
      ) : null}

      {success ? (
        <div className="rounded-lg border border-green-500 bg-green-100 p-4 text-center font-medium text-green-700" role="status">
          {success}
        </div>
      ) : null}

      <p className="text-center text-sm text-gray-600">
        בשליחת הטופס אני מאשר/ת את{' '}
        <a href="/privacy-policy" className="text-blue-600 underline">
          מדיניות הפרטיות
        </a>
      </p>

      <button
        type="submit"
        data-cta="true"
        disabled={isSubmitting}
        className={`w-full rounded-lg py-3.5 font-semibold text-white transition-colors ${
          isSubmitting ? 'cursor-not-allowed bg-gray-400' : 'bg-blue-700 hover:bg-blue-800'
        }`}
      >
        {isSubmitting ? 'שולח...' : 'שלחו לבדיקה חינם'}
      </button>
    </form>
  );
}
