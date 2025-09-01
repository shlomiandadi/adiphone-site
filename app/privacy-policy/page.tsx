import React from 'react';

export const metadata = {
  title: 'מדיניות פרטיות | עדי פון תקשורת',
  description: 'מדיניות פרטיות בהתאם לתיקון 13 לחוק הגנת הפרטיות: מטרות עיבוד, בסיס משפטי, עוגיות, זכויות משתמשים ופרטי קשר.',
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-10">
      <div className="max-w-3xl w-full bg-white rounded-xl shadow-lg p-8 text-right" dir="rtl">
        <h1 className="text-3xl font-bold mb-2">מדיניות פרטיות</h1>
        <div className="text-sm text-gray-500 mb-6">עדכון אחרון: 1 בספטמבר 2025</div>

        <section className="mb-6">
          <h2 className="font-bold text-lg mb-2">1. מי אנחנו</h2>
          <p className="mb-2">
            עדי פון תקשורת (להלן: "החברה", "אנחנו"). מדיניות זו מסבירה כיצד אנו אוספים, משתמשים, שומרים וחולקים מידע אישי בקשר לאתר והשירותים שלנו.
          </p>
          <p>
            מדיניות זו מנוסחת בהתאם לעקרונות תיקון 13 לחוק הגנת הפרטיות, התשמ"א-1981, ודיני פרטיות רלוונטיים נוספים.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="font-bold text-lg mb-2">2. סוגי מידע שאנו אוספים</h2>
          <ul className="list-disc pr-5 mb-2 text-gray-700">
            <li className="mb-1">
              <b>מידע שמסרת לנו:</b> שם, דוא"ל, טלפון, תוכן פנייה, פרטי חברה, וכל מידע שתבחר למסור בטפסים או פניות שירות.
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
          <p>המידע מתקבל ממך ישירות (טפסים/פניות) ומאסוף אוטומטי בעת שימוש באתר (עוגיות, פיקסלים, יומני שרת).</p>
        </section>

        <section className="mb-6">
          <h2 className="font-bold text-lg mb-2">4. מטרות עיבוד והבסיס המשפטי</h2>
          <ul className="list-disc pr-5 mb-2 text-gray-700">
            <li className="mb-1"><b>מתן שירות ומענה לפניות</b> – ביצוע חוזה/פעולות טרום-חוזיות ולגיטימיות פעילות עסקית.</li>
            <li className="mb-1"><b>תקשורת שיווקית ודיוור</b> – בכפוף להסכמה; ניתן לבטל בכל עת.</li>
            <li className="mb-1"><b>אנליטיקה ושיפור השירות</b> – בכפוף להסכמה לעוגיות לא-חובה; אינטרס לגיטימי בשיפור האתר תוך צמצום פגיעה בפרטיות.</li>
            <li><b>עמידה בדרישות דין</b> – שמירת רשומות, אבטחה, ניהול סיכונים ומניעת הונאות.</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="font-bold text-lg mb-2">5. עוגיות (Cookies) וטכנולוגיות דומות</h2>
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
          <h2 className="font-bold text-lg mb-2">6. שיתוף מידע ומעבדי נתונים</h2>
          <ul className="list-disc pr-5 mb-2 text-gray-700">
            <li className="mb-1">ספקי תשתית ואחסון (למשל: Neon – PostgreSQL, פלטפורמת אירוח/פריסה כגון Netlify/Vercel).</li>
            <li className="mb-1">ספקי דוא"ל/תקשורת (לדוגמה: שירותי שליחת מיילים).</li>
            <li className="mb-1">ספקי מדידה ושיווק (Google, Meta) – בכפוף להסכמה.</li>
            <li>אכיפה/דין: מסירת מידע כנדרש לפי חוק/צו.</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="font-bold text-lg mb-2">7. העברות לחו"ל ומנגנוני הגנה</h2>
          <p>
            ייתכנו עיבוד/אחסון גם מחוץ לישראל. אנו נוקטים באמצעי הגנה מקובלים והתקשרויות חוזיות מתאימות מול ספקים (כגון תנאי שימוש, התחייבויות סודיות וסעיפי הגנה תקניים לפי הדין הרלוונטי).
          </p>
        </section>

        <section className="mb-6">
          <h2 className="font-bold text-lg mb-2">8. שמירת מידע</h2>
          <p>
            נשמור מידע כל עוד נדרש למטרות המתוארות במדיניות זו, בהתאם לדין, למחויבויות חוזיות, ולצרכי הגנה משפטית. מידע אנליטי עשוי להישמר בצורה מצרפית/מוזחת זהות.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="font-bold text-lg mb-2">9. אבטחת מידע</h2>
          <p>
            אנו מיישמים אמצעי אבטחה סבירים, לרבות בקרות גישה, הצפנה במעבר במידת האפשר, וניטור. יחד עם זאת, אין אבטחה מוחלטת.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="font-bold text-lg mb-2">10. זכויותיך</h2>
          <ul className="list-disc pr-5 mb-2 text-gray-700">
            <li className="mb-1">זכות לעיין במידע שעליך במאגר.</li>
            <li className="mb-1">זכות לבקש תיקון/מחיקה של מידע שאינו מדויק, שלם, או מעודכן.</li>
            <li className="mb-1">זכות להתנגד לשימוש למטרות שיווק ישיר ולהסרתך מדיוור.</li>
            <li>זכות למשוך הסכמה לעוגיות לא-הכרחיות בכל עת דרך אייקון העוגיות.</li>
          </ul>
          <p>נפעל בהתאם לדין וללוחות זמנים סבירים לבקשותיך.</p>
        </section>

        <section className="mb-6">
          <h2 className="font-bold text-lg mb-2">11. קטינים</h2>
          <p>
            השירות אינו מיועד לקטינים מתחת לגיל החל בדין החל ללא אישור הורה/אפוטרופוס כפי שנדרש. ככל שנודע לנו כי נאסף מידע מקטין בניגוד לדין – נפעל למחיקתו.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="font-bold text-lg mb-2">12. שינויים במדיניות</h2>
          <p>
            אנו עשויים לעדכן מדיניות זו מעת לעת. תאריך העדכון האחרון מופיע בראש העמוד. שינויים מהותיים ייכנסו לתוקף בתוך זמן סביר ממועד פרסומם באתר.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="font-bold text-lg mb-2">13. יצירת קשר</h2>
          <ul className="pr-5 text-gray-700">
            <li><b>שם העסק (בקר מידע):</b> עדי פון תקשורת</li>
            <li><b>דוא"ל לפניות פרטיות:</b> shlomiandadi@gmail.com</li>
            <li><b>טלפון:</b> 050-9159951</li>
          </ul>
        </section>

        <section>
          <h2 className="font-bold text-lg mb-2">נספח: קישורים למדיניות צד-שלישי</h2>
          <ul className="list-disc pr-5 text-blue-700">
            <li><a className="hover:underline" href="https://policies.google.com/privacy?hl=iw" target="_blank" rel="noopener noreferrer">Google Privacy</a></li>
            <li><a className="hover:underline" href="https://www.facebook.com/privacy/policy" target="_blank" rel="noopener noreferrer">Meta/Facebook Privacy</a></li>
            <li><a className="hover:underline" href="https://neon.tech/privacy" target="_blank" rel="noopener noreferrer">Neon Privacy</a></li>
            <li><a className="hover:underline" href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">Vercel Privacy</a> / <a className="hover:underline" href="https://www.netlify.com/privacy/" target="_blank" rel="noopener noreferrer">Netlify Privacy</a></li>
          </ul>
        </section>
      </div>
    </div>
  );
}