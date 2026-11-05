import ServiceScopedQuoteSection from './ServiceScopedQuoteSection';

const FACTORS = [
  {
    title: 'היקף ופיצ\'רים',
    text: 'מספר המסכים, תהליכי המשתמש, חשבונות, התראות push ורכישות — במיוחד בגרסה הראשונה (MVP).',
  },
  {
    title: 'פלטפורמות וטכנולוגיה',
    text: 'iOS, Android או שתיהן; פיתוח נייטיב, היברידי או קרוס-פלטפורם — לפי דרישות הביצועים והתחזוקה.',
  },
  {
    title: 'אינטגרציות ולוח זמנים',
    text: 'צד-שרת, CRM, סליקה, מערכות קיימות, בדיקות והעלאה לחנויות — כולם משפיעים על משך הפיתוח והעלות.',
  },
] as const;

export default function MobileAppServiceQuote() {
  return (
    <ServiceScopedQuoteSection
      headingId="mobile-app-quote-heading"
      heading="כמה עולה לבנות אפליקציה"
      intro="אין מחירון קבוע לפיתוח אפליקציות. ההצעה נקבעת אחרי אפיון, לפי היקף הפיצ'רים, האינטגרציות, הפלטפורמות ולוח הזמנים — לא לפי מחירון בניית אתרים."
      factors={FACTORS}
      footerText="אחרי שיחת ייעוץ קצרה נבין מה באמת צריך ונחזיר הצעה מותאמת — בלי התחייבות."
      ctaLocation="mobile-app-pricing"
      ctaLabel="קבעו שיחת ייעוץ"
    />
  );
}
