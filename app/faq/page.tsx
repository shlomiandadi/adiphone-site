import type { Metadata } from 'next';
import Link from 'next/link';
import FaqAccordion from '../components/FaqAccordion';
import {
  FAQ_TOTAL,
  faqPageJsonLd,
  featuredFaqItems,
  loadFaqIndexWithDescriptions,
} from '../../lib/faq';
import { DEFAULT_OG_IMAGE } from '../../lib/seo';

export const dynamic = 'force-static';
export const revalidate = false;

const FAQ_HUB_META_DESCRIPTION =
  'תשובות בעברית: כמה עולה אתר תדמית, מה זה SEO, ומה זה AEO במנועי AI. 505 שאלות על בניית אתרים, מחירים, אחסון, אמון ויצירת קשר.';

export const metadata: Metadata = {
  title: 'שאלות נפוצות על בניית אתרים, SEO וקידום דיגיטלי',
  description: FAQ_HUB_META_DESCRIPTION,
  alternates: {
    canonical: 'https://adi-phone.co.il/faq',
  },
  openGraph: {
    title: 'שאלות נפוצות | Top Webstak',
    description: FAQ_HUB_META_DESCRIPTION,
    url: 'https://adi-phone.co.il/faq',
    type: 'website',
    locale: 'he_IL',
    siteName: 'Top Webstak',
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    description: FAQ_HUB_META_DESCRIPTION,
  },
};

export default function FaqIndexPage() {
  const topics = loadFaqIndexWithDescriptions();
  const featured = featuredFaqItems();
  const schema = faqPageJsonLd(featured);

  return (
    <div className="bg-gray-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <section className="bg-gradient-to-b from-white to-gray-50 px-4 pb-10 pt-8">
        <div className="container mx-auto max-w-5xl">
          <h1 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">שאלות נפוצות</h1>
          <p className="max-w-3xl text-lg leading-relaxed text-gray-600">
            ריכזנו כאן {FAQ_TOTAL} שאלות ותשובות על בניית אתרים, קידום בגוגל, קמפיינים ממומנים,
            בינה מלאכותית, מחירים ואמון. בחרו נושא כדי לקרוא את כל התשובות בעברית.
          </p>
          <p className="mt-4">
            <a
              href="https://leads.adi-phone.co.il/faq"
              className="inline-flex items-center text-blue-700 underline decoration-blue-200 underline-offset-4 hover:text-blue-800"
            >
              שאלות על מערכת לידים לוואטסאפ
            </a>
          </p>
        </div>
      </section>

      <section className="px-4 pb-12" aria-label="שאלות נבחרות">
        <div className="container mx-auto max-w-5xl">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">שאלות נבחרות</h2>
          <p className="mb-6 max-w-3xl text-base leading-relaxed text-gray-600">
            כמה תשובות קצרות שחוזרות הרבה. את כל השאלות לפי נושא תמצאו בכרטיסים למטה.
          </p>
          <FaqAccordion items={featured} />
        </div>
      </section>

      <section className="px-4 pb-16" aria-label="נושאי שאלות נפוצות">
        <div className="container mx-auto grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {topics.map((topic) => (
            <Link
              key={topic.topic}
              href={`/faq/${topic.topic}`}
              className="group flex flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-100 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <h2 className="mb-2 text-xl font-semibold text-gray-900 group-hover:text-blue-700">
                {topic.titleHe}
              </h2>
              <p className="mb-4 flex-1 text-sm leading-relaxed text-gray-600">{topic.descriptionHe}</p>
              <span className="text-sm font-medium text-blue-700">
                {topic.count} שאלות
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
