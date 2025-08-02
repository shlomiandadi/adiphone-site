const { PrismaClient } = require('@prisma/client');

async function testPrisma() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔍 בודק חיבור למסד הנתונים...');
    
    // בדיקת חיבור
    await prisma.$connect();
    console.log('✅ חיבור למסד הנתונים הצליח');
    
    // בדיקת מודל SEO
    console.log('🔍 בודק מודל SEO...');
    const seoCount = await prisma.sEO.count();
    console.log(`✅ מודל SEO עובד - יש ${seoCount} רשומות`);
    
    // בדיקת מודל RobotsSettings
    console.log('🔍 בודק מודל RobotsSettings...');
    const robotsCount = await prisma.robotsSettings.count();
    console.log(`✅ מודל RobotsSettings עובד - יש ${robotsCount} רשומות`);
    
    // בדיקת מודל SitemapSettings
    console.log('🔍 בודק מודל SitemapSettings...');
    const sitemapCount = await prisma.sitemapSettings.count();
    console.log(`✅ מודל SitemapSettings עובד - יש ${sitemapCount} רשומות`);
    
    // בדיקת מודל CanonicalTag
    console.log('🔍 בודק מודל CanonicalTag...');
    const canonicalCount = await prisma.canonicalTag.count();
    console.log(`✅ מודל CanonicalTag עובד - יש ${canonicalCount} רשומות`);
    
    // בדיקת מודל Breadcrumb
    console.log('🔍 בודק מודל Breadcrumb...');
    const breadcrumbCount = await prisma.breadcrumb.count();
    console.log(`✅ מודל Breadcrumb עובד - יש ${breadcrumbCount} רשומות`);
    
    // בדיקת מודל PageHierarchy
    console.log('🔍 בודק מודל PageHierarchy...');
    const hierarchyCount = await prisma.pageHierarchy.count();
    console.log(`✅ מודל PageHierarchy עובד - יש ${hierarchyCount} רשומות`);
    
  } catch (error) {
    console.error('❌ שגיאה בבדיקת Prisma:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testPrisma(); 