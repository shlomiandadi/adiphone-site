const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function initBreadcrumbs() {
  try {
    console.log('🚀 מתחיל יצירת פירורי לחם...');

    const breadcrumbsData = [
      {
        pageSlug: '/',
        breadcrumbData: [
          { title: 'דף הבית', url: '/', isActive: true }
        ]
      },
      {
        pageSlug: '/services',
        breadcrumbData: [
          { title: 'דף הבית', url: '/', isActive: false },
          { title: 'שירותים', url: '/services', isActive: true }
        ]
      },
      {
        pageSlug: '/services/web-development',
        breadcrumbData: [
          { title: 'דף הבית', url: '/', isActive: false },
          { title: 'שירותים', url: '/services', isActive: false },
          { title: 'בניית אתרים', url: '/services/web-development', isActive: true }
        ]
      },
      {
        pageSlug: '/services/seo',
        breadcrumbData: [
          { title: 'דף הבית', url: '/', isActive: false },
          { title: 'שירותים', url: '/services', isActive: false },
          { title: 'קידום אתרים', url: '/services/seo', isActive: true }
        ]
      },
      {
        pageSlug: '/services/ppc',
        breadcrumbData: [
          { title: 'דף הבית', url: '/', isActive: false },
          { title: 'שירותים', url: '/services', isActive: false },
          { title: 'פרסום ממומן', url: '/services/ppc', isActive: true }
        ]
      },
      {
        pageSlug: '/services/app-development',
        breadcrumbData: [
          { title: 'דף הבית', url: '/', isActive: false },
          { title: 'שירותים', url: '/services', isActive: false },
          { title: 'פיתוח אפליקציות', url: '/services/app-development', isActive: true }
        ]
      },
      {
        pageSlug: '/about',
        breadcrumbData: [
          { title: 'דף הבית', url: '/', isActive: false },
          { title: 'אודות', url: '/about', isActive: true }
        ]
      },
      {
        pageSlug: '/portfolio',
        breadcrumbData: [
          { title: 'דף הבית', url: '/', isActive: false },
          { title: 'פרויקטים', url: '/portfolio', isActive: true }
        ]
      },
      {
        pageSlug: '/blog',
        breadcrumbData: [
          { title: 'דף הבית', url: '/', isActive: false },
          { title: 'בלוג', url: '/blog', isActive: true }
        ]
      },
      {
        pageSlug: '/contact',
        breadcrumbData: [
          { title: 'דף הבית', url: '/', isActive: false },
          { title: 'צור קשר', url: '/contact', isActive: true }
        ]
      }
    ];

    for (const breadcrumb of breadcrumbsData) {
      await prisma.breadcrumb.upsert({
        where: { pageSlug: breadcrumb.pageSlug },
        update: breadcrumb,
        create: breadcrumb
      });
    }

    console.log('✅ פירורי לחם נוצרו בהצלחה');
  } catch (error) {
    console.error('❌ שגיאה ביצירת פירורי לחם:', error);
  } finally {
    await prisma.$disconnect();
  }
}

initBreadcrumbs(); 