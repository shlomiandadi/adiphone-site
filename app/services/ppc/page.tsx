import Link from 'next/link';
import { getSiteUrl, organizationLogo } from '../../../lib/seo';
import { getPublishedPortfolioProjects } from '../../../lib/website-projects';
import Hero3D from '../../components/hero3d/Hero3D';
import ServiceCtaBanner from '../../components/ServiceCtaBanner';

const PHONE_DISPLAY = '050-9159951';
const PHONE_TEL = '+972509159951';

const INCLUDED = [
  {
    title: 'קמפיינים בגוגל (Google Ads)',
    description: 'מודעות חיפוש שמופיעות ללקוחות בדיוק כשהם מחפשים את השירות או המוצר שלכם.',
  },
  {
    title: 'קמפיינים בפייסבוק ובאינסטגרם',
    description: 'מודעות ממוקדות בפייסבוק ובאינסטגרם לפי קהל, תחומי עניין ומיקום.',
  },
  {
    title: 'דפי נחיתה ומסרים שמביאים פניות',
    description: 'התאמת המסר ועמוד היעד כדי שהתקציב יתורגם לפניות ולא רק לקליקים.',
  },
  {
    title: 'רימרקטינג לגולשים שכבר ביקרו',
    description: 'חזרה לגולשים שכבר ביקרו באתר אך טרם השאירו פנייה.',
  },
  {
    title: 'מעקב המרות: שיחות, טפסים ורכישות',
    description: 'הגדרת מעקב אחר שיחות, טפסים ורכישות, כדי לדעת מאיפה מגיעות התוצאות.',
  },
  {
    title: 'אופטימיזציה שוטפת לעלות לפנייה',
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
  {
    question: 'כמה עולה ניהול קמפיינים ממומנים?',
    answer:
      'העלות מורכבת משני חלקים נפרדים: תקציב הפרסום שמשולם ישירות לגוגל או למטא, ודמי ניהול נפרדים על העבודה השוטפת. גובה דמי הניהול תלוי במספר הפלטפורמות, בהיקף תקציב הפרסום, במספר הקמפיינים, בהפקת קריאייטיב ובתדירות הדיווח. אין במחירון מחיר קבוע לניהול קמפיין – נשמח להציע הצעת מחיר אחרי שיחה קצרה.',
  },
  {
    question: 'איך לבחור חברה לקידום ממומן?',
    answer:
      'בדקו שהחשבונות נשארים בבעלות העסק, שהדיווח שקוף, שאין חוזה נעילה ארוך, שיש מעקב המרות אמיתי, שיש ניסיון בתחום שלכם, ומי בפועל מנהל את החשבון. ב-Top Webstak, שם מסחרי של עדי פון תקשורת, אלה התנאים שאנחנו עובדים לפיהם.',
  },
  {
    question: 'למי שייך חשבון הפרסום?',
    answer:
      'חשבון Google Ads וחשבון מטא צריכים להיות בבעלות העסק. אנחנו מקבלים הרשאת ניהול ומנהלים את הקמפיינים משם. כך הנתונים, ההיסטוריה והנכסים נשארים אצלכם גם אם תחליטו לנהל את החשבון בעצמכם בהמשך.',
  },
];

export default async function PpcServicePage() {
  const projects = await getPublishedPortfolioProjects('seo', 1);
  const projectImage = projects.find((project) => project.image && !project.image.endsWith('.svg'))?.image;
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
        theme="ppc"
        title="קידום ממומן (PPC)"
        subtitle="ניהול קמפיינים ממומנים בגוגל ובמדיה החברתית – תנועה מהירה, ממוקדת ומדידה של לקוחות שמחפשים אתכם עכשיו."
        align="center"
        ctas={[
          { href: `tel:${PHONE_TEL}`, label: `חייגו: ${PHONE_DISPLAY}` },
          { href: '/contact', label: 'לייעוץ והצעת מחיר', variant: 'secondary' },
        ]}
      />

      {/* Intro */}
      <section data-reveal className="px-4 py-16">
        <div className="container mx-auto max-w-3xl text-right">
          <div className="rounded-xl border-r-4 border-orange-500 bg-orange-50 p-6">
            <h2 className="mb-3 text-2xl font-bold text-gray-900">מה זה קידום ממומן (PPC) ואיך הוא עובד?</h2>
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
      <section data-reveal className="bg-gray-50 px-4 py-16">
        <div className="container mx-auto max-w-5xl">
          <h2 className="mb-10 text-center text-3xl font-bold text-gray-900">מה כולל ניהול קמפיין ממומן אצלנו</h2>
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
      <section data-reveal className="bg-gray-50 px-4 py-16">
        <div className="container mx-auto max-w-5xl">
          <h2 className="mb-10 text-center text-3xl font-bold text-gray-900">תהליך העבודה: מאפיון ועד אופטימיזציה</h2>
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
      <section data-reveal className="px-4 py-16">
        <div className="container mx-auto max-w-3xl text-right">
          <h2 className="mb-4 text-3xl font-bold text-gray-900">איך מודדים תוצאות: לידים, CPL ו-ROAS</h2>
          <p className="text-lg leading-relaxed text-gray-700">
            אנחנו מגדירים מעקב המרות אמיתי (שיחות, טפסים ורכישות) ומודדים את העלות לכל פנייה
            (CPL) ואת תשואת הפרסום (ROAS) בחנויות. המטרה היא לא רק קליקים, אלא פניות ומכירות
            במחיר שמשתלם לעסק – עם דיווח שקוף על הביצועים ועל השינויים שאנחנו מבצעים.
          </p>
        </div>
      </section>

      {/* Pricing model */}
      <section data-reveal className="bg-gray-50 px-4 py-16">
        <div className="container mx-auto max-w-3xl text-right">
          <h2 className="mb-4 text-3xl font-bold text-gray-900">כמה עולה ניהול קמפיינים?</h2>
          <p className="text-lg leading-relaxed text-gray-700">
            ניהול קמפיין ממומן מורכב משני תשלומים שונים, וחשוב להפריד ביניהם מראש: תקציב
            הפרסום משולם ישירות לגוגל או למטא עבור החשיפות והקליקים, ודמי הניהול משולמים
            בנפרד על האפיון, ההקמה, המעקב והאופטימיזציה השוטפת. בהצעת המחיר נפרט כל חלק
            בנפרד, כדי שיהיה ברור מה הולך לפלטפורמה ומה לעבודה.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-gray-700">
            אין במחירון שלנו מחיר קבוע לניהול קמפיינים, כי ההיקף משתנה מעסק לעסק. מה שכן
            משפיע על הצעת המחיר: כמה פלטפורמות מנהלים (גוגל, פייסבוק, אינסטגרם), מה רמת
            תקציב הפרסום שאתם מתכננים, כמה קמפיינים פעילים במקביל, האם נדרשת הפקת קריאייטיב
            (מודעות, וידאו, דפי נחיתה), ומה תדירות הדיווח שאתם צריכים.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-gray-700">
            אם לקמפיין חסר עמוד יעד ברור, אפשר להתחיל מדף נחיתה או מאתר קיים – המחירים
            המאושרים לבניית אתרים מופיעים ב
            <Link href="/pricing" className="text-orange-600 underline">
              מחירון בניית אתרים
            </Link>
            , ופירוט העבודה ב
            <Link href="/services/web-development" className="text-orange-600 underline">
              בניית אתרים
            </Link>
            . להצעת מחיר לניהול הקמפיין עצמו, פנו אלינו דרך{' '}
            <Link href="/contact" className="text-orange-600 underline">
              עמוד יצירת הקשר
            </Link>
            {' '}או חייגו {PHONE_DISPLAY}.
          </p>
        </div>
      </section>

      {/* How to choose a paid-ads company */}
      <section data-reveal className="px-4 py-16">
        <div className="container mx-auto max-w-3xl text-right">
          <h2 className="mb-4 text-3xl font-bold text-gray-900">איך לבחור חברה לקידום ממומן?</h2>
          <p className="text-lg leading-relaxed text-gray-700">
            חיפוש &quot;חברה לקידום ממומן&quot; מחזיר הרבה הבטחות דומות. ב-Top Webstak, שם
            מסחרי של עדי פון תקשורת, אנחנו מעדיפים רשימת בדיקה פשוטה שאפשר לבקש מכל ספק –
            כולל מאיתנו – לפני שחותמים:
          </p>
          <ul className="mt-6 list-disc space-y-3 pr-6 text-lg text-gray-700">
            <li>
              <strong>בעלות על חשבונות הפרסום:</strong> חשבון Google Ads וחשבון מטא נפתחים
              או נשארים על שם העסק. אנחנו מקבלים הרשאת ניהול, לא לוקחים את הנכס.
            </li>
            <li>
              <strong>דיווח שקוף:</strong> אתם רואים הוצאה, קליקים, פניות ועלות לפנייה – לא
              רק צילום מסך חלקי בסוף החודש.
            </li>
            <li>
              <strong>בלי חוזה נעילה ארוך:</strong> התקשרות שניתן לעצור או לשנות לפי התוצאות,
              בלי קנס על עזיבה אחרי כמה חודשים.
            </li>
            <li>
              <strong>מעקב המרות אמיתי:</strong> שיחות, טפסים ורכישות מוגדרים לפני שמגדילים
              תקציב. בלי מדידה אי אפשר לדעת אם הקמפיין עובד.
            </li>
            <li>
              <strong>ניסיון בתחום של הלקוח:</strong> חשוב להבין את מחזור המכירה, את השפה
              ואת המתחרים – לא רק &quot;ללחוץ על כפתור בגוגל&quot;.
            </li>
            <li>
              <strong>מי מנהל בפועל:</strong> שאלו מי יושב על החשבון ביום-יום, ולא רק מי
              חתם על ההצעה. אצלנו הניהול נשאר אצל הצוות שמכיר את העסק.
            </li>
          </ul>
          <p className="mt-6 text-lg leading-relaxed text-gray-700">
            אם אתם מחפשים חברה לקידום ממומן שגם יודעת לבנות את עמוד היעד, אפשר לשלב את
            הקמפיין עם{' '}
            <Link href="/services/web-development" className="text-orange-600 underline">
              בניית אתרים
            </Link>
            . לשאלות או להצעת מחיר:{' '}
            <Link href="/contact" className="text-orange-600 underline">
              צרו קשר
            </Link>
            .
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
          <Link href="/services/seo" className="underline">קידום אורגני (SEO)</Link> ·{' '}
          <Link href="/services/aeo-geo" className="underline">קידום במנועי AI (AEO/GEO)</Link> ·{' '}
          <Link href="/services/web-development" className="underline">בניית אתרים</Link> ·{' '}
          <Link href="/pricing" className="underline">מחירון</Link> ·{' '}
          <Link href="/contact" className="underline">צור קשר</Link>
        </p>
      </section>
      <ServiceCtaBanner serviceKey="ppc" image={projectImage} imageAlt="פרויקט קידום ממומן" />
    </div>
  );
}
