const path = require('path');

// בדיקת ה-import של lib/prisma
try {
  console.log('🔍 בודק import של lib/prisma...');
  const prisma = require('../lib/prisma').default;
  console.log('✅ import של lib/prisma הצליח');
  
  // בדיקת חיבור
  prisma.$connect().then(() => {
    console.log('✅ חיבור למסד הנתונים הצליח');
    
    // בדיקת מודל SEO
    return prisma.sEO.count();
  }).then((count) => {
    console.log(`✅ מודל SEO עובד - יש ${count} רשומות`);
    return prisma.$disconnect();
  }).then(() => {
    console.log('✅ ניתוק מהמסד הנתונים הצליח');
  }).catch((error) => {
    console.error('❌ שגיאה:', error);
  });
  
} catch (error) {
  console.error('❌ שגיאה ב-import של lib/prisma:', error);
} 