const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function cleanPortfolio() {
  try {
    console.log('מתחיל ניקוי מסד הנתונים...');

    // רשימת הפרויקטים שצריכים להישאר
    const keepProjects = [
      'pinitzedek',
      'sentry-bridge-app',
      'wp-template-creator',
      'top-event-gear',
      'opulent-gold-market',
      'child-disability'
    ];

    // מחיקת כל הפרויקטים שלא ברשימה
    const deleteResult = await prisma.portfolioProject2.deleteMany({
      where: {
        id: {
          notIn: keepProjects
        }
      }
    });

    console.log(`✅ נמחקו ${deleteResult.count} פרויקטים מיותרים`);

    // בדיקה כמה פרויקטים נשארו
    const remainingProjects = await prisma.portfolioProject2.findMany();
    console.log(`📊 נשארו ${remainingProjects.length} פרויקטים:`);
    
    remainingProjects.forEach(project => {
      console.log(`  - ${project.name} (${project.id})`);
    });

    console.log('🎉 ניקוי מסד הנתונים הושלם בהצלחה!');

  } catch (error) {
    console.error('שגיאה בניקוי מסד הנתונים:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanPortfolio(); 