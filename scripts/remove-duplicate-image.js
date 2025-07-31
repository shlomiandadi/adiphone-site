const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function removeDuplicateImage() {
  try {
    console.log('מתחיל הסרת התמונה הכפולה מהפוסט...');

    // מציאת הפוסט
    const post = await prisma.post.findUnique({
      where: { slug: 'top-webstak-digital-agency-success-story' }
    });

    if (!post) {
      console.log('❌ לא נמצא הפוסט');
      return;
    }

    console.log(`📝 נמצא פוסט: ${post.title}`);

    // הסרת התמונה המובנית מהתוכן
    const imageUrl = 'https://res.cloudinary.com/dooxg35gj/image/upload/v1753868877/Top_WebStack_-_%D7%9E%D7%A2%D7%95%D7%9C%D7%9D_%D7%A9%D7%9C_%D7%9E%D7%9B%D7%A9%D7%99%D7%A8%D7%99%D7%9D_%D7%9C%D7%A2%D7%95%D7%9C%D7%9D_%D7%A9%D7%9C_%D7%A7%D7%95%D7%93_yj2kt6.png';
    
    // הסרת התמונה המובנית
    const updatedContent = post.content.replace(
      `<img src="${imageUrl}" alt="Top Webstak - כתבה בישראל היום" style="max-width:100%;height:auto;margin:20px 0" />`,
      ''
    );

    // עדכון הפוסט
    await prisma.post.update({
      where: { slug: 'top-webstak-digital-agency-success-story' },
      data: { content: updatedContent }
    });

    console.log('✅ התמונה הכפולה הוסרה בהצלחה!');
    console.log('📊 הפוסט עכשיו יציג:');
    console.log('   - תמונה ראשית ב-Hero Section');
    console.log('   - תמונה ראשית בתחילת התוכן');
    console.log('   - תוכן ללא תמונה כפולה');

  } catch (error) {
    console.error('שגיאה בהסרת התמונה הכפולה:', error);
  } finally {
    await prisma.$disconnect();
  }
}

removeDuplicateImage(); 