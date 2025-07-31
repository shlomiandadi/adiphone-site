const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function fixBlogSlug() {
  try {
    console.log('מתחיל תיקון הסלאג של הבלוג...');

    // מציאת הפוסט עם הסלאג הבעייתי
    const oldPost = await prisma.post.findUnique({
      where: { slug: 'top-webstak---' }
    });

    if (!oldPost) {
      console.log('❌ לא נמצא פוסט עם הסלאג הבעייתי');
      return;
    }

    console.log(`📝 נמצא פוסט: ${oldPost.title}`);
    console.log(`🔗 סלאג ישן: ${oldPost.slug}`);

    // סלאג חדש מקצועי באנגלית
    const newSlug = 'top-webstak-digital-agency-success-story';

    // בדיקה שהסלאג החדש לא קיים
    const existingPost = await prisma.post.findUnique({
      where: { slug: newSlug }
    });

    if (existingPost) {
      console.log('❌ הסלאג החדש כבר קיים');
      return;
    }

    // עדכון הסלאג
    await prisma.post.update({
      where: { slug: 'top-webstak---' },
      data: { slug: newSlug }
    });

    console.log(`✅ הסלאג עודכן בהצלחה:`);
    console.log(`   מ: ${oldPost.slug}`);
    console.log(`   ל: ${newSlug}`);

    // בדיקה
    const updatedPost = await prisma.post.findUnique({
      where: { slug: newSlug }
    });

    if (updatedPost) {
      console.log(`🎉 הפוסט זמין כעת ב: /blog/${newSlug}`);
    }

  } catch (error) {
    console.error('שגיאה בתיקון הסלאג:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixBlogSlug(); 