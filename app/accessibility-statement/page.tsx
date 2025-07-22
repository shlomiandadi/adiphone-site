import React from 'react';

export const metadata = {
  title: 'הצהרת נגישות',
  description: 'הצהרת נגישות של עדי פון תקשורת',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AccessibilityStatement() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-10">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8 text-right" dir="rtl">
        <h1 className="text-3xl font-bold mb-2">הצהרת נגישות</h1>
        <div className="text-sm text-gray-500 mb-6">עדכון אחרון: 23 ביולי 2025</div>
        <section className="mb-6">
          <h2 className="font-bold text-lg mb-2">1. כללי</h2>
          <p className="mb-2">
            אתר זה מופעל על ידי <b>עדי פון תקשורת</b> ומחויב להנגיש את האתר לכלל הציבור, לרבות אנשים עם מוגבלויות. אנו רואים חשיבות רבה בהנגשת השירותים הדיגיטליים שלנו, ופועלים לשיפור מתמיד של חוויית הגלישה לכל המשתמשים.
          </p>
        </section>
        <section className="mb-6">
          <h2 className="font-bold text-lg mb-2">2. אמצעי נגישות באתר</h2>
          <ul className="list-disc pr-6 mb-2 text-gray-700">
            <li>רכיב נגישות ייעודי (סרגל נגישות) המאפשר שינוי גודל גופן, ניגודיות, הדגשת קישורים ועוד.</li>
            <li>ניווט מלא באמצעות מקלדת (TAB, ENTER, ESC וכו').</li>
            <li>טקסט חלופי (alt) לכל התמונות באתר.</li>
            <li>מבנה כותרות היררכי וברור (H1, H2, H3 וכו').</li>
            <li>שימוש בצבעים עם ניגודיות גבוהה לטקסטים ואלמנטים חשובים.</li>
            <li>התאמה למכשירים ניידים (רספונסיביות מלאה).</li>
            <li>אפשרות להגדלת טקסטים בדפדפן.</li>
          </ul>
        </section>
        <section className="mb-6">
          <h2 className="font-bold text-lg mb-2">3. פניות בנושא נגישות</h2>
          <p className="mb-2">
            אם נתקלתם בבעיה כלשהי בנגישות האתר, נשמח שתעדכנו אותנו ונפעל לתקנה בהקדם האפשרי.
          </p>
          <ul className="list-disc pr-6 text-gray-700">
            <li>דוא"ל: <a href="mailto:shlomiandadi@gmail.com" className="text-blue-600 hover:underline">shlomiandadi@gmail.com</a></li>
            <li>טלפון: <a href="tel:0509159951" className="text-blue-600 hover:underline">050-9159951</a></li>
          </ul>
        </section>
        <section>
          <h2 className="font-bold text-lg mb-2">4. עדכון הצהרת נגישות</h2>
          <p>
            הצהרה זו עודכנה לאחרונה בתאריך 23 ביולי 2025, ועשויה להתעדכן מעת לעת.
          </p>
        </section>
      </div>
    </div>
  );
} 