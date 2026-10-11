import Link from 'next/link';
import { getSiteUrl } from '../../../lib/seo';

const PHONE_DISPLAY = '050-9159951';
const PHONE_TEL = '+972509159951';

const AREAS = [
  'פרדס חנה-כרכור',
  'חדרה',
  'קיסריה',
  'זכרון יעקב',
  'בנימינה',
  'חריש',
  'עמק חפר',
  'חיפה',
];

const INCLUDED = [
  {
    title: 'אתרי תדמית לעסק',
    description:
      'אתר נקי וממוקד שמציג את העסק, השירותים והיתרונות שלכם ומייצר פניות מלקוחות באזור.',
  },
  {
    title: 'חנויות אונליין',
    description:
      'חנות אינטרנטית לניהול מוצרים, מלאי וסליקה מאובטחת – מוכנה למכירה מהיום הראשון.',
  },
  {
    title: 'אתרי וורדפרס',
    description:
      'פתרון גמיש עם ממשק ניהול נוח, שמאפשר לכם לעדכן תכנים באופן עצמאי.',
  },
  {
    title: 'התאמה מלאה לנייד',
    description:
      'בנייה בגישת Mobile-First – רוב הגולשים בפרדס חנה והסביבה מגיעים מהטלפון.',
  },
  {
    title: 'תשתית SEO מובנית',
    description:
      'מבנה, מהירות וקוד נקי שגוגל אוהב, כבסיס לקידום אורגני מקומי בהמשך.',
  },
  {
    title: 'נגישות ואבטחה',
    description:
      'תעודת SSL, התאמות נגישות והקשחת אבטחה כחלק מהסטנדרט שלנו.',
  },
];

const PROCESS = [
  { title: 'אפיון', description: 'פגישת היכרות, הבנת מטרות העסק וקהל היעד המקומי.' },
  { title: 'עיצוב', description: 'עיצוב חווית משתמש ומראה שמתאים למותג שלכם.' },
  { title: 'פיתוח', description: 'בנייה טכנית מהירה, מאובטחת ומותאמת לנייד.' },
  { title: 'השקה ותמיכה', description: 'עלייה לאוויר, הדרכה על מערכת הניהול ותמיכה שוטפת.' },
];

const FAQ = [
  {
    question: 'כמה עולה בניית אתר בפרדס חנה?',
    answer:
      'המחיר תלוי בהיקף ובסוג האתר (תדמית, חנות או מערכת). נשמח לתת הצעת מחיר מדויקת ושקופה לאחר שיחת אפיון קצרה – חייגו 050-9159951.',
  },
  {
    question: 'כמה זמן לוקח לבנות אתר?',
    answer:
      'אתר תדמית ממוקד נבנה בדרך כלל מהר יותר ממערכת או חנות מורכבת. נגדיר לוח זמנים ברור כבר בשלב האפיון.',
  },
  {
    question: 'האם אתם עובדים רק בפרדס חנה?',
    answer:
      'אנחנו יושבים בפרדס חנה אבל נותנים שירות גם לחדרה, קיסריה, זכרון יעקב, בנימינה, חריש, עמק חפר וחיפה.',
  },
  {
    question: 'האם האתר כולל קידום בגוגל?',
    answer:
      'האתר נבנה עם תשתית SEO מובנית. בנוסף אנחנו מציעים שירות קידום אורגני ייעודי שניתן להרחיב אליו בהמשך.',
  },
];

export default function BniyatAtarimPardesHanaPage() {
  const siteUrl = getSiteUrl();

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'בניית אתרים',
    name: 'בניית אתרים בפרדס חנה',
    url: `${siteUrl}/services/bniyat-atarim-pardes-hana`,
    areaServed: AREAS,
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

  return (
    <div className="min-h-screen bg-white" dir="rtl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />

      {/* Hero */}
      <section className="bg-gradient-to-l from-blue-700 to-blue-500 px-4 py-20 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">בניית אתרים בפרדס חנה</h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-white/90 md:text-xl">
            סוכנות דיגיטל מקומית מפרדס חנה הבונה אתרי תדמית, חנויות אונליין ואתרי וורדפרס
            מהירים, מותאמים לנייד וידידותיים לגוגל – לעסקים בפרדס חנה-כרכור ובכל האזור.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href={`tel:${PHONE_TEL}`}
              className="rounded-full bg-white px-8 py-3 text-lg font-semibold text-blue-700 transition-colors hover:bg-blue-50"
            >
              חייגו עכשיו: {PHONE_DISPLAY}
            </a>
            <Link
              href="/contact"
              className="rounded-full border border-white px-8 py-3 text-lg font-semibold text-white transition-colors hover:bg-white/10"
            >
              לקבלת הצעת מחיר
            </Link>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="px-4 py-16">
        <div className="container mx-auto max-w-3xl text-right">
          <h2 className="mb-4 text-3xl font-bold text-gray-900">
            האתר שלכם הוא חלון הראווה הדיגיטלי של העסק באזור
          </h2>
          <p className="mb-4 text-lg leading-relaxed text-gray-700">
            לקוחות בפרדס חנה-כרכור ובסביבה מחפשים עסקים בגוגל לפני שהם מתקשרים. אתר מקצועי,
            מהיר ומותאם לנייד הוא ההבדל בין פנייה שמגיעה אליכם לבין לקוח שממשיך למתחרה.
            אנחנו סוכנות מקומית שמכירה את השוק באזור, ובונה אתרים שנועדו להביא פניות אמיתיות.
          </p>
          <p className="text-lg leading-relaxed text-gray-700">
            בין אם אתם צריכים{' '}
            <Link href="/services/web-development" className="text-blue-700 underline">
              אתר תדמית
            </Link>
            ,{' '}
            <Link href="/services/ecommerce" className="text-blue-700 underline">
              חנות אונליין
            </Link>{' '}
            או{' '}
            <Link href="/services/wordpress" className="text-blue-700 underline">
              אתר וורדפרס
            </Link>
            , נבנה לכם נכס דיגיטלי שעובד בשבילכם.
          </p>
        </div>
      </section>

      {/* What's included */}
      <section className="bg-gray-50 px-4 py-16">
        <div className="container mx-auto max-w-5xl">
          <h2 className="mb-10 text-center text-3xl font-bold text-gray-900">
            מה כולל השירות
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {INCLUDED.map((item) => (
              <div key={item.title} className="rounded-xl bg-white p-6 shadow-sm">
                <h3 className="mb-2 text-xl font-semibold text-gray-900">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="px-4 py-16">
        <div className="container mx-auto max-w-5xl">
          <h2 className="mb-10 text-center text-3xl font-bold text-gray-900">
            תהליך העבודה שלנו
          </h2>
          <div className="grid gap-6 md:grid-cols-4">
            {PROCESS.map((step, index) => (
              <div key={step.title} className="rounded-xl border border-gray-100 p-6 text-center shadow-sm">
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

      {/* Areas served */}
      <section className="bg-gray-50 px-4 py-16">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="mb-6 text-3xl font-bold text-gray-900">אזורי השירות שלנו</h2>
          <p className="mb-6 text-lg text-gray-700">
            אנחנו ממוקמים בפרדס חנה (זמיר 95) ונותנים שירות בנייה וקידום אתרים בכל האזור:
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {AREAS.map((area) => (
              <span
                key={area}
                className="rounded-full bg-white px-4 py-2 text-gray-800 shadow-sm"
              >
                {area}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 py-16">
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
      <section className="bg-blue-700 px-4 py-16 text-white">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold">מוכנים לבנות אתר שמביא לקוחות?</h2>
          <p className="mb-8 text-lg text-white/90">
            דברו עם סוכנות מקומית מפרדס חנה. נשמח לשמוע על העסק שלכם ולתת הצעת מחיר ללא התחייבות.
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
