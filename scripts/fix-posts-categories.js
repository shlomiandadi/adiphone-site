const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function fixPostsCategories() {
  try {
    console.log('מתחיל תיקון קטגוריות הפוסטים...');

    // מיפוי קטגוריות ישנות לחדשות
    const categoryMapping = {
      'NEWS': 'SEO',
      'AI': 'SEO', 
      'WEB_DEVELOPMENT': 'WEB_DEVELOPMENT',
      'SEO': 'SEO'
    };

    // עדכון הפוסטים
    const posts = await prisma.post.findMany();
    
    for (const post of posts) {
      const newCategory = categoryMapping[post.category] || 'SEO';
      
      await prisma.post.update({
        where: { id: post.id },
        data: { category: newCategory }
      });
      
      console.log(`✅ עודכן פוסט: ${post.title} - קטגוריה: ${post.category} -> ${newCategory}`);
    }

    console.log('🎉 תיקון הקטגוריות הושלם בהצלחה!');

    // בדיקה
    const updatedPosts = await prisma.post.findMany({
      select: { title: true, category: true }
    });
    
    console.log('📊 קטגוריות מעודכנות:');
    updatedPosts.forEach(post => {
      console.log(`  - ${post.title}: ${post.category}`);
    });

  } catch (error) {
    console.error('שגיאה בתיקון הקטגוריות:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixPostsCategories(); 