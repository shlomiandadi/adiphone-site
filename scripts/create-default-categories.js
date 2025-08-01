const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const defaultCategories = [
  {
    name: 'SEO',
    slug: 'seo',
    description: 'קידום אתרים אורגני',
    color: '#10B981'
  },
  {
    name: 'פיתוח אתרים',
    slug: 'web-development',
    description: 'בניית אתרים ופיתוח',
    color: '#3B82F6'
  },
  {
    name: 'אפליקציות',
    slug: 'mobile-apps',
    description: 'פיתוח אפליקציות מובייל',
    color: '#8B5CF6'
  },
  {
    name: 'עיצוב',
    slug: 'design',
    description: 'עיצוב UI/UX',
    color: '#F59E0B'
  },
  {
    name: 'שיווק דיגיטלי',
    slug: 'digital-marketing',
    description: 'שיווק דיגיטלי ופרסום',
    color: '#EF4444'
  },
  {
    name: 'בינה מלאכותית',
    slug: 'ai',
    description: 'בינה מלאכותית וחדשנות',
    color: '#06B6D4'
  },
  {
    name: 'חדשות',
    slug: 'news',
    description: 'חדשות ועדכונים',
    color: '#6B7280'
  }
];

async function createDefaultCategories() {
  try {
    console.log('Creating default categories...');
    
    for (const categoryData of defaultCategories) {
      // בדיקה אם הקטגוריה כבר קיימת לפי slug או name
      const existingCategory = await prisma.category.findFirst({
        where: {
          OR: [
            { slug: categoryData.slug },
            { name: categoryData.name }
          ]
        }
      });
      
      if (!existingCategory) {
        const category = await prisma.category.create({
          data: categoryData
        });
        console.log(`Created category: ${category.name} (${category.slug})`);
      } else {
        console.log(`Category already exists: ${existingCategory.name} (${existingCategory.slug})`);
      }
    }
    
    console.log('Default categories setup completed!');
    
  } catch (error) {
    console.error('Error creating default categories:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createDefaultCategories(); 