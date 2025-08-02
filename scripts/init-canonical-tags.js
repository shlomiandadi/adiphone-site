const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function initCanonicalTags() {
  try {
    console.log('🚀 מתחיל יצירת תגיות קנוניקל...');

    const canonicalTagsData = [
      {
        pageSlug: '/',
        canonicalUrl: 'https://adi-phone.co.il/'
      },
      {
        pageSlug: '/services',
        canonicalUrl: 'https://adi-phone.co.il/services'
      },
      {
        pageSlug: '/services/web-development',
        canonicalUrl: 'https://adi-phone.co.il/services/web-development'
      },
      {
        pageSlug: '/services/seo',
        canonicalUrl: 'https://adi-phone.co.il/services/seo'
      },
      {
        pageSlug: '/services/ppc',
        canonicalUrl: 'https://adi-phone.co.il/services/ppc'
      },
      {
        pageSlug: '/services/app-development',
        canonicalUrl: 'https://adi-phone.co.il/services/app-development'
      },
      {
        pageSlug: '/about',
        canonicalUrl: 'https://adi-phone.co.il/about'
      },
      {
        pageSlug: '/portfolio',
        canonicalUrl: 'https://adi-phone.co.il/portfolio'
      },
      {
        pageSlug: '/blog',
        canonicalUrl: 'https://adi-phone.co.il/blog'
      },
      {
        pageSlug: '/contact',
        canonicalUrl: 'https://adi-phone.co.il/contact'
      }
    ];

    for (const canonicalTag of canonicalTagsData) {
      await prisma.canonicalTag.upsert({
        where: { pageSlug: canonicalTag.pageSlug },
        update: canonicalTag,
        create: canonicalTag
      });
    }

    console.log('✅ תגיות קנוניקל נוצרו בהצלחה');
  } catch (error) {
    console.error('❌ שגיאה ביצירת תגיות קנוניקל:', error);
  } finally {
    await prisma.$disconnect();
  }
}

initCanonicalTags(); 