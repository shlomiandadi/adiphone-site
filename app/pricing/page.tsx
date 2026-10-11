import Link from 'next/link';
import { getSiteUrl } from '../../lib/seo';
import Hero3D from '../components/hero3d/Hero3D';
import {
  PHONE_DISPLAY,
  PHONE_TEL,
  PRICING_ADDONS,
  PRICING_PACKAGES,
  whatsappUrl,
} from '../../lib/pricing';

const FAQ = [
  {
    question: 'כמה עולה לבנות אתר?',
    answer:
      'אצלנו המחיר ההתחלתי הוא 2,500 ₪ + מע״מ לדף נחיתה, 6,500 ₪ + מע״מ לאתר תדמית של עד 6–8 עמודים, 12,000 ₪ + מע״מ לחנות אונליין, ו-20,000 ₪ + מע״מ לפיתוח מערכת לפי אפיון. המחיר הסופי נקבע אחרי שיחה קצרה על ההיקף.',
  },
  {
    question: 'האם המחירים כוללים מע״מ?',
    answer:
      'לא. כל המחירים בעמוד הזה אינם כוללים מע״מ, ומצוינים כמחירי פתיחה + מע״מ.',
  },
  {
    question: 'מה כלול במחיר ומה לא?',
    answer:
      'כל חבילה מפרטת מה כלול בה. כתיבת תוכן, עמודים מעבר להיקף, תחזוקה, אחסון וקידום חודשי הם תוספות נפרדות. דומיין על שם העסק נרשם אצלכם.',
  },
  {
    question: 'יש עלויות חודשיות חובה?',
    answer:
      'בניית האתר היא תשלום חד-פעמי לפי ההצעה. אחסון מנוהל (50–150 ₪ לחודש) ותחזוקה (250–500 ₪ לחודש) הם שירותים נפרדים, לפי בחירה. קידום SEO/GEO חודשי ניתן לפי הצעת מחיר.',
  },
  {
    question: 'אפשר להתחיל מדף נחיתה ולגדול אחר כך?',
    answer:
      'כן. אפשר לפתוח בדף נחיתה ולצרף עמודים או חנות בהמשך, לפי הצורך של העסק.',
  },
  {
    question: 'כמה זמן לוקח לבנות אתר?',
    answer:
      'דף נחיתה ואתר תדמית ממוקד מתקדמים מהר יותר מחנות או מערכת. לוח הזמנים נקבע באפיון ותלוי גם במוכנות התכנים מצדכם.',
  },
];

const COMPARISON_ROWS: { feature: string; values: string[] }[] = [
  { feature: 'היקף', values: ['עמוד אחד', 'עד 6–8 עמודים', 'עד כ-50 מוצרים', 'לפי אפיון'] },
  { feature: 'פלטפורמה', values: ['לפי הצורך', 'Next.js או וורדפרס', 'חנות מלאה', 'פיתוח מותאם'] },
  { feature: 'עיצוב ייחודי', values: ['כן', 'כן', 'כן', 'כן'] },
  { feature: 'מובייל', values: ['כן', 'כן', 'כן', 'כן'] },
  { feature: 'טופס + וואטסאפ', values: ['כן', 'כן', 'כן', 'לפי אפיון'] },
  { feature: 'SEO טכני', values: ['בסיס', 'כן, כולל LocalBusiness ו-FAQ', 'כן, כולל SEO למוצרים', 'לפי אפיון'] },
  { feature: 'מוכנות לחיפוש AI / GEO', values: ['—', 'כן', 'כן', 'לפי אפיון'] },
  { feature: 'סליקה ישראלית ומשלוחים', values: ['—', '—', 'כן', 'לפי אפיון'] },
  { feature: 'מחיר התחלתי + מע״מ', values: ['מ-2,500 ₪', 'מ-6,500 ₪', 'מ-12,000 ₪', 'מ-20,000 ₪'] },
];

const PRICE_FACTORS = [
  {
    title: 'מספר העמודים והיקף התוכן',
    text: 'עמודים נוספים, גלריות ארוכות או תוכן שעדיין לא מוכן מאריכים את העבודה.',
  },
  {
    title: 'פונקציות מיוחדות',
    text: 'קביעת תורים, אזור אישי, טפסי הצעת מחיר מורכבים או חיבור ל-CRM משנים את ההיקף.',
  },
  {
    title: 'עיצוב והתאמה למותג',
    text: 'עיצוב ייחודי כלול בחבילות. שפה גרפית מורכבת או עיצוב מחדש של זהות המותג מתומחרים בנפרד אם צריך.',
  },
  {
    title: 'חנות מעבר לכ-50 מוצרים',
    text: 'החנות ההתחלתית כוללת עד כ-50 מוצרים. קטלוג גדול יותר, וריאציות ומלאי מורכב מייקרים את הפרויקט.',
  },
  {
    title: 'מי כותב את הטקסטים',
    text: 'אם תעבירו תוכן מוכן, העלות נשארת בחבילה. כתיבה על ידינו היא 250–400 ₪ לעמוד + מע״מ.',
  },
  {
    title: 'לוח זמנים',
    text: 'פרויקט דחוף או עבודה מחוץ לסדר הרגיל עלולה להשפיע על ההצעה. נגיד את זה מראש, לא בסוף.',
  },
];

export default function PricingPage() {
  const siteUrl = getSiteUrl();
  const pageUrl = `${siteUrl}/pricing`;

  const offerSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'בניית אתרים',
    serviceType: 'בניית אתרים',
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
    offers: PRICING_PACKAGES.map((pkg) => ({
      '@type': 'Offer',
      name: pkg.name,
      description: pkg.summary,
      url: pageUrl,
      price: String(pkg.startingPrice),
      priceCurrency: 'ILS',
      valueAddedTaxIncluded: false,
      priceSpecification: {
        '@type': 'PriceSpecification',
        price: String(pkg.startingPrice),
        priceCurrency: 'ILS',
        valueAddedTaxIncluded: false,
      },
    })),
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <div className="min-h-screen bg-white" dir="rtl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(offerSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <Hero3D
        theme="pricing"
        title="מחירון בניית אתרים"
        subtitle="תשובה ישירה לשאלה כמה עולה לבנות אתר? המחירים למטה הם מחירי פתיחה, לא כוללים מע״מ, ומתאימים לעסקים קטנים ובינוניים בישראל."
        align="center"
        ctas={[
          { href: '/contact', label: 'קבלו הצעת מחיר' },
          { href: '/services/web-development', label: 'בניית אתרים', variant: 'secondary' },
        ]}
      />

      <section data-reveal className="px-4 py-16">
        <div className="container mx-auto max-w-3xl text-right">
          <h2 className="mb-4 text-3xl font-bold text-gray-900">כמה עולה לבנות אתר?</h2>
          <p className="mb-4 text-lg leading-relaxed text-gray-700">
            ב-Top Webstak, מבית עדי פון תקשורת בפרדס חנה, בניית אתר מתחילה במחירים האלה + מע״מ:
          </p>
          <ul className="mb-6 list-disc space-y-2 pr-6 text-lg text-gray-800">
            <li>
              <strong>דף נחיתה</strong> — מ-2,500 ₪ + מע״מ
            </li>
            <li>
              <strong>אתר תדמית</strong> עד 6–8 עמודים ב-Next.js או בוורדפרס — מ-6,500 ₪ + מע״מ
            </li>
            <li>
              <strong>חנות אונליין</strong> — מ-12,000 ₪ + מע״מ
            </li>
            <li>
              <strong>פיתוח מותאם / מערכת</strong> — מ-20,000 ₪ + מע״מ, לפי אפיון
            </li>
          </ul>
          <p className="text-lg leading-relaxed text-gray-700">
            אלה לא מחירים סגורים בלי גמישות. אחרי שיחת אפיון קצרה תקבלו הצעה מדויקת להיקף שלכם.
            אפשר להתקשר ל-{PHONE_DISPLAY} או{' '}
            <Link href="/contact" className="text-blue-700 underline">
              להשאיר פרטים בעמוד יצירת הקשר
            </Link>
            .
          </p>
        </div>
      </section>

      <section data-reveal className="bg-gray-50 px-4 py-16">
        <div className="container mx-auto max-w-6xl">
          <h2 className="mb-10 text-center text-3xl font-bold text-gray-900">חבילות בניית אתרים</h2>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {PRICING_PACKAGES.map((pkg) => (
              <article
                key={pkg.id}
                className={`flex h-full flex-col rounded-2xl bg-white p-6 shadow-sm ${
                  pkg.highlighted ? 'ring-2 ring-blue-600' : 'ring-1 ring-gray-100'
                }`}
              >
                {pkg.highlighted && (
                  <p className="mb-2 text-sm font-semibold text-blue-700">הבחירה הנפוצה לעסק מקומי</p>
                )}
                <h3 className="mb-2 text-2xl font-bold text-gray-900">{pkg.name}</h3>
                <p className="mb-1 text-3xl font-bold text-blue-700">
                  {pkg.priceLabel} <span className="text-base font-medium text-gray-600">+ מע״מ</span>
                </p>
                <p className="mb-6 text-gray-600">{pkg.summary}</p>
                <ul className="mb-6 flex-1 space-y-2 text-gray-700">
                  {pkg.includes.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-1 text-blue-600" aria-hidden>
                        •
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="space-y-3">
                  <a
                    href={whatsappUrl(pkg.whatsappText)}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-package-name={pkg.name}
                    data-cta-location="pricing"
                    className="block rounded-full bg-green-600 px-4 py-3 text-center font-semibold text-white transition-colors hover:bg-green-700"
                  >
                    וואטסאפ: {PHONE_DISPLAY}
                  </a>
                  <Link
                    href="/contact"
                    data-cta="true"
                    data-package-name={pkg.name}
                    data-cta-location="pricing"
                    className="block rounded-full border border-blue-700 px-4 py-3 text-center font-semibold text-blue-700 transition-colors hover:bg-blue-50"
                  >
                    השאירו פרטים
                  </Link>
                  <Link href={pkg.serviceHref} className="block text-center text-sm text-blue-700 underline">
                    עוד על {pkg.serviceLabel}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section data-reveal className="px-4 py-16">
        <div className="container mx-auto max-w-6xl">
          <h2 className="mb-8 text-center text-3xl font-bold text-gray-900">השוואת חבילות</h2>
          <div className="overflow-x-auto rounded-2xl ring-1 ring-gray-100">
            <table className="min-w-full text-right text-sm md:text-base">
              <thead className="bg-blue-700 text-white">
                <tr>
                  <th className="px-4 py-3 font-semibold">מה כלול</th>
                  {PRICING_PACKAGES.map((pkg) => (
                    <th key={pkg.id} className="px-4 py-3 font-semibold">
                      {pkg.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARISON_ROWS.map((row, index) => (
                  <tr key={row.feature} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <th className="px-4 py-3 font-semibold text-gray-900">{row.feature}</th>
                    {row.values.map((value, valueIndex) => (
                      <td key={`${row.feature}-${valueIndex}`} className="px-4 py-3 text-gray-700">
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section data-reveal className="bg-gray-50 px-4 py-16">
        <div className="container mx-auto max-w-5xl">
          <h2 className="mb-10 text-center text-3xl font-bold text-gray-900">מה משפיע על המחיר</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {PRICE_FACTORS.map((item) => (
              <div key={item.title} className="rounded-xl bg-white p-6 shadow-sm">
                <h3 className="mb-2 text-xl font-semibold text-gray-900">{item.title}</h3>
                <p className="text-gray-600">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section data-reveal className="px-4 py-16">
        <div className="container mx-auto max-w-4xl">
          <h2 className="mb-4 text-center text-3xl font-bold text-gray-900">עלויות שוטפות ותוספות</h2>
          <p className="mx-auto mb-10 max-w-3xl text-center text-lg text-gray-700">
            בניית האתר היא עלות חד-פעמית. אלה השירותים הנפרדים שאפשר להוסיף – גם הם + מע״מ:
          </p>
          <div className="overflow-hidden rounded-2xl ring-1 ring-gray-100">
            <table className="min-w-full text-right">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 font-semibold text-gray-900">תוספת</th>
                  <th className="px-4 py-3 font-semibold text-gray-900">מחיר</th>
                  <th className="px-4 py-3 font-semibold text-gray-900">מה זה כולל</th>
                </tr>
              </thead>
              <tbody>
                {PRICING_ADDONS.map((addon, index) => (
                  <tr key={addon.name} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-3 font-medium text-gray-900">{addon.name}</td>
                    <td className="px-4 py-3 text-gray-800">{addon.priceLabel} + מע״מ</td>
                    <td className="px-4 py-3 text-gray-600">{addon.detail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section data-reveal className="bg-blue-50 px-4 py-16">
        <div className="container mx-auto max-w-3xl text-right">
          <h2 className="mb-4 text-3xl font-bold text-gray-900">רוצים לראות עבודות או להעמיק בשירות?</h2>
          <p className="mb-6 text-lg text-gray-700">
            המחירון משלים את דפי השירות. אפשר לעבור לדוגמאות או לקרוא מה כולל כל סוג אתר:
          </p>
          <ul className="space-y-2 text-lg">
            <li>
              <Link href="/portfolio" className="font-semibold text-blue-700 underline">
                תיק עבודות
              </Link>
            </li>
            <li>
              <Link href="/services/web-development" className="font-semibold text-blue-700 underline">
                בניית אתרים
              </Link>
            </li>
            <li>
              <Link href="/services/wordpress" className="font-semibold text-blue-700 underline">
                אתרי וורדפרס
              </Link>
            </li>
            <li>
              <Link href="/services/ecommerce" className="font-semibold text-blue-700 underline">
                חנויות אונליין
              </Link>
            </li>
            <li>
              <Link href="/services/software-development" className="font-semibold text-blue-700 underline">
                פיתוח מערכות
              </Link>
            </li>
            <li>
              <Link href="/services/bniyat-atarim-pardes-hana" className="font-semibold text-blue-700 underline">
                בניית אתרים בפרדס חנה
              </Link>
            </li>
          </ul>
        </div>
      </section>

      <section data-reveal className="px-4 py-16">
        <div className="container mx-auto max-w-3xl">
          <h2 className="mb-10 text-center text-3xl font-bold text-gray-900">שאלות נפוצות על מחירים</h2>
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

      <section data-reveal className="bg-blue-700 px-4 py-16 text-white">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold">רוצים הצעה מדויקת לעסק שלכם?</h2>
          <p className="mb-8 text-lg text-white/90">
            שלחו הודעה בוואטסאפ או השאירו פרטים. נחזור עם הצעת מחיר לפי האפיון – בלי התחייבות.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href={whatsappUrl('שלום, אשמח לקבל הצעת מחיר לבניית אתר.')}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-white px-8 py-3 text-lg font-semibold text-blue-700 transition-colors hover:bg-blue-50"
            >
              וואטסאפ: {PHONE_DISPLAY}
            </a>
            <a
              href={`tel:${PHONE_TEL}`}
              className="rounded-full border border-white px-8 py-3 text-lg font-semibold text-white transition-colors hover:bg-white/10"
            >
              חייגו: {PHONE_DISPLAY}
            </a>
            <Link
              href="/contact"
              className="rounded-full border border-white px-8 py-3 text-lg font-semibold text-white transition-colors hover:bg-white/10"
            >
              עמוד יצירת קשר
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
