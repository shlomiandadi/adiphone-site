import React from 'react';
import Link from 'next/link';

import { WHATSAPP_BASE } from '@/lib/whatsapp';
import { createSeoAgentGenerateMetadata } from '@/seo-agent-apply';
import LegalPageLayout, { LegalSection } from '../components/LegalPageLayout';

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

const TOC = [
  { id: 'what', label: 'איזה מידע ניתן למחוק' },
  { id: 'how', label: 'איך מגישים בקשה' },
  { id: 'facebook', label: 'הסרה דרך פייסבוק' },
  { id: 'after', label: 'מה קורה אחרי הבקשה' },
  { id: 'more', label: 'מידע נוסף' },
];

export default function DataDeletion() {
  return (
    <LegalPageLayout title="מחיקת נתוני משתמש" lastUpdated="עדכון אחרון: 25.10.2026" toc={TOC}>
        <LegalSection>
          <p>
            Top Webstak הוא שם מסחרי של עדי פון תקשורת (להלן: &quot;החברה&quot;, &quot;אנחנו&quot;), העוסקת בבניית אתרים, קידום אתרים ומערכות דיגיטליות.
          </p>
        </LegalSection>

        <LegalSection id="what" heading="איזה מידע ניתן למחוק">
          <p>
            ניתן לבקש מחיקה של כל הפרטים האישיים שמסרת לנו: שם, טלפון, דוא&quot;ל ותוכן הפנייה, שנאספו דרך טפסי לידים בפייסבוק או באינסטגרם או דרך טפסי האתר. המחיקה כוללת את הרשומה במסד הנתונים שלנו ואת היסטוריית ההתראות שנשלחו בגינה.
          </p>
        </LegalSection>

        <LegalSection id="how" heading="איך מגישים בקשה">
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
        </LegalSection>

        <LegalSection id="facebook" heading="הסרה דרך פייסבוק">
          <p>
            אפשר גם לפנות ישירות לעסק שאליו מילאת את הטופס, או להסיר את האפליקציה &quot;TopWebstak Leads&quot; מהגדרות פייסבוק שלך (הגדרות ← אבטחה והתחברות ← אפליקציות ואתרים) ולבקש מחיקה בנוסף במייל.
          </p>
        </LegalSection>

        <LegalSection id="after" heading="מה קורה אחרי הבקשה">
          <p>המחיקה תתבצע תוך 30 יום ממועד קבלת הבקשה, ולאחר מכן נשלח לך אישור על ביצוע המחיקה.</p>
        </LegalSection>

        <LegalSection id="more" heading="מידע נוסף">
          <p>
            פרטים נוספים על איסוף המידע והשימוש בו מופיעים ב
            <Link className="text-blue-700 hover:underline" href="/privacy-policy">מדיניות הפרטיות</Link>.
          </p>
        </LegalSection>
    </LegalPageLayout>
  );
}
