import React from 'react';

import { createSeoAgentGenerateMetadata } from '@/seo-agent-apply';
import LegalPageLayout, { LegalSection } from '../components/LegalPageLayout';

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

const TOC = [
  { id: 'who', label: '1. מי אנחנו' },
  { id: 'types', label: '2. סוגי מידע שאנו אוספים' },
  { id: 'sources', label: '3. מקורות המידע' },
  { id: 'lead-ads', label: '4. מידע שמתקבל מפייסבוק ואינסטגרם (Lead Ads)' },
  { id: 'purposes', label: '5. מטרות עיבוד והבסיס המשפטי' },
  { id: 'cookies', label: '6. עוגיות (Cookies) וטכנולוגיות דומות' },
  { id: 'processors', label: '7. שיתוף מידע ומעבדי נתונים' },
  { id: 'transfers', label: '8. העברות לחו"ל ומנגנוני הגנה' },
  { id: 'retention', label: '9. שמירת מידע' },
  { id: 'security', label: '10. אבטחת מידע' },
  { id: 'rights', label: '11. זכויותיך' },
  { id: 'minors', label: '12. קטינים' },
  { id: 'changes', label: '13. שינויים במדיניות' },
  { id: 'contact', label: '14. יצירת קשר' },
  { id: 'appendix', label: 'נספח: קישורים למדיניות צד-שלישי' },
];

export default function PrivacyPolicy() {
  return (
    <LegalPageLayout title="מדיניות פרטיות" lastUpdated="עדכון אחרון: 25.10.2026" toc={TOC}>
        <LegalSection id="who" heading="1. מי אנחנו">
          <p className="mb-2">
            Top Webstak הוא שם מסחרי של עדי פון תקשורת (להלן: &quot;החברה&quot;, &quot;אנחנו&quot;), העוסקת בבניית אתרים, קידום אתרים ומערכות דיגיטליות.
          </p>
          <p>
            מדיניות זו מסבירה כיצד אנו אוספים, משתמשים, שומרים וחולקים מידע אישי בקשר לאתר זה ולשירותים שלנו. המדיניות מנוסחת בהתאם לעקרונות תיקון 13 לחוק הגנת הפרטיות, התשמ&quot;א-1981.
          </p>
        </LegalSection>

        <LegalSection id="types" heading="2. סוגי מידע שאנו אוספים">
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
        </LegalSection>

        <LegalSection id="sources" heading="3. מקורות המידע">
          <p>המידע מתקבל ממך ישירות (טפסים/פניות), מטפסי לידים בפייסבוק ובאינסטגרם (Lead Ads) ומאסוף אוטומטי בעת שימוש באתר (עוגיות, פיקסלים, יומני שרת).</p>
        </LegalSection>

        <LegalSection id="lead-ads" heading="4. מידע שמתקבל מפייסבוק ואינסטגרם (Lead Ads)">
          <p>
            באישור בעל עמוד הפייסבוק, אנו מתחברים לטפסי לידים (Lead Ads) של העמוד. כאשר אדם ממלא טופס כזה, מטא שולחת לשרת שלנו התראה, ואנו שולפים דרך ה-API של מטא את הפרטים שהאדם בחר למסור בטופס (בדרך כלל שם, טלפון, דוא&quot;ל ותשובות לשאלות הטופס), את מזהה הטופס והמודעה ואת זמן המילוי. המידע נשמר במסד נתונים מאובטח ומוצג רק לבעל העסק שהליד שייך לו. איננו משתמשים בנתוני הלידים לפרסום, לבניית פרופילים או לכל מטרה אחרת, איננו מוכרים אותם ואיננו משתפים אותם עם צד שלישי. השימוש בנתוני מטא כפוף לתנאי הפלטפורמה של מטא.
          </p>
        </LegalSection>

        <LegalSection id="purposes" heading="5. מטרות עיבוד והבסיס המשפטי">
          <ul className="list-disc pr-5 mb-2 text-gray-700">
            <li className="mb-1"><b>מתן שירות ומענה לפניות</b> – ביצוע חוזה/פעולות טרום-חוזיות ולגיטימיות פעילות עסקית.</li>
            <li className="mb-1"><b>תקשורת שיווקית ודיוור</b> – בכפוף להסכמה; ניתן לבטל בכל עת.</li>
            <li className="mb-1"><b>אנליטיקה ושיפור השירות</b> – בכפוף להסכמה לעוגיות לא-חובה; אינטרס לגיטימי בשיפור האתר תוך צמצום פגיעה בפרטיות.</li>
            <li><b>עמידה בדרישות דין</b> – שמירת רשומות, אבטחה, ניהול סיכונים ומניעת הונאות.</li>
          </ul>
        </LegalSection>

        <LegalSection id="cookies" heading="6. עוגיות (Cookies) וטכנולוגיות דומות">
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
        </LegalSection>

        <LegalSection id="processors" heading="7. שיתוף מידע ומעבדי נתונים">
          <p className="mb-2">
            אנו משתמשים רק בספקים הבאים: Neon (מסד נתונים), Netlify (אירוח ופונקציות שרת), ו-WhatsApp Cloud API של מטא (התראות על לידים). בנוסף פועלים באתר זה ספקי מדידה (Google Analytics, Meta Pixel) בכפוף להסכמה. מסירת מידע לרשויות תתבצע רק כנדרש בדין או בצו. לפני מסירת מידע לרשות נבדקת חוקיות הבקשה, ונמסר רק המידע המינימלי הנדרש.
          </p>
        </LegalSection>

        <LegalSection id="transfers" heading="8. העברות לחו&quot;ל ומנגנוני הגנה">
          <p>
            ייתכנו עיבוד/אחסון גם מחוץ לישראל. אנו נוקטים באמצעי הגנה מקובלים והתקשרויות חוזיות מתאימות מול ספקים (כגון תנאי שימוש, התחייבויות סודיות וסעיפי הגנה תקניים לפי הדין הרלוונטי).
          </p>
        </LegalSection>

        <LegalSection id="retention" heading="9. שמירת מידע">
          <p>
            פרטי לידים נשמרים רק כל עוד נדרש לטיפול בפנייה ולניהול עסקי סביר, ולא יותר מ-12 חודשים ממועד קבלתם, ובסיומם הם נמחקים. בקשת מחיקה מטופלת תוך 30 יום (ראו עמוד מחיקת הנתונים). מידע אנליטי עשוי להישמר בצורה מצרפית/מוזחת זהות.
          </p>
        </LegalSection>

        <LegalSection id="security" heading="10. אבטחת מידע">
          <p>
            אנו מיישמים אמצעי אבטחה סבירים, לרבות בקרות גישה, הצפנה במעבר במידת האפשר, וניטור. יחד עם זאת, אין אבטחה מוחלטת.
          </p>
        </LegalSection>

        <LegalSection id="rights" heading="11. זכויותיך">
          <ul className="list-disc pr-5 mb-2 text-gray-700">
            <li className="mb-1">זכות לעיין במידע שעליך במאגר.</li>
            <li className="mb-1">זכות לבקש תיקון/מחיקה של מידע שאינו מדויק, שלם, או מעודכן.</li>
            <li className="mb-1">זכות להתנגד לשימוש למטרות שיווק ישיר ולהסרתך מדיוור.</li>
            <li>זכות למשוך הסכמה לעוגיות לא-הכרחיות בכל עת דרך אייקון העוגיות.</li>
          </ul>
          <p>נפעל בהתאם לדין וללוחות זמנים סבירים לבקשותיך.</p>
        </LegalSection>

        <LegalSection id="minors" heading="12. קטינים">
          <p>
            השירות אינו מיועד לקטינים מתחת לגיל החל בדין החל ללא אישור הורה/אפוטרופוס כפי שנדרש. ככל שנודע לנו כי נאסף מידע מקטין בניגוד לדין – נפעל למחיקתו.
          </p>
        </LegalSection>

        <LegalSection id="changes" heading="13. שינויים במדיניות">
          <p>
            אנו עשויים לעדכן מדיניות זו מעת לעת. תאריך העדכון האחרון מופיע בראש העמוד. שינויים מהותיים ייכנסו לתוקף בתוך זמן סביר ממועד פרסומם באתר.
          </p>
        </LegalSection>

        <LegalSection id="contact" heading="14. יצירת קשר">
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
        </LegalSection>

        <LegalSection id="appendix" heading="נספח: קישורים למדיניות צד-שלישי">
          <ul className="list-disc pr-5 text-blue-700">
            <li><a className="hover:underline" href="https://policies.google.com/privacy?hl=iw" target="_blank" rel="noopener noreferrer">Google Privacy</a></li>
            <li><a className="hover:underline" href="https://www.facebook.com/privacy/policy" target="_blank" rel="noopener noreferrer">Meta/Facebook Privacy</a></li>
            <li><a className="hover:underline" href="https://neon.tech/privacy" target="_blank" rel="noopener noreferrer">Neon Privacy</a></li>
            <li><a className="hover:underline" href="https://www.netlify.com/privacy/" target="_blank" rel="noopener noreferrer">Netlify Privacy</a></li>
          </ul>
        </LegalSection>
    </LegalPageLayout>
  );
}
