const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function fixPortfolioUrls() {
  try {
    console.log('מתחיל תיקון כתובות URL של פרויקטים...');

    // קבלת כל הפרויקטים
    const projects = await prisma.portfolioProject2.findMany();

    console.log(`נמצאו ${projects.length} פרויקטים`);

    let fixedCount = 0;

    for (const project of projects) {
      let updatedUrl = project.url;

      // בדיקה אם ה-URL צריך תיקון
      if (updatedUrl && !updatedUrl.startsWith('http://') && !updatedUrl.startsWith('https://')) {
        updatedUrl = 'https://' + updatedUrl;
        
        // עדכון הפרויקט
        await prisma.portfolioProject2.update({
          where: { id: project.id },
          data: { url: updatedUrl }
        });

        console.log(`✅ תוקן פרויקט: ${project.name}`);
        console.log(`   מ: ${project.url}`);
        console.log(`   ל: ${updatedUrl}`);
        fixedCount++;
      }
    }

    console.log(`\n🎉 תיקון הושלם! תוקנו ${fixedCount} פרויקטים`);

  } catch (error) {
    console.error('שגיאה בתיקון כתובות URL:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixPortfolioUrls(); 