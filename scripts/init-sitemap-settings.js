const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function initSitemapSettings() {
  try {
    console.log('🚀 מתחיל יצירת הגדרות מפת אתר...');

    const sitemapSettings = {
      isEnabled: true,
      includePages: true,
      includePosts: true,
      includeCategories: true,
      includePortfolio: true,
      excludePages: ['/admin', '/admin/*', '/api/*', '/_next/*'],
      excludePaths: ['/admin', '/api', '/_next'],
      priority: 0.8,
      changeFreq: 'weekly'
    };

    // בדיקה אם כבר קיימות הגדרות
    const existingSettings = await prisma.sitemapSettings.findFirst();
    
    if (existingSettings) {
      await prisma.sitemapSettings.update({
        where: { id: existingSettings.id },
        data: sitemapSettings
      });
    } else {
      await prisma.sitemapSettings.create({
        data: sitemapSettings
      });
    }

    console.log('✅ הגדרות מפת אתר נוצרו בהצלחה');
  } catch (error) {
    console.error('❌ שגיאה ביצירת הגדרות מפת אתר:', error);
  } finally {
    await prisma.$disconnect();
  }
}

initSitemapSettings(); 