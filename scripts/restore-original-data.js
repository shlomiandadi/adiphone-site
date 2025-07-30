const { PrismaClient } = require('@prisma/client');
const { hash } = require('bcryptjs');

const prisma = new PrismaClient();

async function restoreOriginalData() {
  try {
    console.log('מתחיל שחזור הנתונים המקוריים...');

    // יצירת קטגוריות מקוריות
    const categories = [
      { name: 'SEO', slug: 'seo', description: 'אופטימיזציה למנועי חיפוש', color: '#10B981' },
      { name: 'WEB_DEVELOPMENT', slug: 'web-development', description: 'פיתוח אתרים', color: '#3B82F6' },
      { name: 'APP_DEVELOPMENT', slug: 'app-development', description: 'פיתוח אפליקציות', color: '#8B5CF6' },
      { name: 'DIGITAL_MARKETING', slug: 'digital-marketing', description: 'שיווק דיגיטלי', color: '#F59E0B' },
      { name: 'UI_UX', slug: 'ui-ux', description: 'עיצוב ממשקי משתמש', color: '#EF4444' },
      { name: 'ECOMMERCE', slug: 'ecommerce', description: 'חנויות אונליין', color: '#06B6D4' }
    ];

    for (const category of categories) {
      await prisma.category.upsert({
        where: { slug: category.slug },
        update: {},
        create: category
      });
    }
    console.log('✅ קטגוריות מקוריות נוצרו');

    // יצירת פוסטים מקוריים
    const originalPosts = [
      {
        title: 'Top Webstak - ישראל היום',
        slug: 'top-webstak-israel-hayom',
        excerpt: 'מאמר על Top Webstak בישראל היום',
        content: `
          <h1>Top Webstak - ישראל היום</h1>
          <img src="/images/blog/top-webstak-israel-hayom.jpg" alt="Top Webstak - ישראל היום" />
          <p>מאמר מקיף על Top Webstak שפורסם בישראל היום. המאמר מתאר את השירותים שלנו ואת ההצלחות שלנו בתחום בניית וקידום אתרים.</p>
          
          <h2>השירותים שלנו</h2>
          <ul>
            <li>בניית אתרים מתקדמים</li>
            <li>קידום אתרים מקצועי</li>
            <li>עיצוב ממשקי משתמש</li>
            <li>פיתוח אפליקציות</li>
          </ul>
          
          <p>Top Webstak היא חברה מובילה בתחום בנייה וקידום אתרים בישראל. אנו מספקים פתרונות מתקדמים לעסקים בכל הגדלים.</p>
        `,
        mainImage: '/images/blog/top-webstak-israel-hayom.jpg',
        category: 'SEO',
        tags: ['Top Webstak', 'ישראל היום', 'קידום אתרים', 'בניית אתרים'],
        published: true,
        authorName: 'מנהל האתר',
        authorEmail: 'admin@example.com',
        metaTitle: 'Top Webstak - ישראל היום - בנייה וקידום אתרים',
        metaDesc: 'מאמר על Top Webstak בישראל היום. שירותי בנייה וקידום אתרים מקצועיים.'
      },
      {
        title: 'מדריך מקיף ל-SEO',
        slug: 'seo-comprehensive-guide',
        excerpt: 'מדריך מקיף לאופטימיזציה למנועי חיפוש',
        content: `
          <h1>מדריך מקיף ל-SEO</h1>
          <img src="/images/blog/seo-guide.jpg" alt="מדריך מקיף ל-SEO" />
          <p>SEO (Search Engine Optimization) הוא אחד התחומים החשובים ביותר בשיווק דיגיטלי. במאמר זה נציג מדריך מקיף שיעזור לכם לשפר את הדירוג של האתר שלכם במנועי החיפוש.</p>
          
          <h2>יסודות ה-SEO</h2>
          <ul>
            <li>אופטימיזציה טכנית</li>
            <li>תוכן איכותי</li>
            <li>בניית קישורים</li>
            <li>ניסיון משתמש</li>
          </ul>
          
          <h2>טיפים מעשיים</h2>
          <p>הנה כמה טיפים מעשיים לשיפור ה-SEO של האתר שלכם:</p>
          <ul>
            <li>וודאו שהאתר מהיר</li>
            <li>כתבו תוכן איכותי ורלוונטי</li>
            <li>השתמשו במילות מפתח נכונות</li>
            <li>בנו קישורים איכותיים</li>
          </ul>
        `,
        mainImage: '/images/blog/seo-guide.jpg',
        category: 'SEO',
        tags: ['SEO', 'קידום אתרים', 'מנועי חיפוש', 'אופטימיזציה'],
        published: true,
        authorName: 'מנהל האתר',
        authorEmail: 'admin@example.com',
        metaTitle: 'מדריך מקיף ל-SEO - אופטימיזציה למנועי חיפוש',
        metaDesc: 'מדריך מקיף לאופטימיזציה למנועי חיפוש. טיפים מעשיים לשיפור הדירוג של האתר שלכם.'
      },
      {
        title: 'פיתוח אתרים מתקדמים',
        slug: 'advanced-web-development',
        excerpt: 'מדריך לפיתוח אתרים מתקדמים עם טכנולוגיות חדשות',
        content: `
          <h1>פיתוח אתרים מתקדמים</h1>
          <img src="/images/blog/web-development.jpg" alt="פיתוח אתרים מתקדמים" />
          <p>פיתוח אתרים מתקדמים דורש ידע בטכנולוגיות חדשות ומתקדמות. במאמר זה נציג את הטכנולוגיות החדישות ביותר בתחום פיתוח האתרים.</p>
          
          <h2>טכנולוגיות מתקדמות</h2>
          <ul>
            <li>Next.js 14</li>
            <li>React 18</li>
            <li>TypeScript</li>
            <li>Tailwind CSS</li>
          </ul>
          
          <h2>טרנדים חדשים</h2>
          <p>הטרנדים החדשים בפיתוח אתרים כוללים:</p>
          <ul>
            <li>Server Components</li>
            <li>Static Site Generation</li>
            <li>Progressive Web Apps</li>
            <li>Micro Frontends</li>
          </ul>
        `,
        mainImage: '/images/blog/web-development.jpg',
        category: 'WEB_DEVELOPMENT',
        tags: ['פיתוח אתרים', 'Next.js', 'React', 'TypeScript'],
        published: true,
        authorName: 'מנהל האתר',
        authorEmail: 'admin@example.com',
        metaTitle: 'פיתוח אתרים מתקדמים - טכנולוגיות חדשות',
        metaDesc: 'מדריך לפיתוח אתרים מתקדמים עם טכנולוגיות חדשות. Next.js, React, TypeScript ועוד.'
      },
      {
        title: 'פיתוח אפליקציות לנייד',
        slug: 'mobile-app-development',
        excerpt: 'מדריך מקיף לפיתוח אפליקציות לנייד',
        content: `
          <h1>פיתוח אפליקציות לנייד</h1>
          <img src="/images/blog/mobile-app.jpg" alt="פיתוח אפליקציות לנייד" />
          <p>פיתוח אפליקציות לנייד הוא אחד התחומים המתפתחים ביותר בעולם הטכנולוגיה. במאמר זה נציג מדריך מקיף לפיתוח אפליקציות לנייד.</p>
          
          <h2>פלטפורמות פיתוח</h2>
          <ul>
            <li>React Native</li>
            <li>Flutter</li>
            <li>Native iOS (Swift)</li>
            <li>Native Android (Kotlin)</li>
          </ul>
          
          <h2>יתרונות React Native</h2>
          <p>React Native מאפשר פיתוח מהיר וחסכוני:</p>
          <ul>
            <li>קוד אחד לשתי הפלטפורמות</li>
            <li>פיתוח מהיר</li>
            <li>קהילה גדולה</li>
            <li>ביצועים טובים</li>
          </ul>
          
          <h2>טיפים לפיתוח</h2>
          <p>הנה כמה טיפים חשובים לפיתוח אפליקציות לנייד:</p>
          <ul>
            <li>עיצוב רספונסיבי</li>
            <li>אופטימיזציה לביצועים</li>
            <li>בדיקות מקיפות</li>
            <li>עדכונים שוטפים</li>
          </ul>
        `,
        mainImage: '/images/blog/mobile-app.jpg',
        category: 'APP_DEVELOPMENT',
        tags: ['אפליקציות', 'React Native', 'Flutter', 'פיתוח מובייל'],
        published: true,
        authorName: 'מנהל האתר',
        authorEmail: 'admin@example.com',
        metaTitle: 'פיתוח אפליקציות לנייד - מדריך מקיף',
        metaDesc: 'מדריך מקיף לפיתוח אפליקציות לנייד. React Native, Flutter, טיפים וטריקים.'
      }
    ];

    for (const post of originalPosts) {
      // מציאת הקטגוריה
      const category = await prisma.category.findFirst({
        where: { slug: post.category.toLowerCase().replace('_', '-') }
      });

      // יצירת הפוסט
      await prisma.post.upsert({
        where: { slug: post.slug },
        update: {},
        create: {
          ...post,
          categoryId: category?.id
        }
      });
    }
    console.log('✅ פוסטים מקוריים נוצרו');

    // יצירת פרויקטי פורטפוליו מקוריים
    const originalPortfolioProjects = [
      {
        id: 'pinitzedek',
        name: 'פינט צדק',
        slug: 'pinitzedek',
        image: 'https://res.cloudinary.com/dooxg35gj/image/upload/v1753362055/portfolio/pinitzedek.jpg',
        images: [
          'https://res.cloudinary.com/dooxg35gj/image/upload/v1753362055/portfolio/pinitzedek.jpg',
          'https://res.cloudinary.com/dooxg35gj/image/upload/v1753362055/portfolio/pinitzedek-desktop.jpg',
          'https://res.cloudinary.com/dooxg35gj/image/upload/v1753362055/portfolio/pinitzedek-mobile.jpg'
        ],
        description: 'אתר פינט צדק - פיתוח אתר מתקדם',
        descriptionRich: 'פיתוח אתר מתקדם עבור פינט צדק. האתר כולל מערכת ניהול תוכן מתקדמת, עיצוב רספונסיבי וממשק משתמש מתקדם.',
        url: 'https://pinitzedek.co.il',
        date: new Date('2024-01-10'),
        technologies: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS']
      },
      {
        id: 'sentry-bridge-app',
        name: 'Sentry Bridge App',
        slug: 'sentry-bridge-app',
        image: 'https://res.cloudinary.com/dooxg35gj/image/upload/v1753362055/portfolio/sentry-bridge-app.jpg',
        images: [
          'https://res.cloudinary.com/dooxg35gj/image/upload/v1753362055/portfolio/sentry-bridge-app.jpg',
          'https://res.cloudinary.com/dooxg35gj/image/upload/v1753362055/portfolio/sentry-bridge-app-desktop.jpg',
          'https://res.cloudinary.com/dooxg35gj/image/upload/v1753362055/portfolio/sentry-bridge-app-mobile.jpg'
        ],
        description: 'אפליקציית Sentry Bridge - ניהול שגיאות מתקדם',
        descriptionRich: 'פיתוח אפליקציה לניהול שגיאות מתקדם עם Sentry. האפליקציה כוללת מערכת התראות, דוחות מפורטים וניהול שגיאות בזמן אמת.',
        url: 'https://sentry-bridge-app.com',
        date: new Date('2024-04-15'),
        technologies: ['React Native', 'Sentry', 'Firebase', 'Redux', 'TypeScript']
      },
      {
        id: 'wp-template-creator',
        name: 'WP Template Creator',
        slug: 'wp-template-creator',
        image: 'https://res.cloudinary.com/dooxg35gj/image/upload/v1753362055/portfolio/wp-template-creator.jpg',
        images: [
          'https://res.cloudinary.com/dooxg35gj/image/upload/v1753362055/portfolio/wp-template-creator.jpg',
          'https://res.cloudinary.com/dooxg35gj/image/upload/v1753362055/portfolio/wp-template-creator-desktop.jpg',
          'https://res.cloudinary.com/dooxg35gj/image/upload/v1753362055/portfolio/wp-template-creator-mobile.jpg'
        ],
        description: 'יוצר תבניות WordPress מתקדם',
        descriptionRich: 'פיתוח כלי מתקדם ליצירת תבניות WordPress. הכלי כולל עורך ויזואלי, ספריית רכיבים ומערכת ניהול תבניות.',
        url: 'https://wp-template-creator.com',
        date: new Date('2024-06-10'),
        technologies: ['WordPress', 'PHP', 'JavaScript', 'MySQL', 'Bootstrap']
      },
      {
        id: 'top-event-gear',
        name: 'Top Event Gear',
        slug: 'top-event-gear',
        image: 'https://res.cloudinary.com/dooxg35gj/image/upload/v1753362055/portfolio/top-event-gear.jpg',
        images: [
          'https://res.cloudinary.com/dooxg35gj/image/upload/v1753362055/portfolio/top-event-gear.jpg',
          'https://res.cloudinary.com/dooxg35gj/image/upload/v1753362055/portfolio/top-event-gear-desktop.jpg',
          'https://res.cloudinary.com/dooxg35gj/image/upload/v1753362055/portfolio/top-event-gear-mobile.jpg'
        ],
        description: 'אתר Top Event Gear - ציוד לאירועים',
        descriptionRich: 'פיתוח אתר חנות אונליין לציוד לאירועים. האתר כולל קטלוג מוצרים מתקדם, מערכת הזמנות ומערכת תשלומים מאובטחת.',
        url: 'https://top-event-gear.com',
        date: new Date('2024-05-20'),
        technologies: ['Next.js', 'Stripe', 'Prisma', 'PostgreSQL', 'Tailwind CSS']
      },
      {
        id: 'opulent-gold-market',
        name: 'Opulent Gold Market',
        slug: 'opulent-gold-market',
        image: 'https://res.cloudinary.com/dooxg35gj/image/upload/v1753362055/portfolio/opulent-gold-market.jpg',
        images: [
          'https://res.cloudinary.com/dooxg35gj/image/upload/v1753362055/portfolio/opulent-gold-market.jpg',
          'https://res.cloudinary.com/dooxg35gj/image/upload/v1753362055/portfolio/opulent-gold-market-desktop.jpg',
          'https://res.cloudinary.com/dooxg35gj/image/upload/v1753362055/portfolio/opulent-gold-market-mobile.jpg'
        ],
        description: 'אתר Opulent Gold Market - חנות זהב אונליין',
        descriptionRich: 'פיתוח חנות זהב אונליין מתקדמת עם מערכת תשלומים מאובטחת וממשק משתמש יוקרתי.',
        url: 'https://opulentgoldmarket.com',
        date: new Date('2024-03-20'),
        technologies: ['Next.js', 'Stripe', 'Prisma', 'PostgreSQL']
      },
      {
        id: 'child-disability',
        name: 'נכויות ילדים',
        slug: 'child-disability',
        image: 'https://res.cloudinary.com/dooxg35gj/image/upload/v1753362055/portfolio/child-disability.jpg',
        images: [
          'https://res.cloudinary.com/dooxg35gj/image/upload/v1753362055/portfolio/child-disability.jpg',
          'https://res.cloudinary.com/dooxg35gj/image/upload/v1753362055/portfolio/child-disability-desktop.jpg',
          'https://res.cloudinary.com/dooxg35gj/image/upload/v1753362055/portfolio/child-disability-mobile.jpg'
        ],
        description: 'אתר נכויות ילדים - עיצוב ופיתוח',
        descriptionRich: 'עיצוב ופיתוח אתר עבור ארגון נכויות ילדים. האתר כולל מערכת תרומות מתקדמת ועיצוב נגיש.',
        url: 'https://child-disability.org',
        date: new Date('2024-02-15'),
        technologies: ['React', 'Node.js', 'MongoDB', 'Stripe']
      }
    ];

    for (const project of originalPortfolioProjects) {
      await prisma.portfolioProject2.upsert({
        where: { id: project.id },
        update: {},
        create: project
      });
    }
    console.log('✅ פרויקטי פורטפוליו מקוריים נוצרו');

    console.log('🎉 הנתונים המקוריים שוחזרו בהצלחה!');

  } catch (error) {
    console.error('שגיאה בשחזור הנתונים:', error);
  } finally {
    await prisma.$disconnect();
  }
}

restoreOriginalData(); 