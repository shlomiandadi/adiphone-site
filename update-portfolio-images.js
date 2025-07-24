const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// הכנס כאן את המיפוי שלך: slug => { image, images }
const imageMapping = {
  // דוגמה:
  // 'pinitzedek': {
  //   image: 'https://res.cloudinary.com/dooxg35gj/image/upload/v1753362055/portfolio/pinitzedek.jpg',
  //   images: [
  //     'https://res.cloudinary.com/dooxg35gj/image/upload/v1753362055/portfolio/pinitzedek.jpg',
  //     'https://res.cloudinary.com/dooxg35gj/image/upload/v1753362055/portfolio/pinitzedek-desktop.jpg',
  //     'https://res.cloudinary.com/dooxg35gj/image/upload/v1753362055/portfolio/pinitzedek-mobile.jpg'
  //   ]
  // },
  // הוסף כאן את שאר הפרויקטים
};

async function updatePortfolioImages() {
  try {
    const projects = await prisma.portfolioProject2.findMany();
    for (const project of projects) {
      const mapping = imageMapping[project.slug];
      if (mapping) {
        await prisma.portfolioProject2.update({
          where: { id: project.id },
          data: {
            image: mapping.image,
            images: mapping.images
          }
        });
        console.log(`עודכן: ${project.slug}`);
      } else {
        console.log(`לא נמצא מיפוי ל: ${project.slug}`);
      }
    }
    console.log('סיום עדכון התמונות!');
  } catch (err) {
    console.error('שגיאה:', err);
  } finally {
    await prisma.$disconnect();
  }
}

updatePortfolioImages(); 