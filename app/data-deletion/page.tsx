import React from 'react';
import Link from 'next/link';

import { WHATSAPP_BASE } from '@/lib/whatsapp';
import { createSeoAgentGenerateMetadata } from '@/seo-agent-apply';

const pageMetadata = {
  title: 'מחיקת נתוני משתמש | עדי פון תקשורת',
  description: 'כיצד לבקש מחיקה של פרטים אישיים שנאספו דרך טפסי לידים בפייסבוק ובאינסטגרם או דרך טפסי האתר.',
  alternates: {
    canonical: '/data-deletion',
  },
};

export const generateMetadata = createSeoAgentGenerateMetadata('/data-deletion', pageMetadata);

const DELETION_EMAIL = 'shlomiandadi@gmail.com';
const DELETION_EMAIL_ALT = 'shlomimalfuf1@gmail.com';
const DELETION_EMAIL_SUBJECT = encodeURIComponent('בקשה למחיקת נתונים');

export default function DataDeletion() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-10">
      <div className="max-w-3xl w-full bg-white rounded-xl shadow-lg p-8 text-right" dir="rtl">
        <h1 className="text-3xl font-bold mb-6">מחיקת נתוני משתמש</h1>

        <section className="mb-6">
          <h2 className="font-bold text-lg mb-2">איזה מידע ניתן למחוק</h2>
          <p>
            ניתן לבקש מחיקה של פרטים אישיים שמסרת לנו: שם, טלפון, דוא"ל ותוכן הפנייה, שנאספו דרך טפסי לידים בפייסבוק או באינסטגרם או דרך הטפסים באתר.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="font-bold text-lg mb-2">איך מגישים בקשה</h2>
          <ul className="list-disc pr-5 mb-2 text-gray-700">
            <li className="mb-1">
              <b>בדוא"ל:</b>{' '}
              <a className="text-blue-700 hover:underline" href={`mailto:${DELETION_EMAIL}?subject=${DELETION_EMAIL_SUBJECT}`}>
                {DELETION_EMAIL}
              </a>
              {' '}או{' '}
              <a className="text-blue-700 hover:underline" href={`mailto:${DELETION_EMAIL_ALT}?subject=${DELETION_EMAIL_SUBJECT}`}>
                {DELETION_EMAIL_ALT}
              </a>
            </li>
            <li>
              <b>בוואטסאפ:</b>{' '}
              <a className="text-blue-700 hover:underline" href={WHATSAPP_BASE} target="_blank" rel="noopener noreferrer">
                שליחת הודעה בוואטסאפ
              </a>
            </li>
          </ul>
          <p>בבקשה יש לציין את השם ואת הטלפון או הדוא"ל שמסרת, כדי שנוכל לאתר את הפרטים.</p>
        </section>

        <section className="mb-6">
          <h2 className="font-bold text-lg mb-2">מה קורה אחרי הבקשה</h2>
          <p>המחיקה תתבצע תוך 30 יום ממועד קבלת הבקשה, ולאחר מכן נשלח לך אישור על ביצוע המחיקה.</p>
        </section>

        <section>
          <h2 className="font-bold text-lg mb-2">מידע נוסף</h2>
          <p>
            פרטים נוספים על איסוף המידע והשימוש בו מופיעים ב
            <Link className="text-blue-700 hover:underline" href="/privacy-policy">מדיניות הפרטיות</Link>.
          </p>
        </section>
      </div>
    </div>
  );
}
