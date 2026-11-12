import Link from 'next/link';
import {
  FaChartLine,
  FaCheck,
  FaClipboardCheck,
  FaIdCard,
  FaShieldAlt,
  FaStore,
  FaUserCheck,
} from 'react-icons/fa';
import { isolateLatinPhrases } from '../../../lib/bidi';
import { getSiteUrl } from '../../../lib/seo';
import Hero3D from '../../components/hero3d/Hero3D';
import ServiceCtaBanner from '../../components/ServiceCtaBanner';
import ChatGptBusinessHubFaq from './ChatGptBusinessHubFaq';
import { FAQ } from './content';

const PHONE_DISPLAY = '050-9159951';
const PHONE_TEL = '+972509159951';
const WHATSAPP_HREF =
  'https://wa.me/972509159951?text=%D7%90%D7%A0%D7%99%20%D7%9E%D7%A2%D7%95%D7%A0%D7%99%D7%9F%20%D7%91%D7%A9%D7%99%D7%A8%D7%95%D7%AA%20ChatGPT%20Business%20Hub';

const WHAT_WE_DO = [
  {
    title: 'בדיקת זכאות והכנה',
    description:
      'בודקים אם העסק יכול לתבוע פרופיל היום, מה חסר באתר, ואיזו שיטת אימות הכי מתאימה (דומיין, מייל עסקי, טלפון או Shopify).',
    icon: FaClipboardCheck,
  },
  {
    title: 'תביעת הפרופיל ואימות טכני',
    description:
      'מלווים את פתיחת ה-Business Hub, מחפשים את הרישום או מוסיפים עסק אונליין כשאפשר, ומטפלים באימות — כולל רשומת DNS באתר אם צריך.',
    icon: FaShieldAlt,
  },
  {
    title: 'ליווי באימות הזהות',
    description:
      'OpenAI דורשת אימות זהות ב-Persona מול בעל העסק או מורשה חתימה. את השלב הזה חייב לבצע אדם מוסמך מצד הלקוח; אנחנו מכינים אותו מראש.',
    icon: FaUserCheck,
  },
  {
    title: 'בניית הפרופיל',
    description:
      'כותבים ומתאימים תיאור, קטגוריה, מדיניות ונכסים גרפיים כך שיתאימו לאתר ולשפה של הלקוחות. וי כחול בפרופיל מופיע רק אחרי אישור Persona — לא אחרי תביעה בלבד.',
    icon: FaIdCard,
  },
  {
    title: 'פיד מוצרים, אם זמין',
    description:
      'חיבור Shopify או הכנת פיד לפי המפרט, בלי הבטחה ש-ChatGPT ימליץ על המוצרים.',
    icon: FaStore,
  },
  {
    title: 'Insights וגישת סוכנות',
    description:
      'מחברים גישה מסודרת לצוות שלנו, ועוקבים אחרי אזכורים, קליקים ונושאי גילוי בחלון של 28 ימים.',
    icon: FaChartLine,
  },
];

const PROCESS = [
  {
    title: 'אבחון זכאות',
    description:
      'שיחת היכרות קצרה, בדיקה אם העסק יכול לתבוע פרופיל היום, ומה ChatGPT כבר אומר עליכם ועל הקטגוריה.',
  },
  {
    title: 'תביעה ואימות',
    description: 'פתיחת Business Hub, אימות בעלות, וליווי הלקוח באימות הזהות ב-Persona.',
  },
  {
    title: 'הקמת הפרופיל',
    description: 'עדכון הפרטים, חיבור פיד אם רלוונטי וזמין, והגדרת גישה לצוות.',
  },
  {
    title: 'ניהול ומדידה',
    description:
      'מעקב שוטף אחרי Insights, עדכון פרטים כשצריך, ודוח תקופתי. אם הנתונים ריקים — זה יכול להיות סף דיווח, לא בהכרח אפס פעילות.',
  },
];

export default function ChatGptBusinessHubPage() {
  const siteUrl = getSiteUrl();
  const pageUrl = `${siteUrl}/services/chatgpt-business-hub`;
  const organizationId = `${siteUrl}/#organization`;

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'ChatGPT Business Hub setup and management',
    name: 'הקמה וניהול פרופיל עסקי ב-ChatGPT Business Hub',
    url: pageUrl,
    description:
      'תביעה, אימות והקמת פרופיל עסקי ב-ChatGPT Business Hub, עדכון פרטים ומעקב אחרי אזכורים וקליקים לאתר.',
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
        theme="aeo-geo"
        title="הקמה וניהול של העסק שלכם ב-ChatGPT"
        subtitle={isolateLatinPhrases(
          'תביעת הפרופיל ב-ChatGPT Business Hub, אימות, עדכון פרטים ומעקב אחרי אזכורים וקליקים לאתר — לעסקים בישראל עם אתר.'
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
            'השירות בבטא אצל OpenAI, והזכאות תלויה בסוג העסק ובאישור שלהם. תביעת פרופיל לא מבטיחה ש-ChatGPT ימליץ עליכם יותר.'
          )}
        </p>
      </Hero3D>

      <section data-reveal className="px-4 py-16">
        <div className="container mx-auto max-w-3xl text-right">
          <p className="mb-6 text-lg leading-relaxed text-gray-700">
            ChatGPT כבר מדבר על עסקים, מפנה לאתרים ומשווה בין מותגים. עד לאחרונה כמעט לא הייתה דרך לנהל
            את מה שמופיע שם. OpenAI פתחה בבטא את Business Hub — הלוח שבו תובעים את הפרופיל, מעדכנים
            פרטים ורואים נתוני Insights על אזכורים וקליקים.
          </p>
          <p className="text-lg leading-relaxed text-gray-700">
            ב-Top Webstak, מבית עדי פון תקשורת, אנחנו מלווים את ההקמה ואת הניהול השוטף — כולל אימות,
            כתיבת הפרופיל וחיבור ל
            <Link href="/services/aeo-geo" className="text-blue-700 underline">
              אופטימיזציה של האתר לתשובות AI
            </Link>
            .
          </p>
          <p className="mt-6 text-sm text-gray-500">Top Webstak אינה קשורה ל-OpenAI.</p>
        </div>
      </section>

      <section data-reveal className="bg-gray-50 px-4 py-16">
        <div className="container mx-auto max-w-3xl text-right">
          <div className="rounded-xl border-r-4 border-blue-600 bg-blue-50 p-6">
            <h2 className="mb-3 text-2xl font-bold text-gray-900">
              מה זה {isolateLatinPhrases('ChatGPT Business Hub')}?
            </h2>
            <p className="mb-4 text-lg leading-relaxed text-gray-800">
              Business Hub הוא לוח הניהול של התוכנית &quot;עסקים ב-ChatGPT&quot; (Businesses in ChatGPT),
              שהושקה בבטא ב-10 בנובמבר 2026. אחרי אימות בעלות ואימות זהות ב-Persona, אפשר לעדכן אתר,
              תיאור, קטגוריה, לוגו ומדיניות, ולראות נתונים מצטברים על 28 הימים האחרונים: אזכורים,
              קליקים לאתר ונושאי גילוי.
            </p>
            <p className="mb-4 text-lg leading-relaxed text-gray-800">
              לחנויות אפשר לחבר פיד מוצרים עם מחיר וזמינות כשהאפשרות זמינה לעסק — חיבור פיד לא מבטיח
              שהמוצרים יופיעו בהמלצות של ChatGPT.
            </p>
            <p className="text-lg leading-relaxed text-gray-800">
              <strong>זה לא מנוי ChatGPT Business.</strong> מנוי הצוות הוא מוצר בתשלום נפרד. Business Hub
              הוא כלי לניהול איך העסק מופיע מול משתמשים — בלי חובה על מנוי צוות או חשבון מודעות.
            </p>
          </div>
        </div>
      </section>

      <section data-reveal className="px-4 py-16">
        <div className="container mx-auto max-w-3xl text-right">
          <h2 className="mb-4 text-3xl font-bold text-gray-900">למי זה מתאים עכשיו, ולמי עדיין לא</h2>
          <p className="mb-4 text-lg text-gray-700">
            <strong>מתאים בעיקר ל:</strong> חנויות אונליין עם אתר (כולל Shopify), עסקי שירות דיגיטליים עם
            אתר ברור, ומותגים שכבר מופיעים בתשובות ChatGPT ורוצים לנהל פרטים ומדידה.
          </p>
          <p className="mb-4 text-lg text-gray-700">
            <strong>כדאי לבדוק לפני שמתחילים:</strong> עסק מקומי בלבד — לפי OpenAI, חנויות ומסעדות מקומיות
            יכולות כרגע לתבוע רק רשומה קיימת בארצות הברית. מי שמחפש Business Agent (נציג AI בתוך ChatGPT)
            — היכולת פתוחה כיום רק לעסקי מסחר ושירות מקוון זכאים <strong>בארצות הברית</strong>, לא בישראל.
          </p>
          <p className="text-lg text-gray-700">
            אנחנו בודקים זכאות מול החשבון והמדיניות העדכנית של OpenAI לפני תביעה. לא כל בקשה מאושרת.
          </p>
        </div>
      </section>

      <section data-reveal className="bg-gray-50 px-4 py-16">
        <div className="container mx-auto max-w-5xl">
          <h2 className="mb-10 text-center text-3xl font-bold text-gray-900">מה אנחנו עושים</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {WHAT_WE_DO.map((item) => (
              <div key={item.title} className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                <item.icon className="mb-3 h-8 w-8 text-blue-600" aria-hidden />
                <h3 className="mb-2 text-xl font-semibold text-gray-900">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-center text-gray-700">
            משלבים עם{' '}
            <Link href="/services/aeo-geo" className="text-blue-700 underline">
              אופטימיזציה של האתר לתשובות AI
            </Link>
            ,{' '}
            <Link href="/services/seo" className="text-blue-700 underline">
              קידום אורגני
            </Link>
            ,{' '}
            <Link href="/services/ecommerce" className="text-blue-700 underline">
              בניית חנות
            </Link>{' '}
            ו
            <Link href="/services/web-development" className="text-blue-700 underline">
              בניית אתרים
            </Link>{' '}
            לפי הצורך.
          </p>
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
                <p className="text-sm text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section data-reveal className="bg-blue-50 px-4 py-16">
        <div className="container mx-auto max-w-4xl">
          <h2 className="mb-4 text-center text-3xl font-bold text-gray-900">מחירים</h2>
          <p className="mx-auto mb-10 max-w-2xl text-center text-lg text-gray-700">
            מחירי פתיחה + מע״מ. אחרי בדיקת זכאות ושיחת אפיון קצרה תקבלו הצעה מדויקת להיקף שלכם.
          </p>
          <div className="grid gap-6 md:grid-cols-2">
            <article className="flex h-full flex-col rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
              <h3 className="mb-2 text-2xl font-bold text-gray-900">הקמת פרופיל (חד-פעמי)</h3>
              <p className="mb-1 text-3xl font-bold text-blue-700">
                מ-2,500 ₪ <span className="text-base font-medium text-gray-600">+ מע״מ</span>
              </p>
              <p className="mb-4 text-gray-600">
                תביעה, אימות, בניית פרופיל, חיבור פיד אם זמין והגדרת גישה ל-Insights.
              </p>
              <ul className="flex-1 space-y-3">
                {['בדיקת זכאות וליווי אימות Persona', 'כתיבה ועדכון פרטי הפרופיל'].map((line) => (
                  <li key={line} className="flex items-start gap-3">
                    <FaCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" aria-hidden />
                    <span className="text-gray-700">{line}</span>
                  </li>
                ))}
              </ul>
            </article>
            <article className="flex h-full flex-col rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
              <h3 className="mb-2 text-2xl font-bold text-gray-900">ניהול שוטף</h3>
              <p className="mb-1 text-3xl font-bold text-blue-700">
                250 ₪ לחודש <span className="text-base font-medium text-gray-600">+ מע״מ</span>
              </p>
              <p className="mb-4 text-gray-600">מעקב Insights, עדכוני פרטים בפרופיל ודוח תקופתי.</p>
              <ul className="flex-1 space-y-3">
                {['אופציונלי — לא חובה עם ההקמה', 'ניתן לשלב עם קידום במנועי AI'].map((line) => (
                  <li key={line} className="flex items-start gap-3">
                    <FaCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" aria-hidden />
                    <span className="text-gray-700">{line}</span>
                  </li>
                ))}
              </ul>
            </article>
          </div>
          <p className="mt-8 text-center text-gray-700">
            פירוט נוסף ב
            <Link href="/pricing" className="text-blue-700 underline">
              מחירון
            </Link>
            . מודעות ב-ChatGPT — מוצר נפרד; ראו{' '}
            <Link href="/services/ppc" className="text-blue-700 underline">
              קמפיינים ממומנים
            </Link>
            .
          </p>
        </div>
      </section>

      <ChatGptBusinessHubFaq />

      <ServiceCtaBanner serviceKey="chatgpt-business-hub" />
    </div>
  );
}
