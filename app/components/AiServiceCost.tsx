import Link from 'next/link';

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
    <section
      className="bg-gradient-to-b from-gray-50 to-white px-4 py-16 dark:from-gray-900 dark:to-gray-800"
      aria-labelledby="ai-cost-heading"
    >
      <div className="container mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2
            id="ai-cost-heading"
            className="mb-4 text-3xl font-bold text-gray-900 dark:text-white md:text-4xl"
          >
            כמה עולה פתרון AI לעסק
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400">
            אין באתר מחירון קבוע לשירותי בינה מלאכותית. המחיר נקבע אחרי שיחת אפיון, לפי מה שבאמת
            צריך לבנות ולא לפי חבילת בניית אתרים.
          </p>
        </div>

        <ul className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
          {FACTORS.map((factor) => (
            <li
              key={factor.title}
              className="flex h-full flex-col rounded-2xl bg-white p-8 shadow-xl dark:bg-gray-800"
            >
              <h3 className="mb-3 text-xl font-bold text-gray-900 dark:text-white">{factor.title}</h3>
              <p className="text-gray-700 dark:text-gray-300">{factor.text}</p>
            </li>
          ))}
        </ul>

        <div className="mt-12 text-center">
          <p className="mb-4 text-gray-600 dark:text-gray-400">
            נשמח לשמוע על התהליך בעסק ולהחזיר הצעה מותאמת — בלי מספרים גנריים ובלי התחייבות.
          </p>
          <Link
            href="/contact"
            data-cta="true"
            data-cta-location="ai-pricing"
            className="inline-block rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
          >
            קבלו הצעת מחיר
          </Link>
        </div>
      </div>
    </section>
  );
}
