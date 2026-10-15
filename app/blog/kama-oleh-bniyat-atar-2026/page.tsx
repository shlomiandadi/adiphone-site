import Link from 'next/link';
import Hero3D from '../../components/hero3d/Hero3D';
import { PRICING_ADDONS, PRICING_PACKAGES } from '../../../lib/pricing';

const FAQ = [
  {
    question: 'כמה עולה בניית אתר תדמית ב-2026?',
    answer:
      'במחירון של Top Webstak אתר תדמית מתחיל מ-6,500 ₪ לעד 6–8 עמודים. המחיר הסופי תלוי בהיקף העמודים, בעיצוב ובתוכן שצריך לכתוב.',
  },
  {
    question: 'כמה עולה דף נחיתה?',
    answer:
      'דף נחיתה לעמוד אחד ממוקד מתחיל מ-2,500 ₪. זה מתאים לקמפיין או לשירות בודד, לא לאתר מלא.',
  },
  {
    question: 'כמה עולה חנות אונליין?',
    answer:
      'חנות אונליין עם סליקה ישראלית ומשלוחים מתחילה מ-12,000 ₪, עד כ-50 מוצרים. קטלוג גדול יותר או אינטגרציות מורכבות מייקרים את ההצעה.',
  },
  {
    question: 'מתי צריך מערכת מותאמת במקום אתר רגיל?',
    answer:
      'כשיש תהליך עסקי שלא נכנס לתבנית: הזמנות מותאמות, אזור לקוחות, חיבור למערכת קיימת. פיתוח מותאם מתחיל מ-20,000 ₪ אחרי אפיון.',
  },
  {
    question: 'מה לא כלול במחיר הפתיחה?',
    answer:
      'תחזוקה (250–500 ₪ לחודש), אחסון מנוהל (50–150 ₪ לחודש), כתיבת תוכן (250–400 ₪ לעמוד) וקידום חודשי הם תוספות לפי הצורך. פירוט באותו מחירון.',
  },
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: { '@type': 'Answer', text: item.answer },
  })),
};

export default function WebsiteCostGuidePage() {
  return (
    <div className="min-h-screen bg-white" dir="rtl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Hero3D
        theme="pricing"
        title="כמה עולה בניית אתר ב-2026"
        subtitle="טווחי מחירים שקופים לדף נחיתה, אתר תדמית, חנות ומערכת – לפי המחירון של Top Webstak. בלי מספרים שהמצאנו מעבר למה שכבר מפורסם."
        align="center"
        ctas={[
          { href: '/pricing', label: 'למחירון המלא' },
          { href: '/contact#contact-form', label: 'הצעת מחיר', variant: 'secondary' },
        ]}
      />

      <article className="container mx-auto max-w-3xl px-4 py-16 text-right">
        <p className="mb-6 text-lg leading-relaxed text-gray-700">
          השאלה הראשונה שבעלי עסקים שואלים היא כמה עולה בניית אתר. התשובה הקצרה ל-2026, לפי{' '}
          <Link href="/pricing" className="font-semibold text-blue-700 underline">
            המחירון שלנו
          </Link>
          : דף נחיתה מתחיל מ-2,500 ₪, אתר תדמית מ-6,500 ₪, חנות אונליין מ-12,000 ₪, ומערכת מותאמת מ-20,000 ₪.
        </p>
        <p className="mb-10 text-lg leading-relaxed text-gray-700">
          אלה מחירי פתיחה, לא הצעת סגירה. האתר של קליניקה עם ארבעה עמודים לא עולה כמו חנות עם סליקה, מלאי ומשלוחים. בהמשך העמוד יש טבלה, מה מייקר או מוזיל, ומה כדאי לשאול לפני שחותמים. לפירוט השירות:{' '}
          <Link href="/services/web-development" className="font-semibold text-blue-700 underline">
            בניית אתרים
          </Link>
          {' '}ו{' '}
          <Link href="/services/website-tadmit" className="font-semibold text-blue-700 underline">
            בניית אתר תדמית
          </Link>
          .
        </p>

        <h2 className="mb-4 text-3xl font-bold text-gray-900">טבלת מחירים לבניית אתר ב-2026</h2>
        <div className="mb-10 overflow-x-auto rounded-xl border border-gray-200">
          <table className="min-w-full text-right text-sm md:text-base">
            <thead className="bg-slate-900 text-white">
              <tr>
                <th className="px-4 py-3 font-semibold">סוג האתר</th>
                <th className="px-4 py-3 font-semibold">מחיר פתיחה</th>
                <th className="px-4 py-3 font-semibold">מה כלול בקצרה</th>
              </tr>
            </thead>
            <tbody>
              {PRICING_PACKAGES.map((pkg) => (
                <tr key={pkg.id} className="border-t border-gray-100 even:bg-gray-50">
                  <td className="px-4 py-3 font-semibold text-gray-900">{pkg.name}</td>
                  <td className="px-4 py-3 text-gray-800">{pkg.priceLabel}</td>
                  <td className="px-4 py-3 text-gray-700">{pkg.summary}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="mb-4 text-3xl font-bold text-gray-900">מה משפיע על המחיר</h2>
        <ul className="mb-10 list-disc space-y-2 pr-6 text-lg text-gray-700">
          <li>מספר העמודים והאם צריך חנות, אזור אישי או חיבור למערכת קיימת.</li>
          <li>עיצוב מותאם מול מבנה פשוט יותר, והאם יש חומר גרפי מוכן.</li>
          <li>כתיבת תוכן: במחירון כתיבה עולה 250–400 ₪ לעמוד כשצריך לנסח מאפס.</li>
          <li>תחזוקה ואחסון אחרי ההשקה: 250–500 ₪ לחודש תחזוקה, 50–150 ₪ לחודש אחסון מנוהל.</li>
        </ul>

        <h2 className="mb-4 text-3xl font-bold text-gray-900">תוספות נפוצות</h2>
        <ul className="mb-10 list-disc space-y-2 pr-6 text-lg text-gray-700">
          {PRICING_ADDONS.map((addon) => (
            <li key={addon.name}>
              <strong>{addon.name}:</strong> {addon.priceLabel}. {addon.detail}
            </li>
          ))}
        </ul>

        <h2 className="mb-6 text-3xl font-bold text-gray-900">שאלות נפוצות</h2>
        <div className="space-y-4">
          {FAQ.map((item) => (
            <div key={item.question} className="rounded-xl border border-gray-100 p-6 shadow-sm">
              <h3 className="mb-2 text-xl font-semibold text-gray-900">{item.question}</h3>
              <p className="text-gray-700">{item.answer}</p>
            </div>
          ))}
        </div>

        <p className="mt-10 text-lg text-gray-700">
          רוצים מספר מדויק לעסק שלכם? השאירו פרטים ב
          <Link href="/contact#contact-form" className="font-semibold text-blue-700 underline">
            טופס יצירת הקשר
          </Link>
          {' '}או עברו ל
          <Link href="/services/web-development" className="font-semibold text-blue-700 underline">
            בניית אתרים
          </Link>
          .
        </p>
      </article>
    </div>
  );
}
