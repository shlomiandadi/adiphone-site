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
            <li><strong>כפתור נגישות צף:</strong> כפתור נגישות עם אייקון כיסא גלגלים ממוקם בפינה הימנית התחתונה של האתר, המאפשר גישה מהירה לכל הגדרות הנגישות.</li>
            <li><strong>סרגל נגישות מתקדם:</strong> רכיב נגישות ייעודי המאפשר:
              <ul className="list-disc pr-6 mt-2">
                <li>שינוי גודל גופן (A+ / A-) עם אפשרות איפוס</li>
                <li>הפעלת ניגודיות גבוהה (רקע שחור, טקסט לבן)</li>
                <li>הדגשת קישורים (רקע צהוב לקישורים)</li>
                <li>שינוי גודל סמן העכבר (קטן, רגיל, גדול)</li>
                <li>שמירת העדפות המשתמש ב-localStorage</li>
                <li>איפוס כל ההגדרות למופעל</li>
              </ul>
            </li>
            <li><strong>ניווט מלא באמצעות מקלדת:</strong> תמיכה מלאה בניווט באמצעות Tab, Enter, ו-Esc.</li>
            <li><strong>טקסט חלופי (alt):</strong> לכל התמונות באתר מוגדר טקסט חלופי מתאים.</li>
            <li><strong>מבנה כותרות היררכי:</strong> שימוש נכון בכותרות H1, H2, H3 וכו' לניווט קל.</li>
            <li><strong>ניגודיות צבעים:</strong> שימוש בצבעים עם ניגודיות גבוהה לטקסטים ואלמנטים חשובים.</li>
            <li><strong>רספונסיביות מלאה:</strong> התאמה מלאה למכשירים ניידים וטאבלטים.</li>
            <li><strong>דילוג לתוכן הראשי:</strong> קישור "דלג לתוכן הראשי" בתחילת הדף לניווט מהיר.</li>
            <li><strong>סגנונות מיקוד:</strong> הדגשה ברורה של אלמנטים בעת ניווט במקלדת.</li>
          </ul>
        </section>
        <section className="mb-6">
          <h2 className="font-bold text-lg mb-2">3. הוראות שימוש</h2>
          <ul className="list-disc pr-6 mb-2 text-gray-700">
            <li><strong>כפתור הנגישות:</strong> לחץ על כפתור הנגישות (אייקון כיסא גלגלים) בפינה הימנית התחתונה כדי לפתוח את סרגל ההגדרות.</li>
            <li><strong>שינוי גודל גופן:</strong> השתמש בכפתורי A+ ו-A- להגדלה או הקטנה של הטקסט.</li>
            <li><strong>ניגודיות גבוהה:</strong> הפעל את "ניגודיות גבוהה" לקבלת רקע שחור וטקסט לבן.</li>
            <li><strong>הדגשת קישורים:</strong> הפעל "הדגש קישורים" כדי שכל הקישורים יודגשו ברקע צהוב.</li>
            <li><strong>גודל סמן:</strong> בחר בין קטן, רגיל או גדול לסמן העכבר.</li>
            <li><strong>ניווט במקלדת:</strong> השתמש ב-Tab לניווט בין אלמנטים, Enter לבחירה, ו-Esc לסגירה.</li>
          </ul>
        </section>
        <section className="mb-6">
          <h2 className="font-bold text-lg mb-2">4. פניות בנושא נגישות</h2>
          <p className="mb-2">
            אם נתקלתם בבעיה כלשהי בנגישות האתר, נשמח שתעדכנו אותנו ונפעל לתקנה בהקדם האפשרי.
          </p>
          <ul className="list-disc pr-6 text-gray-700">
            <li>דוא"ל: <a href="mailto:shlomiandadi@gmail.com" className="text-blue-600 hover:underline">shlomiandadi@gmail.com</a></li>
            <li>טלפון: <a href="tel:0509159951" className="text-blue-600 hover:underline">050-9159951</a></li>
          </ul>
        </section>
        <section>
          <h2 className="font-bold text-lg mb-2">5. עדכון הצהרת נגישות</h2>
          <p>
            הצהרה זו עודכנה לאחרונה בתאריך 23 ביולי 2025, ועשויה להתעדכן מעת לעת בהתאם לשיפורים בנגישות האתר.
          </p>
        </section>
      </div>
    </div>
  );
} 