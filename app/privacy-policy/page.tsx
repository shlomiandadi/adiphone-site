import React from 'react';

import { createSeoAgentGenerateMetadata } from '@/seo-agent-apply';

const pageMetadata = {
  title: 'מדיניות פרטיות | עדי פון תקשורת',
  description: 'מדיניות פרטיות בהתאם לתיקון 13 לחוק הגנת הפרטיות: מטרות עיבוד, בסיס משפטי, עוגיות, זכויות משתמשים ופרטי קשר.',
  alternates: {
    canonical: '/privacy-policy',
  },
};

export const generateMetadata = createSeoAgentGenerateMetadata('/privacy-policy', pageMetadata);

const CONTACT_EMAIL = 'shlomiandadi@gmail.com';
const CONTACT_EMAIL_ALT = 'shlomimalfuf1@gmail.com';
const CONTACT_EMAIL_SUBJECT = encodeURIComponent('פנייה בנושא מדיניות פרטיות');

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-10">
      <div className="max-w-3xl w-full bg-white rounded-xl shadow-lg p-8 text-right" dir="rtl">
        <h1 className="text-3xl font-bold mb-2">מדיניות פרטיות</h1>
        <div className="text-sm text-gray-500 mb-6">עדכון אחרון: 25.10.2026</div>

        <section className="mb-6">
          <h2 className="font-bold text-lg mb-2">1. מי אנחנו</h2>
          <p className="mb-2">
            Top Webstak הוא שם מסחרי של עדי פון תקשורת (להלן: &quot;החברה&quot;, &quot;אנחנו&quot;), העוסקת בבניית אתרים, קידום אתרים ומערכות דיגיטליות.
          </p>
          <p>
            מדיניות זו מסבירה כיצד אנו אוספים, משתמשים, שומרים וחולקים מידע אישי בקשר לאתר זה ולשירותים שלנו. המדיניות מנוסחת בהתאם לעקרונות תיקון 13 לחוק הגנת הפרטיות, התשמ&quot;א-1981.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="font-bold text-lg mb-2">2. סוגי מידע שאנו אוספים</h2>
          <ul className="list-disc pr-5 mb-2 text-gray-700">
            <li className="mb-1">
              <b>מידע שמסרת לנו:</b> שם, דוא&quot;ל, טלפון, תוכן פנייה, פרטי חברה, וכל מידע שתבחר למסור בטפסים או פניות שירות.
            </li>
            <li className="mb-1">
              <b>מידע טכני ושימושי:</b> כתובת IP (במקרים מסוימים), סוג דפדפן ומערכת הפעלה, זמני ביקור, עמודים נצפים, מזהי עוגיות/פיקסלים; נאסף בכלים כגון Google Analytics ו-Meta Pixel בכפוף להסכמה.
            </li>
            <li>
              <b>מטא-נתונים ותקשורת:</b> תכתובות שירות, תגובות לתכנים, העדפות עוגיות.
            </li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="font-bold text-lg mb-2">3. מקורות המידע</h2>
          <p>המידע מתקבל ממך ישירות (טפסים/פניות), מטפסי לידים בפייסבוק ובאינסטגרם (Lead Ads) ומאסוף אוטומטי בעת שימוש באתר (עוגיות, פיקסלים, יומני שרת).</p>
        </section>

        <section className="mb-6">
          <h2 className="font-bold text-lg mb-2">4. מידע שמתקבל מפייסבוק ואינסטגרם (Lead Ads)</h2>
          <p>
            באישור בעל עמוד הפייסבוק, אנו מתחברים לטפסי לידים (Lead Ads) של העמוד. כאשר אדם ממלא טופס כזה, מטא שולחת לשרת שלנו התראה, ואנו שולפים דרך ה-API של מטא את הפרטים שהאדם בחר למסור בטופס (בדרך כלל שם, טלפון, דוא&quot;ל ותשובות לשאלות הטופס), את מזהה הטופס והמודעה ואת זמן המילוי. המידע נשמר במסד נתונים מאובטח ומוצג רק לבעל העסק שהליד שייך לו. איננו משתמשים בנתוני הלידים לפרסום, לבניית פרופילים או לכל מטרה אחרת, איננו מוכרים אותם ואיננו משתפים אותם עם צד שלישי. השימוש בנתוני מטא כפוף לתנאי הפלטפורמה של מטא.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="font-bold text-lg mb-2">5. מטרות עיבוד והבסיס המשפטי</h2>
          <ul className="list-disc pr-5 mb-2 text-gray-700">
            <li className="mb-1"><b>מתן שירות ומענה לפניות</b> – ביצוע חוזה/פעולות טרום-חוזיות ולגיטימיות פעילות עסקית.</li>
            <li className="mb-1"><b>תקשורת שיווקית ודיוור</b> – בכפוף להסכמה; ניתן לבטל בכל עת.</li>
            <li className="mb-1"><b>אנליטיקה ושיפור השירות</b> – בכפוף להסכמה לעוגיות לא-חובה; אינטרס לגיטימי בשיפור האתר תוך צמצום פגיעה בפרטיות.</li>
            <li><b>עמידה בדרישות דין</b> – שמירת רשומות, אבטחה, ניהול סיכונים ומניעת הונאות.</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="font-bold text-lg mb-2">6. עוגיות (Cookies) וטכנולוגיות דומות</h2>
          <p className="mb-2">
            באתר פועל מנגנון הסכמה לעוגיות. עוגיות הכרחיות נטענות תמיד; עוגיות לא-הכרחיות (אנליטיקה, שיווק, פונקציונליות) נטענות רק בכפוף להסכמתך.
          </p>
          <ul className="list-disc pr-5 mb-2 text-gray-700">
            <li className="mb-1"><b>הכרחי</b> – תפקוד בסיסי ואבטחה.</li>
            <li className="mb-1"><b>אנליטיקה</b> – מדידה ושיפור חווית שימוש (למשל Google Analytics).</li>
            <li className="mb-1"><b>שיווק</b> – התאמת פרסום (למשל Meta/Facebook Pixel).</li>
            <li><b>פונקציונליות</b> – התאמות חוויית משתמש.</li>
          </ul>
          <p>
            ניתן לשנות העדפות בכל עת באמצעות לחיצה על אייקון העוגיות הצף באתר. ניתן גם לחסום/למחוק עוגיות דרך הגדרות הדפדפן.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="font-bold text-lg mb-2">7. שיתוף מידע ומעבדי נתונים</h2>
          <p className="mb-2">
            אנו משתמשים רק בספקים הבאים: Neon (מסד נתונים), Netlify (אירוח ופונקציות שרת), ו-WhatsApp Cloud API של מטא (התראות על לידים). בנוסף פועלים באתר זה ספקי מדידה (Google Analytics, Meta Pixel) בכפוף להסכמה. מסירת מידע לרשויות תתבצע רק כנדרש בדין או בצו.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="font-bold text-lg mb-2">8. העברות לחו&quot;ל ומנגנוני הגנה</h2>
          <p>
            ייתכנו עיבוד/אחסון גם מחוץ לישראל. אנו נוקטים באמצעי הגנה מקובלים והתקשרויות חוזיות מתאימות מול ספקים (כגון תנאי שימוש, התחייבויות סודיות וסעיפי הגנה תקניים לפי הדין הרלוונטי).
          </p>
        </section>

        <section className="mb-6">
          <h2 className="font-bold text-lg mb-2">9. שמירת מידע</h2>
          <p>
            פרטי לידים נשמרים רק כל עוד נדרש לטיפול בפנייה ולניהול עסקי סביר, ולא יותר מ-12 חודשים ממועד קבלתם, ובסיומם הם נמחקים. בקשת מחיקה מטופלת תוך 30 יום (ראו עמוד מחיקת הנתונים). מידע אנליטי עשוי להישמר בצורה מצרפית/מוזחת זהות.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="font-bold text-lg mb-2">10. אבטחת מידע</h2>
          <p>
            אנו מיישמים אמצעי אבטחה סבירים, לרבות בקרות גישה, הצפנה במעבר במידת האפשר, וניטור. יחד עם זאת, אין אבטחה מוחלטת.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="font-bold text-lg mb-2">11. זכויותיך</h2>
          <ul className="list-disc pr-5 mb-2 text-gray-700">
            <li className="mb-1">זכות לעיין במידע שעליך במאגר.</li>
            <li className="mb-1">זכות לבקש תיקון/מחיקה של מידע שאינו מדויק, שלם, או מעודכן.</li>
            <li className="mb-1">זכות להתנגד לשימוש למטרות שיווק ישיר ולהסרתך מדיוור.</li>
            <li>זכות למשוך הסכמה לעוגיות לא-הכרחיות בכל עת דרך אייקון העוגיות.</li>
          </ul>
          <p>נפעל בהתאם לדין וללוחות זמנים סבירים לבקשותיך.</p>
        </section>

        <section className="mb-6">
          <h2 className="font-bold text-lg mb-2">12. קטינים</h2>
          <p>
            השירות אינו מיועד לקטינים מתחת לגיל החל בדין החל ללא אישור הורה/אפוטרופוס כפי שנדרש. ככל שנודע לנו כי נאסף מידע מקטין בניגוד לדין – נפעל למחיקתו.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="font-bold text-lg mb-2">13. שינויים במדיניות</h2>
          <p>
            אנו עשויים לעדכן מדיניות זו מעת לעת. תאריך העדכון האחרון מופיע בראש העמוד. שינויים מהותיים ייכנסו לתוקף בתוך זמן סביר ממועד פרסומם באתר.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="font-bold text-lg mb-2">14. יצירת קשר</h2>
          <ul className="pr-5 text-gray-700">
            <li><b>שם העסק (בקר מידע):</b> Top Webstak (שם מסחרי של עדי פון תקשורת)</li>
            <li>
              <b>דוא&quot;ל לפניות פרטיות:</b>{' '}
              <a className="text-blue-700 hover:underline" href={`mailto:${CONTACT_EMAIL}?subject=${CONTACT_EMAIL_SUBJECT}`}>
                {CONTACT_EMAIL}
              </a>
              {' '}או{' '}
              <a className="text-blue-700 hover:underline" href={`mailto:${CONTACT_EMAIL_ALT}?subject=${CONTACT_EMAIL_SUBJECT}`}>
                {CONTACT_EMAIL_ALT}
              </a>
            </li>
            <li><b>טלפון:</b> 050-9159951</li>
            <li><b>כתובת:</b> זמיר 95, פרדס חנה</li>
          </ul>
        </section>

        <section>
          <h2 className="font-bold text-lg mb-2">נספח: קישורים למדיניות צד-שלישי</h2>
          <ul className="list-disc pr-5 text-blue-700">
            <li><a className="hover:underline" href="https://policies.google.com/privacy?hl=iw" target="_blank" rel="noopener noreferrer">Google Privacy</a></li>
            <li><a className="hover:underline" href="https://www.facebook.com/privacy/policy" target="_blank" rel="noopener noreferrer">Meta/Facebook Privacy</a></li>
            <li><a className="hover:underline" href="https://neon.tech/privacy" target="_blank" rel="noopener noreferrer">Neon Privacy</a></li>
            <li><a className="hover:underline" href="https://www.netlify.com/privacy/" target="_blank" rel="noopener noreferrer">Netlify Privacy</a></li>
          </ul>
        </section>
      </div>
    </div>
  );
}
