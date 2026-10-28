import Link from 'next/link';
import BlogPostSchema from '../../components/BlogPostSchema';
import Hero3D from '../../components/hero3d/Hero3D';
import ServiceCtaBanner from '../../components/ServiceCtaBanner';
import { absoluteUrl } from '../../../lib/seo';
import {
  PRICING_ADDONS,
  PRICING_PACKAGES,
  PRICING_ARTICLE_WHATSAPP_TEXT,
} from '../../../lib/pricing';
import {
  ARTICLE_DESCRIPTION,
  ARTICLE_HEADLINE,
  ARTICLE_IMAGE_PATH,
  ARTICLE_MODIFIED,
  ARTICLE_PUBLISHED,
  ARTICLE_SLUG,
} from './article';

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

const PRICE_FACTORS = [
  'מספר העמודים והאם צריך חנות, אזור אישי או חיבור למערכת קיימת.',
  'עיצוב מותאם מול מבנה פשוט יותר, והאם יש חומר גרפי מוכן.',
  'כתיבת תוכן: במחירון כתיבה עולה 250–400 ₪ לעמוד כשצריך לנסח מאפס.',
  'תחזוקה ואחסון אחרי ההשקה: 250–500 ₪ לחודש תחזוקה, 50–150 ₪ לחודש אחסון מנוהל.',
] as const;

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: { '@type': 'Answer', text: item.answer },
  })),
};

const articleContent = [
  ARTICLE_DESCRIPTION,
  ...FAQ.map((item) => `${item.question}\n${item.answer}`),
  ...PRICING_PACKAGES.map((pkg) => `${pkg.name} ${pkg.priceLabel} ${pkg.summary}`),
  ...PRICING_ADDONS.map((addon) => `${addon.name} ${addon.priceLabel} ${addon.detail}`),
].join('\n\n');

export default function WebsiteCostGuidePage() {
  return (
    <div className="min-h-screen bg-white" dir="rtl">
      <BlogPostSchema
        post={{
          id: ARTICLE_SLUG,
          title: ARTICLE_HEADLINE,
          excerpt: ARTICLE_DESCRIPTION,
          mainImage: absoluteUrl(ARTICLE_IMAGE_PATH),
          category: 'בניית אתרים',
          createdAt: ARTICLE_PUBLISHED,
          updatedAt: ARTICLE_MODIFIED,
          slug: ARTICLE_SLUG,
          authorName: 'שלומי',
          authorEmail: '',
          content: articleContent,
        }}
      />
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

      <article className="container mx-auto max-w-6xl px-4 py-16 text-right">
        <div className="mx-auto max-w-3xl">
          <p className="mb-6 text-lg leading-relaxed text-gray-700">
            השאלה הראשונה שבעלי עסקים שואלים היא כמה עולה בניית אתר. התשובה הקצרה ל-2026, לפי{' '}
            <Link href="/pricing" className="font-semibold text-[#02336E] underline">
              המחירון שלנו
            </Link>
            : דף נחיתה מתחיל מ-2,500 ₪, אתר תדמית מ-6,500 ₪, חנות אונליין מ-12,000 ₪, ומערכת מותאמת מ-20,000 ₪.
          </p>
          <p className="mb-10 text-lg leading-relaxed text-gray-700">
            אלה מחירי פתיחה, לא הצעת סגירה. האתר של קליניקה עם ארבעה עמודים לא עולה כמו חנות עם סליקה, מלאי ומשלוחים. בהמשך העמוד יש טבלה, מה מייקר או מוזיל, ומה כדאי לשאול לפני שחותמים. לפירוט השירות:{' '}
            <Link href="/services/web-development" className="font-semibold text-[#02336E] underline">
              בניית אתרים
            </Link>
            {' '}ו{' '}
            <Link href="/services/website-tadmit" className="font-semibold text-[#02336E] underline">
              בניית אתר תדמית
            </Link>
            .
          </p>
        </div>

        <h2 className="mb-4 text-3xl font-bold text-[#02336E]">טבלת מחירים לבניית אתר ב-2026</h2>
        <div className="mb-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {PRICING_PACKAGES.map((pkg) => (
            <div
              key={pkg.id}
              className={`relative flex h-full flex-col rounded-2xl bg-white p-6 shadow-xl ${
                pkg.highlighted ? 'ring-2 ring-[#22DEFB]' : 'ring-1 ring-gray-100'
              }`}
            >
              <h3 className="mb-2 text-2xl font-bold text-[#02336E]">{pkg.name}</h3>
              <p className="mb-3 text-3xl font-bold text-[#02336E]">{pkg.priceLabel}</p>
              <p className="text-gray-600">{pkg.summary}</p>
            </div>
          ))}
        </div>
        <p className="mb-6 text-center">
          <Link
            href="/pricing"
            className="inline-block rounded-lg bg-[#02336E] px-8 py-3 font-semibold text-white transition-colors hover:bg-[#022a5a]"
          >
            למחירון המלא
          </Link>
        </p>
        <div className="mb-10 overflow-x-auto rounded-xl border border-[#22DEFB]/40 shadow-sm">
          <table className="min-w-full text-right text-sm md:text-base">
            <thead className="bg-[#02336E] text-white">
              <tr>
                <th className="px-4 py-3 font-semibold">סוג האתר</th>
                <th className="px-4 py-3 font-semibold">מחיר פתיחה</th>
                <th className="px-4 py-3 font-semibold">מה כלול בקצרה</th>
              </tr>
            </thead>
            <tbody>
              {PRICING_PACKAGES.map((pkg) => (
                <tr key={pkg.id} className="border-t border-gray-100 even:bg-slate-50">
                  <td className="px-4 py-3 font-semibold text-[#02336E]">{pkg.name}</td>
                  <td className="px-4 py-3 text-gray-800">{pkg.priceLabel}</td>
                  <td className="px-4 py-3 text-gray-700">{pkg.summary}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mx-auto max-w-3xl">
          <h2 className="mb-4 text-3xl font-bold text-[#02336E]">מה משפיע על המחיר</h2>
          <ul className="mb-10 grid list-none gap-3 p-0 text-lg text-gray-700">
            {PRICE_FACTORS.map((item) => (
              <li
                key={item}
                className="rounded-xl border border-[#22DEFB]/50 bg-[#02336E]/[0.03] px-5 py-4 shadow-sm"
              >
                {item}
              </li>
            ))}
          </ul>

          <h2 className="mb-4 text-3xl font-bold text-[#02336E]">תוספות נפוצות</h2>
          <ul className="mb-10 grid list-none gap-3 p-0 text-lg text-gray-700">
            {PRICING_ADDONS.map((addon) => (
              <li
                key={addon.name}
                className="rounded-xl border border-[#22DEFB]/50 bg-white px-5 py-4 shadow-sm"
              >
                <strong>{addon.name}:</strong> {addon.priceLabel}. {addon.detail}
              </li>
            ))}
          </ul>

          <h2 className="mb-6 text-3xl font-bold text-[#02336E]">שאלות נפוצות</h2>
          <div className="mb-4 space-y-4">
            {FAQ.map((item) => (
              <div
                key={item.question}
                className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-md"
              >
                <div className="flex items-center justify-between gap-4 px-6 py-5 text-right">
                  <h3 className="text-lg font-semibold text-gray-900">{item.question}</h3>
                  <span
                    className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#22DEFB]/30 text-[#02336E]"
                    aria-hidden="true"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </div>
                <div className="border-t border-gray-100 px-6 pb-5">
                  <p className="pt-4 leading-relaxed text-gray-600">{item.answer}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-10 text-lg text-gray-700">
            רוצים מספר מדויק לעסק שלכם? השאירו פרטים ב
            <Link href="/contact#contact-form" className="font-semibold text-[#02336E] underline">
              טופס יצירת הקשר
            </Link>
            {' '}או עברו ל
            <Link href="/services/web-development" className="font-semibold text-[#02336E] underline">
              בניית אתרים
            </Link>
            .
          </p>
        </div>
      </article>

      <ServiceCtaBanner
        title="רוצים מספר מדויק לעסק שלכם?"
        text="השאירו פרטים בטופס יצירת הקשר או עברו לבניית אתרים."
        whatsappText={PRICING_ARTICLE_WHATSAPP_TEXT}
      />
    </div>
  );
}
