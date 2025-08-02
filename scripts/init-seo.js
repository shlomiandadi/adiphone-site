const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const initialSEOData = [
  {
    page: 'home',
    title: 'Top WebStack - בנייה וקידום אתרים | מבית עדי פון תקשורת',
    description: 'Top WebStack - בנייה וקידום אתרים מקצועי מבית עדי פון תקשורת. צוות מנוסה עם מומחיות בבניית אתרים, קידום אורגני, פרסום ממומן ועוד.',
    keywords: 'בניית אתרים, קידום אתרים, SEO, עיצוב אתרים, פרסום ממומן, עדי פון תקשורת, web development',
    ogTitle: 'Top WebStack - בנייה וקידום אתרים | מבית עדי פון תקשורת',
    ogDescription: 'Top WebStack - בנייה וקידום אתרים מקצועי מבית עדי פון תקשורת',
    canonicalUrl: 'https://adi-phone.co.il'
  },
  {
    page: 'about',
    title: 'אודות Top WebStack - מי אנחנו | מבית עדי פון תקשורת',
    description: 'למדו על Top WebStack - חברת בנייה וקידום אתרים מקצועית מבית עדי פון תקשורת עם ניסיון של שנים בתחום הטכנולוגיה.',
    keywords: 'אודות, מי אנחנו, Top WebStack, עדי פון תקשורת, צוות, היסטוריה, ניסיון',
    ogTitle: 'אודות Top WebStack - מי אנחנו | מבית עדי פון תקשורת',
    ogDescription: 'למדו על Top WebStack - חברת בנייה וקידום אתרים מקצועית מבית עדי פון תקשורת',
    canonicalUrl: 'https://adi-phone.co.il/about'
  },
  {
    page: 'services',
    title: 'שירותי Top WebStack - בנייה וקידום אתרים',
    description: 'שירותי בניית אתרים, קידום אורגני, פרסום ממומן, עיצוב UI/UX ועוד. פתרונות מותאמים אישית לכל עסק מבית עדי פון תקשורת.',
    keywords: 'שירותים, בניית אתרים, קידום אתרים, SEO, פרסום ממומן, עיצוב, עדי פון תקשורת',
    ogTitle: 'שירותי Top WebStack - בנייה וקידום אתרים',
    ogDescription: 'שירותי בניית אתרים, קידום אורגני, פרסום ממומן ועיצוב UI/UX מבית עדי פון תקשורת',
    canonicalUrl: 'https://adi-phone.co.il/services'
  },
  {
    page: 'portfolio',
    title: 'פורטפוליו Top WebStack - פרויקטים שלנו',
    description: 'צפו בפרויקטים שלנו - אתרים, עבודות קידום ועבודות עיצוב מקצועיות שביצענו עבור לקוחותינו מבית עדי פון תקשורת.',
    keywords: 'פורטפוליו, פרויקטים, עבודות, דוגמאות, אתרים, קידום, עדי פון תקשורת',
    ogTitle: 'פורטפוליו Top WebStack - פרויקטים שלנו',
    ogDescription: 'צפו בפרויקטים שלנו - אתרים, עבודות קידום ועבודות עיצוב מבית עדי פון תקשורת',
    canonicalUrl: 'https://adi-phone.co.il/portfolio'
  },
  {
    page: 'blog',
    title: 'בלוג Top WebStack - חדשות וטיפים לבנייה וקידום אתרים',
    description: 'בלוג Top WebStack - מאמרים, חדשות וטיפים בתחום בניית אתרים, קידום אורגני וטכנולוגיה מבית עדי פון תקשורת.',
    keywords: 'בלוג, מאמרים, חדשות, טיפים, בניית אתרים, קידום אתרים, טכנולוגיה, עדי פון תקשורת',
    ogTitle: 'בלוג Top WebStack - חדשות וטיפים לבנייה וקידום אתרים',
    ogDescription: 'בלוג Top WebStack - מאמרים, חדשות וטיפים בתחום בניית אתרים וקידום מבית עדי פון תקשורת',
    canonicalUrl: 'https://adi-phone.co.il/blog'
  },
  {
    page: 'contact',
    title: 'צרו קשר - Top WebStack | מבית עדי פון תקשורת',
    description: 'צרו קשר עם Top WebStack לקבלת הצעת מחיר לבניית אתר או קידום אתרים. צוות מקצועי זמין לעזור לכם מבית עדי פון תקשורת.',
    keywords: 'צור קשר, הצעת מחיר, פנייה, תמיכה, עזרה, Top WebStack, עדי פון תקשורת',
    ogTitle: 'צרו קשר - Top WebStack | מבית עדי פון תקשורת',
    ogDescription: 'צרו קשר עם Top WebStack לקבלת הצעת מחיר לבניית אתר או קידום אתרים מבית עדי פון תקשורת',
    canonicalUrl: 'https://adi-phone.co.il/contact'
  }
];

async function initSEO() {
  try {
    console.log('🚀 מתחיל יצירת נתוני SEO...');

    for (const seoData of initialSEOData) {
      try {
        await prisma.sEO.upsert({
          where: { page: seoData.page },
          update: seoData,
          create: seoData
        });
        console.log(`✅ SEO נוצר/עודכן עבור עמוד: ${seoData.page}`);
      } catch (error) {
        console.error(`❌ שגיאה ביצירת SEO עבור עמוד ${seoData.page}:`, error);
      }
    }

    console.log('✅ נתוני SEO נוצרו בהצלחה');
  } catch (error) {
    console.error('❌ שגיאה ביצירת נתוני SEO:', error);
  } finally {
    await prisma.$disconnect();
  }
}

initSEO(); 