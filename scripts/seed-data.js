const { PrismaClient } = require('@prisma/client');
const { hash } = require('bcryptjs');

const prisma = new PrismaClient();

async function seedData() {
  try {
    console.log('מתחיל יצירת נתונים...');

    // יצירת קטגוריות
    const categories = [
      { name: 'פיתוח אתרים', slug: 'web-development', description: 'פיתוח אתרים מתקדמים', color: '#3B82F6' },
      { name: 'SEO', slug: 'seo', description: 'אופטימיזציה למנועי חיפוש', color: '#10B981' },
      { name: 'שיווק דיגיטלי', slug: 'digital-marketing', description: 'שיווק דיגיטלי מתקדם', color: '#F59E0B' },
      { name: 'עיצוב', slug: 'design', description: 'עיצוב ממשקי משתמש', color: '#8B5CF6' },
      { name: 'אפליקציות', slug: 'apps', description: 'פיתוח אפליקציות', color: '#EF4444' }
    ];

    for (const category of categories) {
      await prisma.category.upsert({
        where: { slug: category.slug },
        update: {},
        create: category
      });
    }
    console.log('✅ קטגוריות נוצרו');

    // יצירת תגיות
    const tags = [
      { name: 'Next.js', slug: 'nextjs' },
      { name: 'React', slug: 'react' },
      { name: 'TypeScript', slug: 'typescript' },
      { name: 'Tailwind CSS', slug: 'tailwind-css' },
      { name: 'SEO', slug: 'seo' },
      { name: 'Google Ads', slug: 'google-ads' },
      { name: 'UI/UX', slug: 'ui-ux' },
      { name: 'Mobile Apps', slug: 'mobile-apps' }
    ];

    for (const tag of tags) {
      await prisma.tag.upsert({
        where: { slug: tag.slug },
        update: {},
        create: tag
      });
    }
    console.log('✅ תגיות נוצרו');

    // יצירת פוסטים
    const posts = [
      {
        title: 'מדריך מקיף ל-Next.js 14',
        slug: 'nextjs-14-guide',
        excerpt: 'למדו איך לבנות אפליקציות ווב מתקדמות עם Next.js 14',
        content: `
          <h1>מדריך מקיף ל-Next.js 14</h1>
          <img src="/images/blog/nextjs-guide.jpg" alt="Next.js 14 Guide" />
          <p>Next.js 14 הוא הגרסה החדשה והמתקדמת ביותר של המסגרת הפופולרית לבניית אפליקציות React. בגרסה זו נוספו תכונות חדשות ומרשימות שמשפרות משמעותית את הביצועים והחוויה של המפתחים.</p>
          
          <h2>תכונות חדשות ב-Next.js 14</h2>
          <ul>
            <li>Server Components מתקדמים</li>
            <li>App Router משופר</li>
            <li>ביצועים משופרים</li>
            <li>TypeScript מובנה</li>
          </ul>
          
          <h2>איך להתחיל</h2>
          <p>התקנת Next.js 14 היא פשוטה מאוד:</p>
          <pre><code>npx create-next-app@latest my-app</code></pre>
          
          <p>במאמר זה נלמד על כל התכונות החדשות ואיך להשתמש בהן בצורה הטובה ביותר.</p>
        `,
        mainImage: '/images/blog/nextjs-guide.jpg',
        category: 'פיתוח אתרים',
        tags: ['Next.js', 'React', 'TypeScript'],
        published: true,
        authorName: 'מנהל האתר',
        authorEmail: 'admin@example.com',
        metaTitle: 'מדריך מקיף ל-Next.js 14 - כל מה שצריך לדעת',
        metaDesc: 'למדו איך לבנות אפליקציות ווב מתקדמות עם Next.js 14. מדריך מקיף עם דוגמאות קוד ותכונות חדשות.'
      },
      {
        title: 'טיפים מתקדמים ל-SEO',
        slug: 'advanced-seo-tips',
        excerpt: 'טיפים מתקדמים לשיפור הדירוג במנועי החיפוש',
        content: `
          <h1>טיפים מתקדמים ל-SEO</h1>
          <img src="/images/blog/seo-guide.jpg" alt="Advanced SEO Tips" />
          <p>SEO (Search Engine Optimization) הוא אחד התחומים החשובים ביותר בשיווק דיגיטלי. במאמר זה נציג טיפים מתקדמים שיעזרו לכם לשפר את הדירוג של האתר שלכם במנועי החיפוש.</p>
          
          <h2>אופטימיזציה טכנית</h2>
          <p>אופטימיזציה טכנית היא הבסיס לכל אסטרטגיית SEO מוצלחת:</p>
          <ul>
            <li>מהירות טעינה מהירה</li>
            <li>עיצוב רספונסיבי</li>
            <li>מבנה URL ידידותי</li>
            <li>נתוני מבנה (Schema Markup)</li>
          </ul>
          
          <h2>תוכן איכותי</h2>
          <p>תוכן איכותי הוא המפתח להצלחה ב-SEO. וודאו שהתוכן שלכם:</p>
          <ul>
            <li>מענה על כוונת המשתמש</li>
            <li>מעודכן ורלוונטי</li>
            <li>כתוב בצורה ברורה ומעניינת</li>
            <li>מכיל מילות מפתח רלוונטיות</li>
          </ul>
        `,
        mainImage: '/images/blog/seo-guide.jpg',
        category: 'SEO',
        tags: ['SEO', 'Google Ads'],
        published: true,
        authorName: 'מנהל האתר',
        authorEmail: 'admin@example.com',
        metaTitle: 'טיפים מתקדמים ל-SEO - שיפור הדירוג במנועי חיפוש',
        metaDesc: 'טיפים מתקדמים לשיפור הדירוג במנועי החיפוש. אופטימיזציה טכנית, תוכן איכותי ואסטרטגיות מתקדמות.'
      },
      {
        title: 'פיתוח אפליקציות React Native',
        slug: 'react-native-development',
        excerpt: 'מדריך לפיתוח אפליקציות מובייל עם React Native',
        content: `
          <h1>פיתוח אפליקציות React Native</h1>
          <img src="/images/blog/react-native-guide.jpg" alt="React Native Development" />
          <p>React Native מאפשר לפתח אפליקציות מובייל native עבור iOS ו-Android באמצעות JavaScript ו-React. במאמר זה נלמד על היתרונות והאתגרים של פיתוח עם React Native.</p>
          
          <h2>יתרונות React Native</h2>
          <ul>
            <li>פיתוח מהיר יותר</li>
            <li>קוד משותף ל-iOS ו-Android</li>
            <li>ביצועים טובים</li>
            <li>קהילה גדולה ותמיכה</li>
          </ul>
          
          <h2>התחלה מהירה</h2>
          <p>להתחלת עבודה עם React Native:</p>
          <pre><code>npx react-native init MyApp</code></pre>
          
          <p>React Native הוא כלי מצוין לפיתוח אפליקציות מובייל, במיוחד עבור צוותים שכבר מכירים React.</p>
        `,
        mainImage: '/images/blog/react-native-guide.jpg',
        category: 'אפליקציות',
        tags: ['React', 'Mobile Apps', 'TypeScript'],
        published: true,
        authorName: 'מנהל האתר',
        authorEmail: 'admin@example.com',
        metaTitle: 'פיתוח אפליקציות React Native - מדריך מקיף',
        metaDesc: 'מדריך מקיף לפיתוח אפליקציות מובייל עם React Native. יתרונות, אתגרים ודוגמאות קוד.'
      }
    ];

    for (const post of posts) {
      await prisma.post.upsert({
        where: { slug: post.slug },
        update: {},
        create: post
      });
    }
    console.log('✅ פוסטים נוצרו');

    // יצירת פרויקטי פורטפוליו
    const portfolioProjects = [
      {
        id: '1',
        name: 'אתר איקומרס מתקדם',
        slug: 'advanced-ecommerce',
        image: '/images/portfolio/ecommerce.svg',
        images: [
          '/images/portfolio/ecommerce.svg',
          '/images/portfolio/ecommerce-desktop.jpg',
          '/images/portfolio/ecommerce-mobile.jpg'
        ],
        description: 'אתר איקומרס מתקדם עם מערכת ניהול מלאה',
        descriptionRich: 'פיתוח אתר איקומרס מתקדם עם מערכת ניהול מלאה, תשלומים מאובטחים וממשק משתמש מתקדם.',
        url: 'https://example-ecommerce.com',
        date: new Date('2024-01-15'),
        technologies: ['Next.js', 'React', 'TypeScript', 'Stripe', 'Prisma']
      },
      {
        id: '2',
        name: 'אפליקציית מובייל',
        slug: 'mobile-app',
        image: '/images/portfolio/mobile-app.jpg',
        images: [
          '/images/portfolio/mobile-app.jpg',
          '/images/portfolio/mobile-app-ios.jpg',
          '/images/portfolio/mobile-app-android.jpg'
        ],
        description: 'אפליקציית מובייל מתקדמת',
        descriptionRich: 'פיתוח אפליקציית מובייל מתקדמת עם React Native, כולל מערכת התראות, אימות משתמשים וממשק מתקדם.',
        url: 'https://example-app.com',
        date: new Date('2024-02-20'),
        technologies: ['React Native', 'TypeScript', 'Firebase', 'Redux']
      },
      {
        id: '3',
        name: 'אתר תאגידי',
        slug: 'corporate-website',
        image: '/images/portfolio/corporate.jpg',
        images: [
          '/images/portfolio/corporate.jpg',
          '/images/portfolio/corporate-desktop.jpg',
          '/images/portfolio/corporate-mobile.jpg'
        ],
        description: 'אתר תאגידי מקצועי',
        descriptionRich: 'עיצוב ופיתוח אתר תאגידי מקצועי עם מערכת ניהול תוכן מתקדמת ועיצוב רספונסיבי.',
        url: 'https://example-corporate.com',
        date: new Date('2024-03-10'),
        technologies: ['Next.js', 'Tailwind CSS', 'Sanity CMS', 'Vercel']
      }
    ];

    for (const project of portfolioProjects) {
      await prisma.portfolioProject2.upsert({
        where: { id: project.id },
        update: {},
        create: project
      });
    }
    console.log('✅ פרויקטי פורטפוליו נוצרו');

    console.log('🎉 כל הנתונים נוצרו בהצלחה!');

  } catch (error) {
    console.error('שגיאה ביצירת נתונים:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedData(); 