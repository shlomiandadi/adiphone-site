const { PrismaClient } = require('@prisma/client');

async function testSimple() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔍 בודק חיבור למסד הנתונים...');
    await prisma.$connect();
    console.log('✅ חיבור למסד הנתונים הצליח');
    
    // בדיקת מודל SEO
    console.log('🔍 בודק מודל SEO...');
    const seoData = await prisma.sEO.findMany();
    console.log(`✅ מודל SEO עובד - יש ${seoData.length} רשומות`);
    
    // בדיקת מודל RobotsSettings
    console.log('🔍 בודק מודל RobotsSettings...');
    const robotsData = await prisma.robotsSettings.findMany();
    console.log(`✅ מודל RobotsSettings עובד - יש ${robotsData.length} רשומות`);
    
  } catch (error) {
    console.error('❌ שגיאה:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testSimple(); 