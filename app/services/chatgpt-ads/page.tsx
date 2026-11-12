import Link from 'next/link';
import {
  FaBullhorn,
  FaChartBar,
  FaCheck,
  FaClipboardCheck,
  FaCog,
  FaPen,
  FaShieldAlt,
} from 'react-icons/fa';
import { chatgptAdsHeroTitle, isolateLatinPhrases } from '../../../lib/bidi';
import { getSiteUrl } from '../../../lib/seo';
import Hero3D from '../../components/hero3d/Hero3D';
import ServiceCtaBanner from '../../components/ServiceCtaBanner';
import ChatGptAdsFaq from './ChatGptAdsFaq';
import { FAQ } from './content';

const PHONE_DISPLAY = '050-9159951';
const PHONE_TEL = '+972509159951';
const WHATSAPP_HREF =
  'https://wa.me/972509159951?text=%D7%90%D7%A0%D7%99%20%D7%9E%D7%A2%D7%95%D7%A0%D7%99%D7%9F%20%D7%91%D7%A9%D7%99%D7%A8%D7%95%D7%AA%20%D7%A4%D7%A8%D7%A1%D7%95%D7%9D%20%D7%91-ChatGPT';

const WHAT_WE_DO = [
  {
    title: 'בדיקת זכאות ומדיניות',
    description:
      'בודקים לפני הקמה אם הקטגוריה והעסק מתאימים למדיניות OpenAI — כולל מגבלות מחוץ לארה״ב לפיננסים, בריאות ומשפט.',
    icon: FaClipboardCheck,
  },
  {
    title: 'הקמת חשבון Ads Manager',
    description:
      'פתיחת חשבון מפרסם על שם העסק, אימות, לוגו ומותג, הגדרת ILS ואזור זמן — לפני שהשדות ננעלים.',
    icon: FaShieldAlt,
  },
  {
    title: 'מדידה ו-UTM',
    description:
      'חיבור מדידת המרות, פרמטרי UTM לדפי נחיתה, ווידוא שהעמודים נגישים לסורקי המודעות של OpenAI.',
    icon: FaChartBar,
  },
  {
    title: 'מודעות ורמזי הקשר',
    description:
      'כתיבת כותרות ותיאורים, בחירת קריאייטיב, והגדרת רמזי הקשר (Context hints) — לא מילות מפתח בהתאמה מדויקת.',
    icon: FaPen,
  },
  {
    title: 'השקה ואופטימיזציה',
    description:
      'העלאת קמפיינים, מעקב אחרי חשיפות וקליקים, וכיוונון תקציב והצעות מחיר לפי נתונים — בלי להגדיל תקציב בלי בסיס.',
    icon: FaCog,
  },
  {
    title: 'דיווח שקוף',
    description:
      'דוחות תקופתיים עם הוצאה, ביצועים והמלצות. החשבון וההיסטוריה נשארים בבעלות העסק.',
    icon: FaBullhorn,
  },
];

const PROCESS = [
  {
    title: 'אפיון וזכאות',
    description: 'שיחת היכרות, בדיקת קטגוריה ומטרות, והחלטה אם ChatGPT Ads מתאים לצד הערוצים האחרים.',
  },
  {
    title: 'הקמת חשבון ומדידה',
    description: 'פתיחת חשבון על שם העסק, חיוב, הרשאות צוות, וחיבור מדידת המרות לפני מדיה.',
  },
  {
    title: 'השקת קמפיין',
    description: 'בניית מבנה קמפיין, רמזי הקשר, מודעות וקריאייטיב — ואישור לפני עלייה לאוויר.',
  },
  {
    title: 'אופטימיזציה',
    description: 'ניתוח נתונים, שיפור ביצועים, והתאמת מסרים — בתקציב שמוסכם מראש.',
  },
];

const SETUP_PRICE = 1500;

const MANAGEMENT_PACKAGES = [
  {
    id: 'starter',
    name: 'בסיס',
    price: 1000,
    summary: 'לעסק עם קמפיין ממוקד ותקציב מדיה צנוע.',
    includes: [
      'קמפיין פעיל אחד',
      'עד שתי קבוצות מודעות',
      'אופטימיזציה חודשית',
      'דוח חודשי מסכם',
    ],
  },
  {
    id: 'standard',
    name: 'סטנדרט',
    price: 1500,
    summary: 'לעסק שרוצה כיסוי רחב יותר בקמפיין אחד או שניים.',
    includes: [
      'עד שני קמפיינים פעילים',
      'עד שלוש קבוצות מודעות',
      'אופטימיזציה דו-שבועית',
      'דוח חודשי + המלצות לקריאייטיב',
    ],
  },
  {
    id: 'growth',
    name: 'צמיחה',
    price: 2000,
    summary: 'לעסק עם מספר מוצרים או קהלים שדורשים מעקב צמוד.',
    includes: [
      'עד שלושה קמפיינים פעילים',
      'וריאציות קריאייטיב נוספות',
      'אופטימיזציה שבועית',
      'מעקב המרות ודוח מפורט',
    ],
  },
  {
    id: 'premium',
    name: 'פרימיום',
    price: 2500,
    summary: 'להיקפים גדולים יותר ולשילוב עם ערוצים נוספים.',
    includes: [
      'מספר קמפיינים מורחב (לפי אפיון)',
      'בדיקות A/B לקריאייטיב',
      'אופטימיזציה שבועית מעמיקה',
      'דוח משולב מול גוגל/מטא כשמנהלים גם PPC',
    ],
  },
] as const;

export default function ChatGptAdsPage() {
  const siteUrl = getSiteUrl();
  const pageUrl = `${siteUrl}/services/chatgpt-ads`;
  const organizationId = `${siteUrl}/#organization`;

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'ChatGPT Ads management',
    name: 'פרסום ממומן ב-ChatGPT לעסקים בישראל',
    url: pageUrl,
    description:
      'הקמת חשבון ב-ChatGPT Ads Manager, מודעות, רמזי הקשר, מדידה וניהול קמפיינים לעסקים בישראל.',
    provider: { '@id': organizationId },
    areaServed: 'IL',
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
        theme="chatgpt-ads"
        title={chatgptAdsHeroTitle()}
        subtitle={isolateLatinPhrases(
          'הקמת חשבון ב-ChatGPT Ads Manager, מודעות, מדידה וניהול קמפיינים — תקציב המדיה ל-OpenAI בנפרד מדמי הניהול.'
        )}
        align="center"
        ctas={[
          { href: '/contact', label: 'שיחת ייעוץ של 15 דקות' },
          {
            href: WHATSAPP_HREF,
            label: `וואטסאפ: ${PHONE_DISPLAY}`,
            variant: 'secondary',
            external: true,
          },
        ]}
      >
        <p className="mt-4 max-w-2xl text-center text-sm text-white/85">
          {isolateLatinPhrases(
            'Top Webstak אינה קשורה ל-OpenAI. מודעה בתשלום אינה המלצה של ChatGPT ואינה משנה את התשובה האורגנית.'
          )}
        </p>
      </Hero3D>

      <section data-reveal className="px-4 py-16">
        <div className="container mx-auto max-w-3xl text-right">
          <p className="mb-6 text-lg leading-relaxed text-gray-700">
            {isolateLatinPhrases(
              'ChatGPT Ads הוא מערכת מודעות נפרדת: כרטיס מסומן שמופיע בדרך כלל מתחת לתשובת ChatGPT, לפי הקשר השיחה. זה לא תביעת פרופיל ב-'
            )}
            <Link href="/services/chatgpt-business-hub" className="text-blue-700 underline">
              ChatGPT Business Hub
            </Link>
            {isolateLatinPhrases(' ולא «קידום ב-ChatGPT» האורגני ב-')}
            <Link href="/services/aeo-geo" className="text-blue-700 underline">
              קידום במנועי AI (AEO/GEO)
            </Link>
            . שלושת השירותים משלימים זה את זה — אבל הם לא אותו מוצר.
          </p>
          <p className="text-sm text-gray-500">Top Webstak אינה קשורה ל-OpenAI.</p>
        </div>
      </section>

      <section data-reveal className="border-y border-blue-100 bg-blue-50 px-4 py-12">
        <div className="container mx-auto max-w-3xl text-right">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">
            מודעה בתשלום לעומת פרופיל עסקי ב-{isolateLatinPhrases('Business Hub')}
          </h2>
          <div className="space-y-4 text-lg leading-relaxed text-gray-800">
            <p>
              <strong>{isolateLatinPhrases('ChatGPT Ads')}:</strong> כרטיס מודעה מסומן שמופיע בדרך כלל
              מתחת לתשובת ChatGPT. משלמים ל-OpenAI על חשיפות/קליקים לפי הגדרות הקמפיין. המודעה לא
              משנה את התשובה האורגנית ולא נראית כהמלצה של ChatGPT (לפי{' '}
              <a
                href="https://help.openai.com/he-il/articles/20001207-ads-in-chatgpt-the-basics"
                className="text-blue-700 underline"
                rel="noopener noreferrer"
                target="_blank"
              >
                מרכז העזרה של OpenAI
              </a>
              ).
            </p>
            <p>
              <strong>{isolateLatinPhrases('Business Hub')}:</strong> לוח לתביעת הפרופיל הרשמי,
              עדכון פרטי העסק ומעקב אחרי אזכורים וקליקים אורגניים — בלי לשלם על מודעה מתחת לתשובה.
              השירות שלנו לפרופיל:{' '}
              <Link href="/services/chatgpt-business-hub" className="text-blue-700 underline">
                עסק ב-ChatGPT Business Hub
              </Link>
              . אפשר לשלב את שני הערוצים, אבל הם לא מחליפים זה את זה.
            </p>
          </div>
        </div>
      </section>

      <section data-reveal className="bg-gray-50 px-4 py-16">
        <div className="container mx-auto max-w-3xl text-right">
          <div className="rounded-xl border-r-4 border-blue-600 bg-blue-50 p-6">
            <h2 className="mb-3 text-2xl font-bold text-gray-900">למי מוצגות מודעות?</h2>
            <p className="mb-4 text-lg leading-relaxed text-gray-800">
              לפי{' '}
              <a
                href="https://help.openai.com/he-il/articles/20001207-ads-in-chatgpt-the-basics"
                className="text-blue-700 underline"
                rel="noopener noreferrer"
                target="_blank"
              >
                מרכז העזרה של OpenAI
              </a>
              , {isolateLatinPhrases(
                'מודעות מוצגות במסלולי Free ו-Go בלבד — לא ב-Plus, Pro או תוכניות Business. אין מודעות'
              )}
              למשתמשים שזוהו כמתחת לגיל 18. המודעות מסומנות ומופרדות מהתשובה, והמפרסם מקבל מדדים
              מצטברים בלבד, בלי תוכן השיחות.
            </p>
            <p className="text-lg leading-relaxed text-gray-800">
              {isolateLatinPhrases(
                'ברשימת OpenAI ל-Ads Manager ישראל מסומנת כ-Available לשירות עצמי ('
              )}
              <a
                href="https://help.openai.com/en/articles/20001245-ads-manager-availability"
                className="text-blue-700 underline"
                rel="noopener noreferrer"
                target="_blank"
              >
                {isolateLatinPhrases('Ads Manager Availability')}
              </a>
              {isolateLatinPhrases(
                '). הישות המשפטית שמפרסמת צריכה להיות רשומה במדינה זמינה. הפריסה למשתמשים בישראל עשויה להיות הדרגתית — אין להבטיח שכל משתמש רואה מודעות בכל רגע, ואין להבטיח חשיפה מלאה.'
              )}
            </p>
          </div>
        </div>
      </section>

      <section data-reveal className="px-4 py-16">
        <div className="container mx-auto max-w-3xl text-right">
          <h2 className="mb-4 text-3xl font-bold text-gray-900">למי זה מתאים — ולמי לא</h2>
          <p className="mb-4 text-lg text-gray-700">
            <strong>מתאים בעיקר ל:</strong> מוצרים לצרכן, שירותים מקומיים, תיירות וחוויות, ומוצרים
            דיגיטליים והשכלה — לפי{' '}
            <a
              href="https://openai.com/policies/ad-policies/"
              className="text-blue-700 underline"
              rel="noopener noreferrer"
              target="_blank"
            >
              מדיניות המודעות של OpenAI
            </a>
            .
          </p>
          <p className="text-lg text-gray-700">
            <strong>לא מתאים כרגע (מחוץ לארה״ב, לפי המדיניות):</strong> שירותים פיננסיים, רפואיים
            ומשפטיים ככלל; ובכל מקום — הימורים, פוליטיקה, היכרויות, אלכוהול וטבק. בודקים זכאות לפני
            כל התחייבות. {isolateLatinPhrases('האישור הסופי הוא של OpenAI.')}.
          </p>
        </div>
      </section>

      <section data-reveal className="bg-gray-50 px-4 py-16">
        <div className="container mx-auto max-w-3xl text-right">
          <h2 className="mb-4 text-3xl font-bold text-gray-900">
            פורמט, מיקוד וחיוב — לפי {isolateLatinPhrases('OpenAI')}
          </h2>
          <p className="mb-4 text-lg leading-relaxed text-gray-700">
            {isolateLatinPhrases(
              'פורמט מודעה סטנדרטי כולל שם מפרסם, כותרת, תיאור, דף נחיתה וקריאייטיב; ייתכנו אפשרויות נוספות (למשל תמונה בודדת או ריבוי תמונות) לפי מה שפתוח בחשבון — ראו '
            )}
            <a
              href="https://help.openai.com/en/articles/20001212-create-ads-for-chatgpt-ads"
              className="text-blue-700 underline"
              rel="noopener noreferrer"
              target="_blank"
            >
              {isolateLatinPhrases('Creating ads for ChatGPT Ads')}
            </a>
            .
          </p>
          <p className="mb-4 text-lg leading-relaxed text-gray-700">
            {isolateLatinPhrases(
              'מיקוד כולל מדינות ולעיתים מיקומים מדויקים יותר, פלטפורמות אופציונליות וקהלים מותאמים כשהם זמינים. רמזי הקשר (Context hints) מתארים נושאים רלוונטיים — הם אינם מילות מפתח בהתאמה מדויקת ואינם מבטיחים הופעה בשיחה מסוימת. זמינות אפשרויות המיקוד משתנה לפי מדינה, סוג קמפיין והחשבון; אנחנו לא מבטיחים מיקוד דמוגרפי או כיסוי מלא של כל המשתמשים.'
            )}
          </p>
          <p className="text-lg leading-relaxed text-gray-700">
            {isolateLatinPhrases('חיוב המדיה הוא לאחר הצגת המודעות (פוסטפיי). יעדי קמפיין ותקציב מוגדרים לפי ')}
            <a
              href="https://help.openai.com/en/articles/20001210"
              className="text-blue-700 underline"
              rel="noopener noreferrer"
              target="_blank"
            >
              יצירת קמפיינים
            </a>{' '}
            ו
            <a
              href="https://help.openai.com/en/articles/20001216-billing-payment"
              className="text-blue-700 underline"
              rel="noopener noreferrer"
              target="_blank"
            >
              חיוב ותשלום
            </a>{' '}
            {isolateLatinPhrases('של OpenAI.')}
          </p>
        </div>
      </section>

      <section data-reveal className="px-4 py-16">
        <div className="container mx-auto max-w-5xl">
          <h2 className="mb-10 text-center text-3xl font-bold text-gray-900">מה אנחנו עושים</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {WHAT_WE_DO.map((item) => (
              <div key={item.title} className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                <item.icon className="mb-3 h-8 w-8 text-blue-600" aria-hidden />
                <h3 className="mb-2 text-xl font-semibold text-gray-900">{item.title}</h3>
                <p className="text-gray-600">{isolateLatinPhrases(item.description)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section data-reveal className="px-4 py-16">
        <div className="container mx-auto max-w-5xl">
          <h2 className="mb-10 text-center text-3xl font-bold text-gray-900">תהליך העבודה</h2>
          <div className="grid gap-6 md:grid-cols-4">
            {PROCESS.map((step, index) => (
              <div key={step.title} className="rounded-xl bg-gray-50 p-6 text-center shadow-sm">
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
                  {index + 1}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">{step.title}</h3>
                <p className="text-sm text-gray-600">{isolateLatinPhrases(step.description)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section data-reveal className="bg-gray-50 px-4 py-16">
        <div className="container mx-auto max-w-3xl text-right">
          <h2 className="mb-4 text-3xl font-bold text-gray-900">איך משלמים ל-OpenAI</h2>
          <p className="mb-4 text-lg leading-relaxed text-gray-700">
            לפי{' '}
            <a
              href="https://help.openai.com/en/articles/20001210"
              className="text-blue-700 underline"
              rel="noopener noreferrer"
              target="_blank"
            >
              תיעוד OpenAI ליצירת קמפיינים
            </a>
            , יעדי קמפיין כוללים חשיפות (CPM), קליקים (CPC) או אופטימיזציה להמרות — בלי תשלום פר
            המרה בפני עצמו. בחשבון שקלי מוגדר תקציב יומי מינימלי של <strong>60 ₪</strong>, כממוצע על
            פני שבעה ימים (ביום בודד ההוצאה עשויה להגיע עד פי שניים). התשלום למדיה הוא ישירות ל-OpenAI,
            נפרד מדמי הניהול שלנו.
          </p>
          <p className="text-lg leading-relaxed text-gray-700">
            לשילוב עם{' '}
            <Link href="/services/ppc" className="text-blue-700 underline">
              קידום ממומן בגוגל וברשתות חברתיות (PPC)
            </Link>
            , עם{' '}
            <Link href="/services/chatgpt-business-hub" className="text-blue-700 underline">
              פרופיל עסקי ב-Business Hub
            </Link>
            , ועם{' '}
            <Link href="/services/aeo-geo" className="text-blue-700 underline">
              קידום אורגני במנועי AI
            </Link>
            .
          </p>
        </div>
      </section>

      <section data-reveal className="bg-blue-50 px-4 py-16">
        <div className="container mx-auto max-w-5xl">
          <h2 className="mb-4 text-center text-3xl font-bold text-gray-900">מחירים</h2>
          <p className="mx-auto mb-6 max-w-2xl text-center text-lg text-gray-700">
            מחירי השירות + מע״מ. תקציב המדיה משולם ישירות ל-OpenAI (מינימום רשמי 60 ₪ ליום בחשבון
            שקלי). אחרי בדיקת זכאות ואפיון קצר נאשר את חבילת הניהול המתאימה.
          </p>
          <article className="mx-auto mb-10 max-w-xl rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
            <h3 className="mb-2 text-2xl font-bold text-gray-900">הקמה חד-פעמית</h3>
            <p className="mb-1 text-3xl font-bold text-blue-700">
              {SETUP_PRICE.toLocaleString('he-IL')} ₪{' '}
              <span className="text-base font-medium text-gray-600">+ מע״מ</span>
            </p>
            <p className="mb-4 text-gray-600">
              בדיקת זכאות, הקמת חשבון, חיוב ומדידה, מודעות ראשונות ורמזי הקשר.
            </p>
            <ul className="space-y-3">
              {['חשבון על שם העסק והרשאות צוות', 'חיבור מדידת המרות ו-UTM', 'מודעות ראשונות לפני השקה'].map(
                (line) => (
                  <li key={line} className="flex items-start gap-3">
                    <FaCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" aria-hidden />
                    <span className="text-gray-700">{line}</span>
                  </li>
                )
              )}
            </ul>
          </article>
          <h3 className="mb-6 text-center text-2xl font-bold text-gray-900">חבילות ניהול חודשי</h3>
          <div className="grid gap-6 md:grid-cols-2">
            {MANAGEMENT_PACKAGES.map((pkg) => (
              <article
                key={pkg.id}
                className="flex h-full flex-col rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100"
              >
                <h4 className="mb-1 text-xl font-bold text-gray-900">{pkg.name}</h4>
                <p className="mb-3 text-sm text-gray-600">{pkg.summary}</p>
                <p className="mb-4 text-3xl font-bold text-blue-700">
                  {pkg.price.toLocaleString('he-IL')} ₪{' '}
                  <span className="text-base font-medium text-gray-600">לחודש + מע״מ</span>
                </p>
                <ul className="flex-1 space-y-3">
                  {pkg.includes.map((line) => (
                    <li key={line} className="flex items-start gap-3">
                      <FaCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" aria-hidden />
                      <span className="text-gray-700">{line}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
          <p className="mt-8 text-center text-gray-700">
            פירוט נוסף ב
            <Link href="/pricing" className="text-blue-700 underline">
              מחירון
            </Link>
            . צריכים גם דף נחיתה מותאם? ראו{' '}
            <Link href="/services/web-development" className="text-blue-700 underline">
              בניית אתרים
            </Link>
            .
          </p>
        </div>
      </section>

      <section data-reveal className="border-t border-gray-100 px-4 py-10">
        <div className="container mx-auto max-w-3xl text-center">
          <p className="text-lg text-gray-700">
            מחפשים קמפיינים בגוגל ובמטא? ראו{' '}
            <Link href="/services/ppc" className="font-semibold text-blue-700 underline">
              קידום ממומן (PPC)
            </Link>
            — ערוץ נפרד, עם חשבונות פרסום נפרדים ותקציב מדיה משלו.
          </p>
        </div>
      </section>

      <ChatGptAdsFaq />

      <ServiceCtaBanner serviceKey="chatgpt-ads" />
    </div>
  );
}
