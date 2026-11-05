import ServiceScopedQuoteSection from './ServiceScopedQuoteSection';

const FACTORS = [
  {
    title: 'היקף הפתרון',
    text: 'ייעוץ ואסטרטגיה, צ\'אטבוט לשירות, אוטומציה של תהליך אחד, או מערכת מותאמת עם כמה נקודות מגע.',
  },
  {
    title: 'אינטגרציות',
    text: 'חיבור לאתר, לוואטסאפ, ל-CRM, למערכת הזמנות או למקורות נתונים קיימים משנה את היקף העבודה.',
  },
  {
    title: 'נפח ושימוש',
    text: 'כמות פניות, שעות פעילות, שפות, והאם נדרש ליווי שוטף אחרי ההטמעה.',
  },
] as const;

export default function AiServiceCost() {
  return (
    <ServiceScopedQuoteSection
      headingId="ai-cost-heading"
      heading="כמה עולה פתרון AI לעסק"
      intro="אין באתר מחירון קבוע לשירותי בינה מלאכותית. המחיר נקבע אחרי שיחת אפיון, לפי היקף הפתרון, הפיצ'רים, האינטגרציות ולוח הזמנים — לא לפי חבילת בניית אתרים."
      factors={FACTORS}
      footerText="נשמח לשמוע על התהליך בעסק ולהחזיר הצעה מותאמת — בלי מספרים גנריים ובלי התחייבות."
      ctaLocation="ai-pricing"
    />
  );
}
