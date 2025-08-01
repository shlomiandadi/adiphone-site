const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkAndFixPages() {
  try {
    console.log('בודק דפים במסד הנתונים...\n');

    // קבלת כל הדפים
    const pages = await prisma.page.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        published: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log(`נמצאו ${pages.length} דפים:\n`);

    let unpublishedCount = 0;
    let updatedCount = 0;

    for (const page of pages) {
      console.log(`- ${page.title} (/${page.slug}) - ${page.published ? 'מפורסם' : 'לא מפורסם'}`);
      
      if (!page.published) {
        unpublishedCount++;
        
        // עדכון הדף למפורסם
        await prisma.page.update({
          where: { id: page.id },
          data: { published: true }
        });
        
        console.log(`  ✓ עודכן למפורסם`);
        updatedCount++;
      }
    }

    console.log(`\nסיכום:`);
    console.log(`- דפים לא מפורסמים: ${unpublishedCount}`);
    console.log(`- דפים שעודכנו: ${updatedCount}`);

    if (updatedCount > 0) {
      console.log(`\nכל הדפים עודכנו בהצלחה!`);
    } else {
      console.log(`\nכל הדפים כבר מפורסמים.`);
    }

  } catch (error) {
    console.error('שגיאה:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAndFixPages(); 