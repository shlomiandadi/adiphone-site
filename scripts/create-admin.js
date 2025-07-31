const { PrismaClient } = require('@prisma/client');
const { hash } = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    // בדיקה אם כבר יש משתמש מנהל
    const existingAdmin = await prisma.user.findFirst({
      where: {
        role: 'ADMIN'
      }
    });

    if (existingAdmin) {
      console.log('משתמש מנהל כבר קיים במערכת');
      return;
    }

    // יצירת סיסמה מוצפנת
    const hashedPassword = await hash('admin123', 12);

    // יצירת משתמש מנהל
    const adminUser = await prisma.user.create({
      data: {
        username: 'admin',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'ADMIN',
        isActive: true
      }
    });

    console.log('משתמש מנהל נוצר בהצלחה!');
    console.log('פרטי התחברות:');
    console.log('שם משתמש: admin');
    console.log('אימייל: admin@example.com');
    console.log('סיסמה: admin123');
    console.log('תפקיד: מנהל');

  } catch (error) {
    console.error('שגיאה ביצירת משתמש מנהל:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser(); 