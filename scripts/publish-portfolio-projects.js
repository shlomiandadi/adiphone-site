const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function publishAllProjects() {
  try {
    // עדכון כל הפרויקטים למפורסמים
    const result = await prisma.portfolioProject2.updateMany({
      where: {
        published: false
      },
      data: {
        published: true
      }
    });

    console.log(`עודכנו ${result.count} פרויקטים למפורסמים`);

    // הצגת כל הפרויקטים
    const projects = await prisma.portfolioProject2.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        published: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log('\nרשימת הפרויקטים:');
    projects.forEach(project => {
      console.log(`- ${project.name} (${project.slug}): ${project.published ? 'מפורסם' : 'טיוטה'}`);
    });

  } catch (error) {
    console.error('שגיאה בעדכון הפרויקטים:', error);
  } finally {
    await prisma.$disconnect();
  }
}

publishAllProjects(); 