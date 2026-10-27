import Link from 'next/link';
import { getSiteUrl, organizationLogo } from '../../../lib/seo';
import { getPublishedPortfolioProjects } from '../../../lib/website-projects';
import Hero3D from '../../components/hero3d/Hero3D';
import ServiceCtaBanner from '../../components/ServiceCtaBanner';

const PHONE_DISPLAY = '050-9159951';
const PHONE_TEL = '+972509159951';

const INCLUDED = [
  {
    title: 'מחקר מילות מפתח',
    description: 'זיהוי הביטויים שהלקוחות שלכם מחפשים בגוגל, לפי כוונת חיפוש ורלוונטיות לעסק.',
  },
  {
    title: 'אופטימיזציה טכנית',
    description: 'שיפור מהירות, מבנה אתר, נתונים מובנים (Schema) והתאמה לנייד – הבסיס שגוגל אוהב.',
  },
  {
    title: 'תוכן ואופטימיזציית עמודים',
    description: 'שיפור כותרות, תיאורים ותוכן העמודים כך שיענו על השאלות של קהל היעד.',
  },
  {
    title: 'בניית סמכות (קישורים)',
    description: 'השגת קישורים רלוונטיים ואיכותיים, ללא שיטות מסוכנות שעלולות לפגוע באתר.',
  },
  {
    title: 'קידום מקומי',
    description: 'אופטימיזציה לחיפושים מקומיים ולפרופיל Google Business, לעסקים שמשרתים אזור גיאוגרפי.',
  },
  {
    title: 'מדידה ודיווח',
    description: 'מעקב אחר דירוגים, תנועה אורגנית והמרות, עם דיווח שקוף על מה שנעשה ומה הלאה.',
  },
];

const PROCESS = [
  { title: 'אבחון ומחקר', description: 'ניתוח האתר, המתחרים ומילות המפתח הרלוונטיות.' },
  { title: 'אסטרטגיה', description: 'בניית תוכנית עבודה לפי סדר עדיפויות ויעדים ברורים.' },
  { title: 'יישום', description: 'תיקונים טכניים, שיפור תוכן ובניית סמכות לאורך זמן.' },
  { title: 'מדידה ושיפור', description: 'מעקב אחר התוצאות ועדכון האסטרטגיה בהתאם לנתונים.' },
];

const FAQ = [
  {
    question: 'מה זה קידום אתרים (SEO)?',
    answer:
      'קידום אתרים אורגני (SEO) הוא תהליך של שיפור האתר והתוכן כדי להופיע גבוה יותר בתוצאות החיפוש הטבעיות (הלא ממומנות) של גוגל, ולהביא תנועה איכותית של גולשים שמחפשים את מה שאתם מציעים.',
  },
  {
    question: 'כמה זמן לוקח לראות תוצאות?',
    answer:
      'קידום אורגני הוא תהליך ארוך טווח. בדרך כלל רואים שיפורים הדרגתיים לאורך מספר חודשים, כשהקצב תלוי בתחרותיות התחום, במצב האתר הנוכחי ובהיקף העבודה. איננו מבטיחים מיקום או מועד ספציפי – גוגל לא מאפשר זאת.',
  },
  {
    question: 'איך מודדים הצלחה בקידום אורגני?',
    answer:
      'לפי שיפור בדירוג מילות המפתח המרכזיות, גידול בתנועה האורגנית לאתר, שיפור במדדי חוויית המשתמש (כולל Core Web Vitals), ובעיקר עלייה בכמות הפניות וההמרות שמגיעות מחיפוש אורגני.',
  },
  {
    question: 'מה ההבדל בין קידום אורגני לקידום ממומן?',
    answer:
      'קידום אורגני בונה נכס לטווח ארוך ומביא תנועה מתמשכת ללא תשלום לכל קליק, אבל לוקח זמן. קידום ממומן (PPC) מביא תנועה כמעט מיידית אך נפסק כשמפסיקים לשלם. לרוב מומלץ לשלב בין השניים.',
  },
];

export default async function SeoServicePage() {
  const projects = await getPublishedPortfolioProjects('seo', 1);
  const projectImage = projects.find((project) => project.image && !project.image.endsWith('.svg'))?.image;
  const siteUrl = getSiteUrl();
  const pageUrl = `${siteUrl}/services/seo`;

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'קידום אתרים אורגני (SEO)',
    name: 'קידום אתרים (SEO)',
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <Hero3D
        theme="seo"
        title="קידום אתרים אורגני (SEO) לעסקים"
        subtitle="קידום אורגני (SEO) מקצועי שמביא לעסק שלכם תנועה איכותית ולקוחות מגוגל – לאורך זמן."
        align="center"
        ctas={[
          { href: `tel:${PHONE_TEL}`, label: `חייגו: ${PHONE_DISPLAY}` },
          { href: '/contact', label: 'לייעוץ והצעת מחיר', variant: 'secondary' },
        ]}
      />

      {/* Intro */}
      <section data-reveal className="px-4 py-16">
        <div className="container mx-auto max-w-3xl text-right">
          <div className="rounded-xl border-r-4 border-green-600 bg-green-50 p-6">
            <h2 className="mb-3 text-2xl font-bold text-gray-900">מה זה קידום אתרים?</h2>
            <p className="text-lg leading-relaxed text-gray-800">
              קידום אתרים אורגני (SEO) הוא תהליך של שיפור האתר והתוכן כדי שהעסק יופיע גבוה יותר
              בתוצאות החיפוש הטבעיות של גוגל. בניגוד לקידום ממומן, התנועה האורגנית ממשיכה להגיע
              לאורך זמן גם מבלי לשלם על כל קליק.
            </p>
          </div>
          <p className="mt-6 text-lg leading-relaxed text-gray-700">
            רוצים טיפים מעשיים להתחלה? קראו את המדריך שלנו:{' '}
            <Link href="/blog/seo-tips-google-ranking-guide" className="text-green-700 underline">
              טיפים לקידום אתרים בגוגל
            </Link>
            , את{' '}
            <Link href="/blog/mh-zh-seo" className="text-green-700 underline">
              מדריך SEO למתחילים
            </Link>
            {' '}ואת{' '}
            <Link href="/blog/ayk-lbchvr-chbrt-kydvm-atrym" className="text-green-700 underline">
              איך לבחור חברת קידום אתרים
            </Link>
            . לחיפוש במנועי שיחה:{' '}
            <Link href="/services/aeo-geo" className="text-green-700 underline">
              קידום במנועי AI
            </Link>
            .
          </p>
        </div>
      </section>

      {/* What's included */}
      <section data-reveal className="bg-gray-50 px-4 py-16">
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
      <section data-reveal className="px-4 py-16">
        <div className="container mx-auto max-w-3xl text-right">
          <h2 className="mb-4 text-3xl font-bold text-gray-900">למי מתאים קידום אורגני?</h2>
          <ul className="list-disc space-y-2 pr-6 text-lg text-gray-700">
            <li>עסקים שרוצים להגיע ללקוחות שכבר מחפשים את השירות או המוצר שלהם בגוגל.</li>
            <li>עסקים מקומיים שרוצים להופיע בחיפושים באזור שלהם ובמפות גוגל.</li>
            <li>חנויות אונליין שרוצות תנועה אורגנית לעמודי קטגוריה ומוצר.</li>
            <li>עסקים שמעדיפים לבנות נכס דיגיטלי לטווח ארוך לצד פעילות שיווקית אחרת.</li>
          </ul>
        </div>
      </section>

      {/* Process */}
      <section data-reveal className="bg-gray-50 px-4 py-16">
        <div className="container mx-auto max-w-5xl">
          <h2 className="mb-10 text-center text-3xl font-bold text-gray-900">תהליך העבודה על קידום האתר בגוגל</h2>
          <div className="grid gap-6 md:grid-cols-4">
            {PROCESS.map((step, index) => (
              <div key={step.title} className="rounded-xl bg-white p-6 text-center shadow-sm">
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-green-600 font-bold text-white">
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
      <section data-reveal className="px-4 py-16">
        <div className="container mx-auto max-w-3xl text-right">
          <h2 className="mb-4 text-3xl font-bold text-gray-900">איך מודדים תוצאות?</h2>
          <p className="text-lg leading-relaxed text-gray-700">
            אנחנו עובדים בשקיפות מלאה. ההתקדמות נמדדת לפי דירוג מילות המפתח המרכזיות, כמות
            התנועה האורגנית לאתר, מדדי חוויית המשתמש (כולל Core Web Vitals), ובעיקר לפי כמות
            הפניות וההמרות שמגיעות מחיפוש אורגני. אנחנו משתמשים ב-Google Search Console
            וב-Google Analytics, ולא מבטיחים מיקומים או מועדים שאיננו שולטים בהם.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section data-reveal className="bg-gray-50 px-4 py-16">
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

      <section data-reveal className="px-4 pb-4 text-center">
        <p className="text-gray-600">
          קשור:{' '}
          <Link href="/services/ppc" className="underline">קידום ממומן (PPC)</Link> ·{' '}
          <Link href="/services/aeo-geo" className="underline">קידום במנועי AI (AEO/GEO)</Link>
        </p>
      </section>
      <ServiceCtaBanner serviceKey="seo" image={projectImage} imageAlt="פרויקט קידום אתרים" />
    </div>
  );
}
