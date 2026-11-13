import Link from 'next/link';
import { getSiteUrl, organizationLogo } from '../../../lib/seo';
import { getPublishedPortfolioProjects } from '../../../lib/website-projects';
import Hero3D from '../../components/hero3d/Hero3D';
import ServiceCtaBanner from '../../components/ServiceCtaBanner';
import { AEO_BLOG_HREF, EXAMPLES, FAQ, PROCESS, WHATS_INCLUDED } from './content';

const PHONE_DISPLAY = '050-9159951';
const PHONE_TEL = '+972509159951';

export default async function AeoGeoPage() {
  const projects = await getPublishedPortfolioProjects('seo', 1);
  const projectImage = projects.find((project) => project.image && !project.image.endsWith('.svg'))?.image;
  const siteUrl = getSiteUrl();
  const pageUrl = `${siteUrl}/services/aeo-geo`;

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'קידום במנועי AI (AEO / GEO)',
    name: 'קידום AEO ו-GEO',
    url: pageUrl,
    description:
      'אופטימיזציה של תוכן ואתר כדי להופיע בתשובות של מנועי AI כמו ChatGPT, Google AI Overviews ו-Perplexity.',
    provider: {
      '@type': 'ProfessionalService',
      name: 'Top Webstak בנייה וקידום אתרים',
      telephone: '+972-50-9159951',
      email: ['adiphoneseo@gmail.com', 'info@adi-phone.co.il'],
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'זמיר 95',
        addressLocality: 'פרדס חנה-כרכור',
        addressCountry: 'IL',
      },
      url: siteUrl,
      logo: organizationLogo(siteUrl),
    },
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };

  return (
    <div className="min-h-screen bg-white" dir="rtl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <Hero3D
        theme="aeo-geo"
        title="קידום במנועי AI – AEO ו-GEO"
        subtitle="יותר ויותר לקוחות מקבלים תשובות ישירות ממנועי AI כמו ChatGPT, Google AI Overviews ו-Perplexity. אנחנו עוזרים לעסק שלכם להופיע בתשובות האלה."
        align="center"
        ctas={[
          { href: `tel:${PHONE_TEL}`, label: `חייגו: ${PHONE_DISPLAY}` },
          { href: '/contact', label: 'לייעוץ ראשוני', variant: 'secondary' },
        ]}
      />

      {/* Direct-answer intro (GEO-friendly) */}
      <section data-reveal className="px-4 py-16">
        <div className="container mx-auto max-w-3xl text-right">
          <div className="rounded-xl border-r-4 border-blue-600 bg-blue-50 p-6">
            <h2 className="mb-3 text-2xl font-bold text-gray-900">מה זה AEO ו-GEO?</h2>
            <p className="text-lg leading-relaxed text-gray-800">
              <strong>AEO</strong> (Answer Engine Optimization) ו-<strong>GEO</strong>{' '}
              (Generative Engine Optimization) הם אופטימיזציה של האתר והתוכן כך שהעסק יופיע
              בתשובות שמנועי AI מספקים למשתמשים – ולא רק ברשימת הקישורים של גוגל. במקום לקוות
              שהגולש יקליק על התוצאה, המטרה היא שהעסק יוזכר כבר בתוך התשובה עצמה.
            </p>
          </div>
          <p className="mt-6 text-lg leading-relaxed text-gray-700">
            להסבר מעמיק יותר על המושג עצמו קראו את המדריך{' '}
            <Link href={AEO_BLOG_HREF} className="text-blue-700 underline">
              מה זה AEO ולמה זה משנה
            </Link>
            . לחיזוק הנראות בחיפוש הקלאסי של גוגל ראו את{' '}
            <Link href="/services/seo" className="text-blue-700 underline">
              שירות הקידום האורגני (SEO)
            </Link>
            — שני המסלולים עובדים יחד.
          </p>
        </div>
      </section>

      <section data-reveal className="border-y border-blue-100 bg-blue-50 px-4 py-10">
        <div className="container mx-auto max-w-3xl text-center">
          <p className="text-lg text-gray-800">
            רוצים גם לנהל את הפרופיל הרשמי ב-ChatGPT?{' '}
            <Link href="/services/chatgpt-business-hub" className="font-semibold text-blue-700 underline">
              הקמת פרופיל עסקי ב-ChatGPT
            </Link>
            — שירות נפרד ל-Business Hub. מודעה בתשלום מתחת לתשובה היא{' '}
            <Link href="/services/chatgpt-ads" className="font-semibold text-blue-700 underline">
              פרסום ממומן ב-ChatGPT
            </Link>
            , לא אותו דבר כמו AEO/GEO.
          </p>
        </div>
      </section>

      {/* Why it matters */}
      <section data-reveal className="bg-gray-50 px-4 py-16">
        <div className="container mx-auto max-w-3xl text-right">
          <h2 className="mb-4 text-3xl font-bold text-gray-900">למה זה חשוב לעסק שלכם?</h2>
          <p className="mb-4 text-lg leading-relaxed text-gray-700">
            הרגלי החיפוש משתנים: חלק מהלקוחות כבר שואלים שאלות ישירות עוזרי AI ומקבלים תשובה
            מסוכמת. אם העסק שלכם לא מופיע בתשובות האלה, ייתכן שתפספסו לקוחות שבעבר היו מגיעים
            דרך חיפוש רגיל. AEO ו-GEO עוזרים לעסק להישאר נוכח גם בעולם החדש הזה, לצד{' '}
            <Link href="/services/seo" className="text-blue-700 underline">
              קידום אורגני (SEO)
            </Link>{' '}
            קלאסי.
          </p>
          <p className="text-lg leading-relaxed text-gray-700">
            רוצים להבין לעומק? קראו את המדריך שלנו:{' '}
            <Link href={AEO_BLOG_HREF} className="text-blue-700 underline">
              מה זה AEO ולמה זה משנה
            </Link>
            .
          </p>
        </div>
      </section>

      {/* What's included */}
      <section data-reveal className="px-4 py-16">
        <div className="container mx-auto max-w-5xl">
          <h2 className="mb-10 text-center text-3xl font-bold text-gray-900">מה כולל השירות</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {WHATS_INCLUDED.map((item) => (
              <div key={item.title} className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                <h3 className="mb-2 text-xl font-semibold text-gray-900">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Illustrative examples */}
      <section data-reveal className="bg-gray-50 px-4 py-16">
        <div className="container mx-auto max-w-3xl text-right">
          <h2 className="mb-3 text-3xl font-bold text-gray-900">איך נראית עבודת AEO ו-GEO בפועל</h2>
          <p className="mb-10 text-lg leading-relaxed text-gray-700">
            אלה תרחישים להמחשה בלבד — לא תיאורי לקוחות, לא תוצאות מדידות ולא הבטחות. המטרה היא
            להראות איך נראית העבודה: תוכן שעונה קודם, נתונים מובנים, קובץ llms.txt ועקביות של
            זהות העסק. לפירוט המושגים ראו את{' '}
            <Link href={AEO_BLOG_HREF} className="text-blue-700 underline">
              מדריך ה-AEO
            </Link>
            .
          </p>
          <ol className="space-y-6">
            {EXAMPLES.map((item, index) => (
              <li
                key={item.title}
                className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm"
              >
                <p className="mb-2 text-sm font-semibold text-blue-700">תרחיש {index + 1}</p>
                <h3 className="mb-3 text-xl font-semibold text-gray-900">{item.title}</h3>
                <p className="leading-relaxed text-gray-700">{item.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Process */}
      <section data-reveal className="px-4 py-16">
        <div className="container mx-auto max-w-5xl">
          <h2 className="mb-10 text-center text-3xl font-bold text-gray-900">תהליך העבודה על הקידום במנועי AI</h2>
          <div className="grid gap-6 md:grid-cols-4">
            {PROCESS.map((step, index) => (
              <div key={step.title} className="rounded-xl bg-gray-50 p-6 text-center shadow-sm">
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
                  {index + 1}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">{step.title}</h3>
                <p className="text-sm text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ — always visible, matches FAQPage JSON-LD */}
      <section data-reveal className="bg-gray-50 px-4 py-16" aria-labelledby="aeo-faq-heading">
        <div className="container mx-auto max-w-3xl">
          <h2 id="aeo-faq-heading" className="mb-10 text-center text-3xl font-bold text-gray-900">
            שאלות נפוצות
          </h2>
          <div className="space-y-4">
            {FAQ.map((item) => (
              <article
                key={item.question}
                className="rounded-xl border border-gray-100 bg-white p-6 text-right shadow-sm"
              >
                <h3 className="mb-2 text-xl font-semibold text-gray-900">{item.question}</h3>
                <p className="leading-relaxed text-gray-700">{item.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <ServiceCtaBanner serviceKey="aeo-geo" image={projectImage} imageAlt="פרויקט קידום במנועי AI" />
    </div>
  );
}
