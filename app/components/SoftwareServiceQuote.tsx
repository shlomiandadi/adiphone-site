import ServiceScopedQuoteSection from './ServiceScopedQuoteSection';

const FACTORS = [
  {
    title: 'היקף המערכת',
    text: 'מספר המודולים, המשתמשים, התהליכים העסקיים והדוחות — מ-MVP ועד מערכת ארגונית מלאה.',
  },
  {
    title: 'פיצ\'רים ואינטגרציות',
    text: 'חיבור ל-CRM, ERP, סליקה, API חיצוניים, מובייל או אתר — כל אינטגרציה מוסיפה אפיון, פיתוח ובדיקות.',
  },
  {
    title: 'ארכיטקטורה ואבטחה',
    text: 'דרישות הרשאות, הצפנה, סביבות ענן ורגולציה משפיעות על תכנון המערכת ועל משך העבודה.',
  },
  {
    title: 'לוח זמנים',
    text: 'פיתוח בשלבים (Agile), בדיקות קבלה והשקה — לוח הזמנים נקבע יחד איתכם אחרי האפיון.',
  },
] as const;

export default function SoftwareServiceQuote() {
  return (
    <ServiceScopedQuoteSection
      headingId="software-quote-heading"
      heading="כמה עולה פיתוח תוכנה בהתאמה אישית"
      intro="אין מחירון קבוע לפיתוח תוכנה ייעודי. העלות נקבעת לפי היקף המערכת, הפיצ'רים, האינטגרציות ולוח הזמנים — לא לפי חבילות בניית אתרים."
      factors={FACTORS}
      footerText="נשמח לשמוע על התהליך הייחודי שלכם ולהחזיר הצעת מחיר מסודרת אחרי שיחת אפיון."
      ctaLocation="software-pricing"
    />
  );
}
