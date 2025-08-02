const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function initPageHierarchy() {
  try {
    console.log('🚀 מתחיל יצירת היררכיה של עמודים...');

    // יצירת עמודים ראשיים (רמה 0)
    const mainPages = [
      {
        pageId: 'home',
        pageSlug: '/',
        pageTitle: 'דף הבית',
        level: 0,
        order: 1,
        breadcrumbTitle: 'דף הבית'
      },
      {
        pageId: 'services',
        pageSlug: '/services',
        pageTitle: 'שירותים',
        level: 0,
        order: 2,
        breadcrumbTitle: 'שירותים'
      },
      {
        pageId: 'about',
        pageSlug: '/about',
        pageTitle: 'אודות',
        level: 0,
        order: 3,
        breadcrumbTitle: 'אודות'
      },
      {
        pageId: 'portfolio',
        pageSlug: '/portfolio',
        pageTitle: 'פרויקטים',
        level: 0,
        order: 4,
        breadcrumbTitle: 'פרויקטים'
      },
      {
        pageId: 'blog',
        pageSlug: '/blog',
        pageTitle: 'בלוג',
        level: 0,
        order: 5,
        breadcrumbTitle: 'בלוג'
      },
      {
        pageId: 'contact',
        pageSlug: '/contact',
        pageTitle: 'צור קשר',
        level: 0,
        order: 6,
        breadcrumbTitle: 'צור קשר'
      }
    ];

    // יצירת עמודים ראשיים
    for (const page of mainPages) {
      await prisma.pageHierarchy.upsert({
        where: { pageId: page.pageId },
        update: page,
        create: page
      });
    }

    // קבלת עמוד השירותים כהורה
    const servicesParent = await prisma.pageHierarchy.findUnique({
      where: { pageId: 'services' }
    });

    // יצירת עמודי שירותים (רמה 1)
    const servicePages = [
      {
        pageId: 'web-development',
        pageSlug: '/services/web-development',
        pageTitle: 'בניית אתרים',
        parentId: servicesParent.id,
        level: 1,
        order: 1,
        breadcrumbTitle: 'בניית אתרים'
      },
      {
        pageId: 'seo',
        pageSlug: '/services/seo',
        pageTitle: 'קידום אתרים',
        parentId: servicesParent.id,
        level: 1,
        order: 2,
        breadcrumbTitle: 'קידום אתרים'
      },
      {
        pageId: 'ppc',
        pageSlug: '/services/ppc',
        pageTitle: 'פרסום ממומן',
        parentId: servicesParent.id,
        level: 1,
        order: 3,
        breadcrumbTitle: 'פרסום ממומן'
      },
      {
        pageId: 'app-development',
        pageSlug: '/services/app-development',
        pageTitle: 'פיתוח אפליקציות',
        parentId: servicesParent.id,
        level: 1,
        order: 4,
        breadcrumbTitle: 'פיתוח אפליקציות'
      }
    ];

    // יצירת עמודי שירותים
    for (const page of servicePages) {
      await prisma.pageHierarchy.upsert({
        where: { pageId: page.pageId },
        update: page,
        create: page
      });
    }

    console.log('✅ היררכיה של עמודים נוצרה בהצלחה');
  } catch (error) {
    console.error('❌ שגיאה ביצירת היררכיה של עמודים:', error);
  } finally {
    await prisma.$disconnect();
  }
}

initPageHierarchy(); 