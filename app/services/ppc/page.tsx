import Link from 'next/link';
import { getSiteUrl } from '../../../lib/seo';

const PHONE_DISPLAY = '050-9159951';
const PHONE_TEL = '+972509159951';

const INCLUDED = [
  {
    title: 'קמפיינים ב-Google Ads',
    description: 'מודעות חיפוש שמופיעות ללקוחות בדיוק כשהם מחפשים את השירות או המוצר שלכם.',
  },
  {
    title: 'קמפיינים במדיה חברתית',
    description: 'מודעות ממוקדות בפייסבוק ובאינסטגרם לפי קהל, תחומי עניין ומיקום.',
  },
  {
    title: 'דפי נחיתה ומסרים',
    description: 'התאמת המסר ועמוד היעד כדי שהתקציב יתורגם לפניות ולא רק לקליקים.',
  },
  {
    title: 'רימרקטינג',
    description: 'חזרה לגולשים שכבר ביקרו באתר אך טרם השאירו פנייה.',
  },
  {
    title: 'מעקב המרות',
    description: 'הגדרת מעקב אחר שיחות, טפסים ורכישות, כדי לדעת מאיפה מגיעות התוצאות.',
  },
  {
    title: 'אופטימיזציה שוטפת',
    description: 'ניהול תקציב, בדיקות וכיוונון מתמשך לשיפור העלות לכל פנייה.',
  },
];

const PROCESS = [
  { title: 'אפיון ויעדים', description: 'הבנת העסק, קהל היעד והגדרת מטרות הקמפיין.' },
  { title: 'בנייה', description: 'הקמת מבנה חשבון, מודעות, קהלים ועמודי נחיתה.' },
  { title: 'השקה ומדידה', description: 'העלאת הקמפיין לאוויר והטמעת מעקב המרות.' },
  { title: 'אופטימיזציה', description: 'ניתוח נתונים ושיפור מתמשך של התוצאות והתקציב.' },
];

const FAQ = [
  {
    question: 'מה זה קידום ממומן (PPC)?',
    answer:
      'קידום ממומן (PPC – Pay Per Click) הוא פרסום בתשלום בגוגל וברשתות החברתיות, שבו משלמים בעיקר כשגולש מקליק על המודעה. היתרון הוא תנועה כמעט מיידית ושליטה מדויקת בקהל ובתקציב.',
  },
  {
    question: 'מה ההבדל בין קידום ממומן לקידום אורגני?',
    answer:
      'קידום ממומן מביא תוצאות מהירות אך התנועה נפסקת כשמפסיקים לשלם. קידום אורגני (SEO) לוקח זמן אך בונה נכס לטווח ארוך. לרוב שילוב בין השניים נותן את התוצאה הטובה ביותר.',
  },
  {
    question: 'כמה תקציב צריך לקמפיין ממומן?',
    answer:
      'התקציב תלוי בתחום, בתחרות ובמטרות. נגדיר יחד תקציב התחלתי שמאפשר לאסוף נתונים, ונעלה אותו בהדרגה לפי התוצאות. נשמח להמליץ על נקודת פתיחה בשיחה – חייגו 050-9159951.',
  },
  {
    question: 'איך מודדים הצלחה בקמפיין?',
    answer:
      'לפי מדדים כמו כמות הפניות (לידים), העלות לכל פנייה (CPL), ותשואת הפרסום (ROAS) בחנויות. המטרה היא לא רק קליקים – אלא פניות ומכירות במחיר שמשתלם לעסק.',
  },
];

export default function PpcServicePage() {
  const siteUrl = getSiteUrl();
  const pageUrl = `${siteUrl}/services/ppc`;

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'קידום ממומן (PPC)',
    name: 'קידום ממומן (PPC)',
    url: pageUrl,
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* Hero */}
      <section className="bg-gradient-to-l from-orange-600 to-amber-500 px-4 py-20 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">קידום ממומן (PPC)</h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-white/90 md:text-xl">
            ניהול קמפיינים ממומנים בגוגל ובמדיה החברתית – תנועה מהירה, ממוקדת ומדידה של לקוחות
            שמחפשים אתכם עכשיו.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a href={`tel:${PHONE_TEL}`} className="rounded-full bg-white px-8 py-3 text-lg font-semibold text-orange-600 transition-colors hover:bg-orange-50">
              חייגו: {PHONE_DISPLAY}
            </a>
            <Link href="/contact" data-cta="true" data-cta-location="service-page" className="rounded-full border border-white px-8 py-3 text-lg font-semibold text-white transition-colors hover:bg-white/10">
              לייעוץ והצעת מחיר
            </Link>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="px-4 py-16">
        <div className="container mx-auto max-w-3xl text-right">
          <div className="rounded-xl border-r-4 border-orange-500 bg-orange-50 p-6">
            <h2 className="mb-3 text-2xl font-bold text-gray-900">מה זה קידום ממומן?</h2>
            <p className="text-lg leading-relaxed text-gray-800">
              קידום ממומן (PPC) הוא פרסום בתשלום בגוגל וברשתות החברתיות, שבו משלמים בעיקר כאשר
              גולש מקליק על המודעה. זו הדרך המהירה והמדידה ביותר להביא לאתר תנועה ממוקדת של
              לקוחות פוטנציאליים, לצד{' '}
              <Link href="/services/seo" className="text-orange-600 underline">
                קידום אורגני (SEO)
              </Link>{' '}
              לטווח ארוך.
            </p>
          </div>
          <p className="mt-6 text-lg leading-relaxed text-gray-700">
            רוצים להעמיק? קראו את המדריך שלנו:{' '}
            <Link href="/blog/nyhvl-kmpyyn-mmvmn" className="text-orange-600 underline">
              איך לנהל קמפיין ממומן נכון
            </Link>
            .
          </p>
        </div>
      </section>

      {/* What's included */}
      <section className="bg-gray-50 px-4 py-16">
        <div className="container mx-auto max-w-5xl">
          <h2 className="mb-10 text-center text-3xl font-bold text-gray-900">מה כולל השירות</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {INCLUDED.map((item) => (
              <div key={item.title} className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                <h3 className="mb-2 text-xl font-semibold text-gray-900">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section className="px-4 py-16">
        <div className="container mx-auto max-w-3xl text-right">
          <h2 className="mb-4 text-3xl font-bold text-gray-900">למי מתאים קידום ממומן?</h2>
          <ul className="list-disc space-y-2 pr-6 text-lg text-gray-700">
            <li>עסקים שרוצים פניות מהר, בלי להמתין לתוצאות של קידום אורגני.</li>
            <li>השקת מוצר, שירות או מבצע חדש שדורש חשיפה מיידית.</li>
            <li>עסקים מקומיים שרוצים להגיע ללקוחות באזור גיאוגרפי מוגדר.</li>
            <li>חנויות אונליין שרוצות להגדיל מכירות עם מעקב תשואה מדויק.</li>
          </ul>
        </div>
      </section>

      {/* Process */}
      <section className="bg-gray-50 px-4 py-16">
        <div className="container mx-auto max-w-5xl">
          <h2 className="mb-10 text-center text-3xl font-bold text-gray-900">תהליך העבודה שלנו</h2>
          <div className="grid gap-6 md:grid-cols-4">
            {PROCESS.map((step, index) => (
              <div key={step.title} className="rounded-xl bg-white p-6 text-center shadow-sm">
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 font-bold text-white">
                  {index + 1}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">{step.title}</h3>
                <p className="text-sm text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How results are measured */}
      <section className="px-4 py-16">
        <div className="container mx-auto max-w-3xl text-right">
          <h2 className="mb-4 text-3xl font-bold text-gray-900">איך מודדים תוצאות?</h2>
          <p className="text-lg leading-relaxed text-gray-700">
            אנחנו מגדירים מעקב המרות אמיתי (שיחות, טפסים ורכישות) ומודדים את העלות לכל פנייה
            (CPL) ואת תשואת הפרסום (ROAS) בחנויות. המטרה היא לא רק קליקים, אלא פניות ומכירות
            במחיר שמשתלם לעסק – עם דיווח שקוף על הביצועים ועל השינויים שאנחנו מבצעים.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-gray-50 px-4 py-16">
        <div className="container mx-auto max-w-3xl">
          <h2 className="mb-10 text-center text-3xl font-bold text-gray-900">שאלות נפוצות</h2>
          <div className="space-y-4">
            {FAQ.map((item) => (
              <div key={item.question} className="rounded-xl border border-gray-100 bg-white p-6 text-right shadow-sm">
                <h3 className="mb-2 text-xl font-semibold text-gray-900">{item.question}</h3>
                <p className="text-gray-700">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related + CTA */}
      <section className="bg-orange-600 px-4 py-16 text-white">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold">רוצים לקוחות כבר השבוע?</h2>
          <p className="mb-6 text-lg text-white/90">
            נבנה יחד קמפיין ממומן שמתאים ליעדים ולתקציב של העסק שלכם.
          </p>
          <p className="mb-8 text-white/80">
            קשור:{' '}
            <Link href="/services/seo" className="underline">קידום אורגני (SEO)</Link> ·{' '}
            <Link href="/services/aeo-geo" className="underline">קידום במנועי AI (AEO/GEO)</Link>
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a href={`tel:${PHONE_TEL}`} className="rounded-full bg-white px-8 py-3 text-lg font-semibold text-orange-600 transition-colors hover:bg-orange-50">
              חייגו: {PHONE_DISPLAY}
            </a>
            <Link href="/contact" data-cta="true" data-cta-location="service-page" className="rounded-full border border-white px-8 py-3 text-lg font-semibold text-white transition-colors hover:bg-white/10">
              צרו קשר
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
