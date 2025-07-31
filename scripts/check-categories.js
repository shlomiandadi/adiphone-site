const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkCategories() {
  try {
    console.log('בדיקת קטגוריות קיימות במסד הנתונים...\n');
    
    const categories = await prisma.category.findMany({
      orderBy: {
        name: 'asc'
      }
    });
    
    if (categories.length === 0) {
      console.log('❌ אין קטגוריות במסד הנתונים');
      return;
    }
    
    console.log(`✅ נמצאו ${categories.length} קטגוריות:\n`);
    
    categories.forEach((category, index) => {
      console.log(`${index + 1}. ${category.name}`);
      console.log(`   Slug: ${category.slug}`);
      console.log(`   תיאור: ${category.description || 'אין תיאור'}`);
      console.log(`   צבע: ${category.color}`);
      console.log(`   נוצר: ${category.createdAt.toLocaleDateString('he-IL')}`);
      console.log('');
    });
    
    // בדיקה אם יש פוסטים בכל קטגוריה
    console.log('📊 סטטיסטיקות פוסטים לפי קטגוריה:');
    for (const category of categories) {
      const postCount = await prisma.post.count({
        where: {
          categoryId: category.id
        }
      });
      console.log(`   ${category.name}: ${postCount} פוסטים`);
    }
    
  } catch (error) {
    console.error('שגיאה בבדיקת קטגוריות:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkCategories(); 