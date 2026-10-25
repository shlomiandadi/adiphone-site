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
        <h1 className="text-3xl font-bold mb-2">מחיקת נתוני משתמש</h1>
        <div className="text-sm text-gray-500 mb-6">עדכון אחרון: 25.10.2026</div>

        <section className="mb-6">
          <p>
            Top Webstak הוא שם מסחרי של עדי פון תקשורת (להלן: &quot;החברה&quot;, &quot;אנחנו&quot;), העוסקת בבניית אתרים, קידום אתרים ומערכות דיגיטליות.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="font-bold text-lg mb-2">איזה מידע ניתן למחוק</h2>
          <p>
            ניתן לבקש מחיקה של כל הפרטים האישיים שמסרת לנו: שם, טלפון, דוא&quot;ל ותוכן הפנייה, שנאספו דרך טפסי לידים בפייסבוק או באינסטגרם או דרך טפסי האתר. המחיקה כוללת את הרשומה במסד הנתונים שלנו ואת היסטוריית ההתראות שנשלחו בגינה.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="font-bold text-lg mb-2">איך מגישים בקשה</h2>
          <ul className="list-disc pr-5 mb-2 text-gray-700">
            <li className="mb-1">
              <b>בדוא&quot;ל:</b>{' '}
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
          <p className="mb-2">בבקשה יש לציין את השם ואת הטלפון או הדוא&quot;ל שמסרת, כדי שנוכל לאתר את הפרטים.</p>
          <p>אין צורך בהתחברות. בקשות מאומתות לפי הפרטים שמסרת בטופס.</p>
        </section>

        <section className="mb-6">
          <h2 className="font-bold text-lg mb-2">הסרה דרך פייסבוק</h2>
          <p>
            אפשר גם לפנות ישירות לעסק שאליו מילאת את הטופס, או להסיר את האפליקציה &quot;TopWebstak Leads&quot; מהגדרות פייסבוק שלך (הגדרות ← אבטחה והתחברות ← אפליקציות ואתרים) ולבקש מחיקה בנוסף במייל.
          </p>
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
