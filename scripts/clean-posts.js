const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function cleanPosts() {
  try {
    console.log('מתחיל ניקוי פוסטים...');

    // רשימת הפוסטים שצריכים להישאר
    const keepPosts = [
      'top-webstak-israel-hayom',
      'seo-comprehensive-guide',
      'advanced-web-development',
      'mobile-app-development'
    ];

    // מחיקת כל הפוסטים שלא ברשימה
    const deleteResult = await prisma.post.deleteMany({
      where: {
        slug: {
          notIn: keepPosts
        }
      }
    });

    console.log(`✅ נמחקו ${deleteResult.count} פוסטים מיותרים`);

    // בדיקה כמה פוסטים נשארו
    const remainingPosts = await prisma.post.findMany({
      orderBy: { createdAt: 'desc' }
    });
    console.log(`📊 נשארו ${remainingPosts.length} פוסטים:`);
    
    remainingPosts.forEach(post => {
      console.log(`  - ${post.title} (${post.slug})`);
    });

    console.log('🎉 ניקוי הפוסטים הושלם בהצלחה!');

  } catch (error) {
    console.error('שגיאה בניקוי הפוסטים:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanPosts(); 