const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

const prisma = new PrismaClient();

async function restoreDatabase(backupFile) {
  try {
    console.log(`Starting database restore from: ${backupFile}`);
    
    // Read backup file
    const backupData = JSON.parse(fs.readFileSync(backupFile, 'utf8'));
    console.log(`Backup timestamp: ${backupData.timestamp}`);
    
    // Clear existing data (optional - be careful!)
    console.log('Clearing existing data...');
    await prisma.postTag.deleteMany();
    await prisma.post.deleteMany();
    await prisma.contact.deleteMany();
    await prisma.portfolioProject2.deleteMany();
    await prisma.tag.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();
    
    // Restore Users
    if (backupData.users && backupData.users.length > 0) {
      for (const user of backupData.users) {
        await prisma.user.create({
          data: {
            id: user.id,
            username: user.username,
            email: user.email,
            password: user.password,
            role: user.role,
            isActive: user.isActive,
            lastLogin: user.lastLogin,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
          }
        });
      }
      console.log(`Restored ${backupData.users.length} users`);
    }
    
    // Restore Categories
    if (backupData.categories && backupData.categories.length > 0) {
      for (const category of backupData.categories) {
        await prisma.category.create({
          data: {
            id: category.id,
            name: category.name,
            slug: category.slug,
            description: category.description,
            color: category.color,
            createdAt: category.createdAt,
            updatedAt: category.updatedAt
          }
        });
      }
      console.log(`Restored ${backupData.categories.length} categories`);
    }
    
    // Restore Tags
    if (backupData.tags && backupData.tags.length > 0) {
      for (const tag of backupData.tags) {
        await prisma.tag.create({
          data: {
            id: tag.id,
            name: tag.name,
            slug: tag.slug,
            createdAt: tag.createdAt,
            updatedAt: tag.updatedAt
          }
        });
      }
      console.log(`Restored ${backupData.tags.length} tags`);
    }
    
    // Restore Posts
    if (backupData.posts && backupData.posts.length > 0) {
      for (const post of backupData.posts) {
        // מציאת הקטגוריה לפי שם
        let categoryId = null;
        if (post.category) {
          const category = await prisma.category.findFirst({
            where: { name: post.category }
          });
          categoryId = category?.id || null;
        }

        await prisma.post.create({
          data: {
            id: post.id,
            slug: post.slug,
            title: post.title,
            excerpt: post.excerpt,
            content: post.content,
            mainImage: post.mainImage,
            images: post.images,
            tags: post.tags,
            published: post.published,
            authorName: post.authorName,
            authorEmail: post.authorEmail,
            views: post.views,
            likes: post.likes,
            metaTitle: post.metaTitle,
            metaDesc: post.metaDesc,
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
            authorId: post.authorId,
            categoryId: categoryId
          }
        });
      }
      console.log(`Restored ${backupData.posts.length} posts`);
    }
    
    // Restore PostTags
    if (backupData.postTags && backupData.postTags.length > 0) {
      for (const postTag of backupData.postTags) {
        await prisma.postTag.create({
          data: {
            id: postTag.id,
            postId: postTag.postId,
            tagId: postTag.tagId
          }
        });
      }
      console.log(`Restored ${backupData.postTags.length} post tags`);
    }
    
    // Restore Contacts
    if (backupData.contacts && backupData.contacts.length > 0) {
      for (const contact of backupData.contacts) {
        await prisma.contact.create({
          data: {
            id: contact.id,
            name: contact.name,
            email: contact.email,
            phone: contact.phone,
            message: contact.message,
            service: contact.service,
            status: contact.status,
            createdAt: contact.createdAt,
            updatedAt: contact.updatedAt
          }
        });
      }
      console.log(`Restored ${backupData.contacts.length} contacts`);
    }
    
    // Restore Portfolio Projects
    if (backupData.portfolioProjects && backupData.portfolioProjects.length > 0) {
      for (const project of backupData.portfolioProjects) {
        await prisma.portfolioProject2.create({
          data: {
            id: project.id,
            name: project.name,
            slug: project.slug,
            image: project.image,
            images: project.images,
            description: project.description,
            descriptionRich: project.descriptionRich,
            url: project.url,
            date: project.date,
            technologies: project.technologies,
            published: true, // מפרסם את כל הפרויקטים
            metaTitle: project.metaTitle,
            metaDesc: project.metaDesc,
            createdAt: project.createdAt,
            updatedAt: project.updatedAt
          }
        });
      }
      console.log(`Restored ${backupData.portfolioProjects.length} portfolio projects`);
    }
    
    console.log('Database restore completed successfully!');
    
  } catch (error) {
    console.error('Restore failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Get backup file from command line argument
const backupFile = process.argv[2];
if (!backupFile) {
  console.error('Please provide a backup file path: node restore-database.js backup-file.json');
  process.exit(1);
}

restoreDatabase(backupFile); 