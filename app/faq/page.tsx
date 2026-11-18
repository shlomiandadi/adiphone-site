import type { Metadata } from 'next';
import Link from 'next/link';
import { FAQ_TOTAL, loadFaqIndexWithDescriptions } from '../../lib/faq';

export const metadata: Metadata = {
  title: 'שאלות נפוצות על בניית אתרים, SEO וקידום דיגיטלי',
  description:
    'מרכז שאלות ותשובות של Top Webstak: בניית אתרים, קידום אורגני, ממומן, AI, מחירים, אחסון ואמון. מאות תשובות בעברית.',
  alternates: {
    canonical: 'https://adi-phone.co.il/faq',
  },
  openGraph: {
    title: 'שאלות נפוצות | Top Webstak',
    description:
      'כל השאלות הנפוצות על בניית אתרים, קידום בגוגל, קמפיינים ממומנים וקידום במנועי AI — במקום אחד.',
    url: 'https://adi-phone.co.il/faq',
    type: 'website',
    locale: 'he_IL',
    siteName: 'Top Webstak',
  },
};

export default function FaqIndexPage() {
  const topics = loadFaqIndexWithDescriptions();

  return (
    <div className="bg-gray-50">
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
