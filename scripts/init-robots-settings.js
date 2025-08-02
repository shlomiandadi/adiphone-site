const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function initRobotsSettings() {
  try {
    console.log('🚀 מתחיל יצירת הגדרות robots.txt...');

    const robotsSettings = {
      userAgent: '*',
      allowPaths: ['/', '/services', '/about', '/portfolio', '/blog', '/contact'],
      disallowPaths: ['/admin', '/api', '/_next', '/private'],
      crawlDelay: 1,
      sitemapUrl: 'https://adi-phone.co.il/sitemap.xml',
      isActive: true
    };

    // בדיקה אם כבר קיימות הגדרות
    const existingSettings = await prisma.robotsSettings.findFirst();
    
    if (existingSettings) {
      await prisma.robotsSettings.update({
        where: { id: existingSettings.id },
        data: robotsSettings
      });
    } else {
      await prisma.robotsSettings.create({
        data: robotsSettings
      });
    }

    console.log('✅ הגדרות robots.txt נוצרו בהצלחה');
  } catch (error) {
    console.error('❌ שגיאה ביצירת הגדרות robots.txt:', error);
  } finally {
    await prisma.$disconnect();
  }
}

initRobotsSettings(); 