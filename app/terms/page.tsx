import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'תנאי שימוש | עדי פון תקשורת',
  description: 'תנאי השימוש באתר ובשירותי Top Webstak מבית עדי פון תקשורת.',
  alternates: {
    canonical: '/terms',
  },
};

const CONTACT_EMAIL = 'shlomiandadi@gmail.com';
const CONTACT_EMAIL_ALT = 'shlomimalfuf1@gmail.com';
const CONTACT_EMAIL_SUBJECT = encodeURIComponent('פנייה בנושא תנאי שימוש');

export default function TermsOfUse() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-10">
      <div className="max-w-3xl w-full bg-white rounded-xl shadow-lg p-8 text-right" dir="rtl">
        <h1 className="text-3xl font-bold mb-2">תנאי שימוש</h1>
        <div className="text-sm text-gray-500 mb-6">עדכון אחרון: 25.10.2026</div>

        <section className="mb-6">
          <h2 className="font-bold text-lg mb-2">1. אודות השירות</h2>
          <p>
            Top Webstak הוא שם מסחרי של עדי פון תקשורת (להלן: &quot;החברה&quot;, &quot;אנחנו&quot;), העוסקת בבניית אתרים, קידום אתרים ומערכות דיגיטליות. שירות Top Webstak כולל בניית אתרים, קידום אתרים (SEO) וניהול וקידום ברשתות חברתיות. תנאים אלה חלים על השימוש באתר adi-phone.co.il ועל השירותים הניתנים במסגרתו.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="font-bold text-lg mb-2">2. שימוש באתר ובשירותים</h2>
          <p className="mb-2">
            האתר והשירותים ניתנים כפי שהם (as-is). אין אנו מתחייבים לדירוג, לתוצאות או להישגים מסוימים במנועי חיפוש, ברשתות חברתיות או בכל ערוץ אחר.
          </p>
          <p className="mb-2">
            הלקוח אחראי לספק תוכן חוקי, מדויק ומעודכן, וכן את כל ההרשאות, הרישיונות והזכויות הנדרשים לשימוש בתוכן, בסימנים ובחומרים שהוא מוסר לנו.
          </p>
          <p>
            השימוש באתר ובשירותים מותר למטרות חוקיות בלבד. אין לעשות שימוש הפוגע באתר, בשירותים או בצדדים שלישיים.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="font-bold text-lg mb-2">3. שימוש בנתוני לידים</h2>
          <p>
            פרטים הנמסרים באמצעות טפסי האתר או באמצעות טפסי לידים בפייסבוק ובאינסטגרם משמשים אותנו רק למענה לפנייה ולמתן השירות. אין אנו מוכרים פרטים אלה לצדדים שלישיים.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="font-bold text-lg mb-2">4. גישה לנתוני לידים של לקוחות</h2>
          <p>
            כדי לקבל לידים מעמוד פייסבוק של לקוח, הלקוח (או מי שמנהל את העמוד בשמו) מאשר לנו במפורש גישה לטפסי הלידים של העמוד, ויכול לבטל את הגישה בכל עת דרך הגדרות העסק או העמוד שלו בפייסבוק או בפנייה אלינו. הלקוח מצהיר כי הוא מנהל מורשה של העמוד, וכי הוא אחראי לכך שבטפסי הלידים שלו מוצגת הודעת פרטיות ושיש לו בסיס חוקי לאסוף את פרטי הפונים. אנו פועלים כמעבד מידע מטעם הלקוח: הלידים שייכים ללקוח, מוצגים רק לו, ומשמשים רק למסירת הפנייה אליו. בסיום ההתקשרות או לפי בקשה נמחק את נתוני הלקוח.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="font-bold text-lg mb-2">5. פרטיות</h2>
          <p>
            מידע נוסף על איסוף המידע ועל השימוש בו מופיע ב
            <Link className="text-blue-700 hover:underline" href="/privacy-policy">מדיניות הפרטיות</Link>
            . ניתן לבקש מחיקת נתונים לפי{' '}
            <Link className="text-blue-700 hover:underline" href="/data-deletion">עמוד מחיקת הנתונים</Link>.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="font-bold text-lg mb-2">6. קניין רוחני</h2>
          <p>
            כל הזכויות באתר, בעיצובו, בתוכנו וביצירות שמקורן בנו שמורות לנו או לבעלי הזכויות הרלוונטיים, אלא אם צוין אחרת. אין להעתיק, להפיץ או להשתמש בחומרים אלה ללא אישור מראש. תוכן שהלקוח מוסר נותר בבעלותו; הלקוח מעניק לנו רישיון להשתמש בו לצורך מתן השירות.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="font-bold text-lg mb-2">7. הגבלת אחריות</h2>
          <p>
            במידה המרבית המותרת על פי דין, לא נהיה אחראים לנזק עקיף, תוצאתי או מיוחד, או לאובדן הכנסות, נתונים או הזדמנויות עסקיות, הנובעים מהשימוש באתר או בשירותים.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="font-bold text-lg mb-2">8. שינויים בתנאים</h2>
          <p>
            אנו רשאים לעדכן תנאים אלה מעת לעת. תאריך העדכון האחרון מופיע בראש העמוד. המשך שימוש באתר או בשירותים לאחר פרסום השינוי מהווה הסכמה לתנאים המעודכנים.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="font-bold text-lg mb-2">9. הדין החל</h2>
          <p>
            על תנאים אלה ועל השימוש באתר ובשירותים יחול דין מדינת ישראל, וסמכות השיפוט תהיה לבתי המשפט המוסמכים בישראל.
          </p>
        </section>

        <section>
          <h2 className="font-bold text-lg mb-2">10. יצירת קשר</h2>
          <p className="mb-2">
            <b>בדוא&quot;ל:</b>{' '}
            <a className="text-blue-700 hover:underline" href={`mailto:${CONTACT_EMAIL}?subject=${CONTACT_EMAIL_SUBJECT}`}>
              {CONTACT_EMAIL}
            </a>
            {' '}או{' '}
            <a className="text-blue-700 hover:underline" href={`mailto:${CONTACT_EMAIL_ALT}?subject=${CONTACT_EMAIL_SUBJECT}`}>
              {CONTACT_EMAIL_ALT}
            </a>
          </p>
          <p><b>טלפון:</b> 050-9159951</p>
        </section>
      </div>
    </div>
  );
}
