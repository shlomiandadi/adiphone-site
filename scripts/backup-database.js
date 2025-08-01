const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function backupDatabase() {
  try {
    console.log('Starting database backup...');
    
    // Backup Users
    const users = await prisma.user.findMany();
    console.log(`Backed up ${users.length} users`);
    
    // Backup Posts
    const posts = await prisma.post.findMany({
      include: {
        postTags: {
          include: {
            tag: true
          }
        }
      }
    });
    console.log(`Backed up ${posts.length} posts`);
    
    // Backup Categories
    const categories = await prisma.category.findMany();
    console.log(`Backed up ${categories.length} categories`);
    
    // Backup Tags
    const tags = await prisma.tag.findMany();
    console.log(`Backed up ${tags.length} tags`);
    
    // Backup PostTags
    const postTags = await prisma.postTag.findMany();
    console.log(`Backed up ${postTags.length} post tags`);
    
    // Backup Contacts
    const contacts = await prisma.contact.findMany();
    console.log(`Backed up ${contacts.length} contacts`);
    
    // Backup Portfolio Projects
    const portfolioProjects = await prisma.portfolioProject2.findMany();
    console.log(`Backed up ${portfolioProjects.length} portfolio projects`);
    
    // Create backup object
    const backup = {
      timestamp: new Date().toISOString(),
      users,
      posts,
      categories,
      tags,
      postTags,
      contacts,
      portfolioProjects
    };
    
    // Write to file
    const fs = require('fs');
    const backupPath = `backup-${new Date().toISOString().split('T')[0]}.json`;
    fs.writeFileSync(backupPath, JSON.stringify(backup, null, 2));
    
    console.log(`Backup completed successfully! Saved to: ${backupPath}`);
    
  } catch (error) {
    console.error('Backup failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

backupDatabase(); 