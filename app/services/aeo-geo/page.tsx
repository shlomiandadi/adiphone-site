import Link from 'next/link';
import { getSiteUrl } from '../../../lib/seo';
import Hero3D from '../../components/hero3d/Hero3D';

const PHONE_DISPLAY = '050-9159951';
const PHONE_TEL = '+972509159951';
const AEO_BLOG_SLUG = 'What-is-AEO-Answer-Engine-Optimization-and-Why-Does-It-Change';

const WHATS_INCLUDED = [
  {
    title: 'מחקר שאלות וכוונות',
    description:
      'מיפוי השאלות שהלקוחות שלכם שואלים מנועי AI על התחום שלכם, וזיהוי ההזדמנויות שבהן כדאי שהעסק יופיע בתשובה.',
  },
  {
    title: 'תוכן בפורמט תשובה',
    description:
      'כתיבה ועריכה של תוכן שעונה ישירות על שאלות, עם הגדרות ברורות, רשימות ופסקאות פתיחה תמציתיות שמנועי AI יכולים לצטט.',
  },
  {
    title: 'נתונים מובנים (Schema)',
    description:
      'הטמעת סכמות כמו FAQPage, Article ו-Organization שעוזרות למנועים להבין את התוכן ואת זהות העסק.',
  },
  {
    title: 'ישות וזהות העסק (E-E-A-T)',
    description:
      'חיזוק הזהות הדיגיטלית של העסק: עמוד אודות, פרטי יצירת קשר עקביים (NAP) וקישורים לפרופילים קיימים.',
  },
  {
    title: 'קובץ llms.txt',
    description:
      'הוספת קובץ שמסביר למנועי AI מי העסק, מה הוא מציע ואילו עמודים חשובים – בדומה ל-robots.txt עבור מנועי חיפוש.',
  },
  {
    title: 'מדידה ומעקב',
    description:
      'מעקב אחר הופעות ותנועה ממנועי AI ככל שהנתונים זמינים, ועדכון התוכן בהתאם למה שעובד.',
  },
];

const PROCESS = [
  { title: 'אבחון', description: 'ניתוח הנוכחות הנוכחית של העסק בתוצאות חיפוש ובמנועי AI.' },
  { title: 'אסטרטגיה', description: 'בחירת השאלות והנושאים שבהם כדאי שהעסק יופיע.' },
  { title: 'יישום', description: 'כתיבת תוכן, הטמעת נתונים מובנים וחיזוק זהות העסק.' },
  { title: 'אופטימיזציה', description: 'מדידה, הסקת מסקנות ושיפור מתמשך לאורך זמן.' },
];

const FAQ = [
  {
    question: 'מה זה AEO?',
    answer:
      'AEO (Answer Engine Optimization) הוא תהליך של אופטימיזציה של האתר והתוכן כך שהעסק יופיע בתשובות של מנועי שאלות ותשובות ועוזרי AI, במקום רק ברשימת הקישורים הקלאסית של גוגל.',
  },
  {
    question: 'מה ההבדל בין AEO ל-GEO?',
    answer:
      'AEO מתמקד בהופעה בתשובות ישירות (כמו תיבות תשובה ועוזרי AI), ו-GEO (Generative Engine Optimization) מתמקד בהופעה בתוך תשובות שנוצרות על ידי מנועים גנרטיביים כמו ChatGPT, Google AI Overviews ו-Perplexity. בפועל שני התחומים משלימים זה את זה.',
  },
  {
    question: 'האם AEO מחליף קידום אורגני (SEO)?',
    answer:
      'לא. AEO ו-GEO נבנים על גבי יסודות SEO טובים – תוכן איכותי, מבנה אתר תקין ומהירות. הם שכבה נוספת שמטרתה להתאים את התוכן גם לאופן שבו מנועי AI קוראים ומצטטים מידע.',
  },
  {
    question: 'איך מודדים הצלחה ב-AEO ו-GEO?',
    answer:
      'בודקים אם העסק מוזכר בתשובות של מנועי AI על שאלות רלוונטיות, ועוקבים אחר תנועה והפניות ממקורות AI ככל שהנתונים זמינים בכלי המדידה. זהו תחום חדש, ולכן המדידה מתפתחת כל הזמן.',
  },
];

export default function AeoGeoPage() {
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
      email: 'adiphoneseo@gmail.com',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'זמיר 95',
        addressLocality: 'פרדס חנה-כרכור',
        addressCountry: 'IL',
      },
      url: siteUrl,
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
            <Link href={`/blog/${AEO_BLOG_SLUG}`} className="text-blue-700 underline">
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

      {/* Process */}
      <section data-reveal className="bg-gray-50 px-4 py-16">
        <div className="container mx-auto max-w-5xl">
          <h2 className="mb-10 text-center text-3xl font-bold text-gray-900">תהליך העבודה שלנו</h2>
          <div className="grid gap-6 md:grid-cols-4">
            {PROCESS.map((step, index) => (
              <div key={step.title} className="rounded-xl bg-white p-6 text-center shadow-sm">
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

      {/* FAQ */}
      <section data-reveal className="px-4 py-16">
        <div className="container mx-auto max-w-3xl">
          <h2 className="mb-10 text-center text-3xl font-bold text-gray-900">שאלות נפוצות</h2>
          <div className="space-y-4">
            {FAQ.map((item) => (
              <div key={item.question} className="rounded-xl border border-gray-100 p-6 text-right shadow-sm">
                <h3 className="mb-2 text-xl font-semibold text-gray-900">{item.question}</h3>
                <p className="text-gray-700">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section data-reveal className="bg-blue-700 px-4 py-16 text-white">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold">רוצים שהעסק יופיע בתשובות של מנועי AI?</h2>
          <p className="mb-8 text-lg text-white/90">
            דברו איתנו ונבנה יחד אסטרטגיית AEO ו-GEO שמתאימה לעסק שלכם.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href={`tel:${PHONE_TEL}`}
              className="rounded-full bg-white px-8 py-3 text-lg font-semibold text-blue-700 transition-colors hover:bg-blue-50"
            >
              חייגו: {PHONE_DISPLAY}
            </a>
            <Link
              href="/contact"
              data-cta="true"
              data-cta-location="service-page"
              className="rounded-full border border-white px-8 py-3 text-lg font-semibold text-white transition-colors hover:bg-white/10"
            >
              צרו קשר
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
