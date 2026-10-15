import Image from 'next/image';
import Link from 'next/link';
import { getWebsitePortfolioProjects } from '../../../lib/website-projects';
import { buildServiceJsonLd } from '../../../lib/service-schema';
import Hero3D from '../../components/hero3d/Hero3D';
import ServiceCtaBanner from '../../components/ServiceCtaBanner';

const FAQ = [
  {
    question: 'מה זה אתר תדמית?',
    answer:
      'אתר תדמית הוא אתר שמציג את העסק: מי אתם, מה אתם עושים, למי זה מתאים ואיך יוצרים קשר. אין בו חנות ומלאי. המטרה היא שגולש שמגיע מהחיפוש או מוואטסאפ יבין תוך דקה אם כדאי לו לפנות.',
  },
  {
    question: 'מה ההבדל בין בניית אתר תדמית לדף נחיתה?',
    answer:
      'דף נחיתה הוא עמוד אחד לקמפיין או לשירות בודד. אתר תדמית כולל כמה עמודים – בית, שירותים, אודות ויצירת קשר – כדי לכסות את העסק כולו. אם יש לכם יותר משירות אחד, אתר תדמית בדרך כלל מתאים יותר.',
  },
  {
    question: 'תוך כמה זמן אתר תדמית מוכן?',
    answer:
      'אתר תדמית ממוקד, כשהטקסטים והתמונות מוכנים, מתקדם אצלנו לרוב תוך 14–21 יום. אם חסר תוכן, או שצריך כמה סבבי עיצוב, לוח הזמנים מתארך. את המספר המדויק נסגור אחרי שיחת האפיון, לא לפני.',
  },
  {
    question: 'כמה עולה בניית אתר תדמית?',
    answer:
      'המחירון המפורסם שלנו מתחיל ב-6,500 ₪ לאתר תדמית של עד 6–8 עמודים. זה מחיר פתיחה, לא הצעה סגורה. כתיבת תוכן, אחסון ותחזוקה מפורטים בנפרד במדריך העלות ל-2026 ובמחירון.',
  },
  {
    question: 'האם אוכל לעדכן את האתר לבד?',
    answer:
      'כן. באתר תדמית אנחנו משאירים מערכת ניהול, לרוב וורדפרס, ומדריכים אתכם לעדכן טקסטים ותמונות. שינוי מבנה או עיצוב אפשר להשאיר לנו.',
  },
  {
    question: 'האם אתר תדמית מספיק לקידום בגוגל?',
    answer:
      'הוא הבסיס: מבנה ברור, מהירות והתאמה לנייד. קידום אורגני שוטף – מחקר ביטויים, תוכן וקישורים – הוא שירות נפרד. בלי אתר מסודר קשה לקדם, אבל האתר לבדו לא מבטיח דירוג.',
  },
];

export default async function WebsiteTadmitPage() {
  const projects = await getWebsitePortfolioProjects();
  const examples = projects.filter((project) => project.slug && project.name).slice(0, 3);
  const projectImage = examples.find((project) => project.image && !project.image.endsWith('.svg'))?.image;

  const serviceSchema = buildServiceJsonLd({
    name: 'אתרי תדמית לעסקים',
    description:
      'אתרי תדמית לעסקים: מחירים, תהליך העבודה ודוגמאות. אתר שמציג את השירותים, מייצר פניות, ומותאם לנייד.',
    path: '/services/website-tadmit',
  });

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
    <div className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <Hero3D
        theme="web-development"
        title="אתרי תדמית לעסקים"
        subtitle="אתר שמסביר את העסק, נראה מקצועי בטלפון, ומביא פנייה – בלי חנות ובלי מערכת מיותרת."
        ctas={[
          { href: '/contact#contact-form', label: 'שיחת ייעוץ של 15 דקות' },
          { href: '/services/web-development', label: 'לכל סוגי בניית האתרים', variant: 'secondary' },
        ]}
      />

      <article className="container mx-auto max-w-3xl px-4 py-16 text-right text-lg leading-relaxed text-gray-700">
        <p className="mb-8 text-xl font-semibold text-gray-900">
          <Link href="/services/web-development" className="text-blue-700 underline">
            בניית אתר תדמית
          </Link>
          {' '}נמצאת בעמוד בניית האתרים, עם התהליך, מה כלול באתר והקישור למדריך העלות.
        </p>
        <p className="mb-5">
          בניית אתר תדמית היא העבודה הנפוצה ביותר שאנחנו עושים לעסקים קטנים ובינוניים. לא חנות, לא אפליקציה ולא מערכת הזמנות. אתר שמחליף את הכרטיס ביקור, את מצגת השירות ואת התשובה החוזרת בוואטסאפ: מי אתם, מה אתם מציעים, למי זה מתאים, ואיך מתקדמים לשיחה.
        </p>
        <p className="mb-5">
          העמוד הזה עוסק רק בזה. אם אתם צריכים גם קטלוג, חנות או מערכת Web, עברו לעמוד{' '}
          <Link href="/services/web-development" className="font-semibold text-blue-700 underline">
            בניית אתרים
          </Link>
          . כאן נשארים בבניית אתרי תדמית: המבנה, מה כלול, לוח הזמנים, וההבדל מול דף נחיתה או חנות.
        </p>
        <p className="mb-5">
          Top Webstak, מבית עדי פון תקשורת, יושבת בזמיר 95 בפרדס חנה-כרכור ובונה אתרים לעסקים מהאזור ומכל הארץ. אתר תדמית ממוקד, כשהתכנים מוכנים, מתקדם אצלנו לרוב תוך 14–21 יום. שיחת הייעוץ הראשונה אורכת 15 דקות, בלי התחייבות.
        </p>

        <h2 className="mb-4 mt-12 text-3xl font-bold text-gray-900">מהו אתר תדמית, ומה הוא לא</h2>
        <p className="mb-5">
          אתר תדמית הוא חלון הראווה הדיגיטלי של העסק. גולש שנכנס אליו צריך להבין בתוך דקה אם הוא במקום הנכון. לכן האתר בנוי מעמודים קצרים וברורים, לא ממאגר מאמרים ולא מקטלוג מוצרים. עמוד הבית אומר מה אתם עושים. עמוד השירותים מפרט. עמוד האודות מסביר מי עומד מאחורי העסק. עמוד יצירת הקשר נותן טלפון, וואטסאפ וטופס קצר.
        </p>
        <p className="mb-5">
          זה לא דף נחיתה. דף נחיתה הוא עמוד אחד שמכוון לפעולה אחת, בדרך כלל לקמפיין ממומן. בניית אתר תדמית מתאימה כשיש כמה שירותים, קהל שבודק אתכם לפני שהוא מתקשר, ורצון שגוגל יוכל להציג עמוד נפרד לכל נושא. זה גם לא חנות. אין עגלה, אין מלאי ואין סליקה. אם המכירה עצמה צריכה לקרות באתר, השירות הנכון הוא{' '}
          <Link href="/services/ecommerce" className="font-semibold text-blue-700 underline">
            חנות אונליין
          </Link>
          .
        </p>
        <p className="mb-5">
          וזה לא אתר שנבנה &quot;על הדרך&quot; מתוך תבנית עמוסה. תבנית מוכנה מגיעה עם עשרות בלוקים שלא תשתמשו בהם, טעינה איטית בטלפון, ועיצוב שנראה כמו אתר של מישהו אחר. בבניית אתרי תדמית אנחנו מתחילים מהמסר של העסק, לא מהתבנית.
        </p>

        <h2 className="mb-4 mt-12 text-3xl font-bold text-gray-900">למי מתאים אתר תדמית</h2>
        <p className="mb-5">
          בעלי מקצוע, קליניקות, משרדים, יועצים, מסעדות שרוצות תפריט ודרך להגיע, וחברות שירות שמוכרות בשיחה ולא בקופה. אם הלקוח שלכם מחפש בגוגל, נכנס לאתר מהטלפון, ואז שולח וואטסאפ – אתר תדמית הוא הכלי. אם אתם מוכרים עשרות מוצרים עם משלוח, זה כבר לא העמוד הזה.
        </p>
        <p className="mb-5">
          עסק מקומי צריך גם שם של עיר ואזור שירות בעמודים, לא רק בכותרת. מי שמחפש שיפוצניק, קליניקה או משרד בודק קודם אם אתם קרובים. לכן אנחנו מחברים את אתר התדמית גם לעמודי{' '}
          <Link href="/services/bniyat-atarim-pardes-hana" className="font-semibold text-blue-700 underline">
            בניית אתרים לפי אזור
          </Link>
          , כשהעסק משרת עיר מסוימת.
        </p>
        <ul className="mb-5 list-disc space-y-2 pr-6">
          <li>קליניקה או מטפל: שירותים, למי זה מתאים, ואיך קובעים תור.</li>
          <li>בעל מקצוע: אזור עבודה, סוגי עבודות, ודרך לשלוח תמונה או בקשה.</li>
          <li>משרד או יועץ: הסבר בשפה פשוטה, בלי מצגת של עשרים שקפים.</li>
          <li>עסק עם כמה סניפים או אזורי שירות: עמוד שמבהיר איפה אתם עובדים.</li>
        </ul>

        <h2 className="mb-4 mt-12 text-3xl font-bold text-gray-900">מה כלול בבניית אתר תדמית</h2>
        <p className="mb-5">
          ההיקף הרגיל הוא עד 6–8 עמודים. זה המספר שמופיע גם ב{' '}
          <Link href="/blog/kama-oleh-bniyat-atar-2026" className="font-semibold text-blue-700 underline">
            מדריך כמה עולה בניית אתר ב-2026
          </Link>{' '}
          וב{' '}
          <Link href="/pricing" className="font-semibold text-blue-700 underline">
            מחירון
          </Link>
          . מעבר לזה זו הרחבה, לא הפתעה באמצע הפרויקט.
        </p>
        <ul className="mb-5 list-disc space-y-3 pr-6">
          <li>
            <strong>אפיון קצר.</strong> מי הלקוח, מה השאלה שהוא מביא לאתר, ואיזה עמוד עונה עליה. בלי מסמך של שלושים עמודים לעסק של ארבעה שירותים.
          </li>
          <li>
            <strong>מבנה עמודים.</strong> בית, שירותים, אודות, יצירת קשר, ולפעמים עמוד פרויקטים או שאלות נפוצות. כל עמוד עם כותרת אחת ותפקיד אחד.
          </li>
          <li>
            <strong>עיצוב לטלפון קודם.</strong> רוב הגולשים מגיעים מהנייד. הכפתור של הטלפון או הוואטסאפ נשאר נגיש, הטקסט נקרא בלי לצבוט את המסך, והתמונות לא דוחפות את התוכן למטה.
          </li>
          <li>
            <strong>טקסטים.</strong> אם יש לכם טקסט מוכן, נערוך אותו לאתר. אם אין, כתיבה היא תוספת לפי המחירון, לא משהו שאנחנו ממציאים בלי לשאול.
          </li>
          <li>
            <strong>תשתית טכנית.</strong> אתר מהיר, תעודת SSL, ומערכת ניהול שתוכלו לגעת בה. לרוב זה{' '}
            <Link href="/services/wordpress" className="font-semibold text-blue-700 underline">
              וורדפרס
            </Link>{' '}
            בלי תבנית כבדה.
          </li>
          <li>
            <strong>בסיס לגוגל.</strong> כותרות, תיאור, כתובת קנונית ומבנה שהקידום האורגני יכול להמשיך ממנו. הקידום עצמו יושב בעמוד{' '}
            <Link href="/services/seo" className="font-semibold text-blue-700 underline">
              קידום אתרים
            </Link>
            .
          </li>
          <li>
            <strong>הדרכה קצרה.</strong> איך מחליפים טלפון, שעות, או תמונה, בלי לפתוח קריאה על כל פסיק.
          </li>
        </ul>

        <h2 className="mb-4 mt-12 text-3xl font-bold text-gray-900">איך התהליך עובד</h2>
        <p className="mb-5">
          מתחילים בשיחה של 15 דקות. בשיחה אנחנו בודקים אם באמת צריך אתר תדמית, או שמספיק דף נחיתה, או שדווקא צריך חנות. אם אתר תדמית הוא הכיוון, נשלח מבנה עמודים והצעה. אין התחייבות לפני שאישרתם.
        </p>
        <ol className="mb-5 list-decimal space-y-3 pr-6">
          <li>
            <strong>אפיון.</strong> שירותים, קהל, מתחרים שאתם רוצים להיראות אחרת מהם, ומה נחשב פנייה מוצלחת: שיחה, וואטסאפ או טופס.
          </li>
          <li>
            <strong>מבנה ותוכן.</strong> מפת עמודים וטיוטת מסרים. כאן מתברר אם חסר צילום, לוגו או ניסוח. עדיף לגלות את זה לפני העיצוב.
          </li>
          <li>
            <strong>עיצוב.</strong> מראה שמתאים לעסק, לא לתיק העבודות שלנו. אתם מאשרים כיוון לפני שבונים את כל העמודים.
          </li>
          <li>
            <strong>בנייה.</strong> הקמת האתר, טפסים, חיבור לוואטסאפ, והתאמה לנייד. זה השלב שבו 14–21 הימים רלוונטיים, כשהחומרים כבר אצלנו.
          </li>
          <li>
            <strong>בדיקה והעלאה.</strong> בדיקה בטלפון ובדפדפן, תיקון הערות, והעלאה לאוויר. אתם מקבלים גישה למערכת הניהול.
          </li>
          <li>
            <strong>ליווי אחרי ההשקה.</strong> תיקונים קטנים מההדרכה, ואחר כך תחזוקה רק אם בחרתם בה. היא לא חובה בתוך מחיר האתר.
          </li>
        </ol>

        <h2 className="mb-4 mt-12 text-3xl font-bold text-gray-900">בניית אתר תדמית מול אפשרויות אחרות</h2>
        <p className="mb-5">
          בניית אתרי תדמית היא חלק מ{' '}
          <Link href="/services/web-development" className="font-semibold text-blue-700 underline">
            בניית אתרים
          </Link>
          , לא תחליף לה. בעמוד הכללי תמצאו גם קטלוג, פורטל ומערכת. כאן ההחלטה פשוטה יותר: אם המטרה היא שיבינו את העסק ויתקשרו, אתר תדמית מספיק. אם המטרה היא למכור באתר, לעדכן מאות מוצרים, או לנהל תהליך פנימי – נגיד את זה בשיחה ולא נמתח אתר תדמית מעבר למה שהוא.
        </p>
        <p className="mb-5">
          עיצוב הממשק יושב אצלנו בתוך הפרויקט, ואפשר גם להעמיק אותו כשירות{' '}
          <Link href="/services/ui-design" className="font-semibold text-blue-700 underline">
            עיצוב UI/UX
          </Link>{' '}
          כשהמותג צריך שפה משלו. מהירות ואחסון נשענים על תשתית יציבה, לא על אחסון חינם שנרדם בשעות העומס.
        </p>
        <p className="mb-5">
          אנחנו לא מבטיחים &quot;עמוד ראשון בגוגל&quot; בגלל שהאתר יפה. אתר תדמית טוב נותן לגוגל עמודים ברורים ולגולש סיבה להישאר. דירוג לוקח עבודה מתמשכת, תוכן ותחרות. מי שמבטיח מקום בגוגל לפני שראה את התחום, מוכר סיפור.
        </p>

        <h2 className="mb-4 mt-12 text-3xl font-bold text-gray-900">אחרי שהאתר באוויר</h2>
        <p className="mb-5">
          אתר תדמית שלא מתעדכן מתחיל להיראות ישן: טלפון שהתחלף, שירות שהפסקתם, תמונה מלפני חמש שנים. לכן אנחנו משאירים לכם דרך לערוך לבד את מה שמשתנה כל חודש. שינוי עיצובי, עמוד חדש או חיבור לכלי מדידה אפשר לעשות איתנו אחר כך.
        </p>
        <p className="mb-5">
          אם תרצו לדעת מה הגולשים עושים באתר, מחברים{' '}
          <Link href="/services/analytics" className="font-semibold text-blue-700 underline">
            אנליטיקס
          </Link>{' '}
          לפניות אמיתיות: שיחה, וואטסאפ או שליחת טופס. לא דשבורד יפה בלי מספר שקשור לעסק.
        </p>
        <p className="mb-5">
          מוכנים לבדוק אם אתר תדמית הוא מה שצריך? השאירו פרטים או התקשרו ל-050-9159951. בשיחה של 15 דקות נגיד אם זה הכיוון, מה חסר בתוכן, ומה מחיר הפתיחה אומר במקרה שלכם. בלי התחייבות, ובלי מספרים שלא בדקנו.
        </p>

        <h2 className="mb-4 mt-12 text-3xl font-bold text-gray-900">מה כדאי להכין לפני השיחה</h2>
        <p className="mb-5">
          לא צריך מצגת. מספיק רשימת שירותים, אזור העבודה, וקישור לאתר הישן אם יש. אם יש לוגו וחמש תמונות אמיתיות מהעבודה, האפיון קצר יותר. אם אין תמונות, נגיד את זה מראש ולא נמלא את האתר בתמונות גנריות שנראות כמו כל אתר אחר.
        </p>
        <p className="mb-5">
          כדאי גם להחליט מי מאשר טקסט ועיצוב. פרויקט שעובר בין שלושה אנשים בלי בעל החלטה נתקע, גם כשהבנייה עצמה פשוטה. בשיחה נשאל מי נמצא על הוואטסאפ ומי חותם על המבנה. ככה 14–21 הימים נשארים לוח זמנים, לא משאלה.
        </p>
      </article>

      {examples.length > 0 && (
        <section className="bg-gray-50 px-4 py-16">
          <div className="container mx-auto max-w-5xl">
            <h2 className="mb-8 text-center text-3xl font-bold text-gray-900">דוגמאות מהתיק</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {examples.map((project) => (
                <Link
                  key={project.slug}
                  href={`/portfolio/${project.slug}`}
                  className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 transition hover:-translate-y-0.5"
                >
                  {project.image ? (
                    <div className="relative h-44 w-full">
                      <Image src={project.image} alt={project.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 320px" />
                    </div>
                  ) : null}
                  <div className="p-5 text-right">
                    <h3 className="text-xl font-bold text-gray-900">{project.name}</h3>
                    {project.description ? (
                      <p className="mt-2 text-gray-600">{project.description}</p>
                    ) : null}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="px-4 py-16">
        <div className="container mx-auto max-w-3xl">
          <h2 className="mb-8 text-center text-3xl font-bold text-gray-900">שאלות נפוצות על בניית אתר תדמית</h2>
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

      <ServiceCtaBanner
        serviceKey="website-tadmit"
        image={projectImage}
        imageAlt="דוגמה לאתר תדמית מהתיק"
      />
    </div>
  );
}
