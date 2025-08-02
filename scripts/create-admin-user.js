const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    // בדיקה אם המשתמש כבר קיים
    const existingUser = await prisma.user.findFirst({
      where: {
        username: 'admin'
      }
    });

    if (existingUser) {
      console.log('משתמש admin כבר קיים, מעדכן סיסמה...');
      
      // הצפנת הסיסמה החדשה
      const hashedPassword = await bcrypt.hash('admin123', 12);
      
      // עדכון הסיסמה
      await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          password: hashedPassword,
          isActive: true,
          role: 'ADMIN'
        }
      });
      
      console.log('✅ סיסמת המשתמש admin עודכנה בהצלחה');
      console.log('שם משתמש: admin');
      console.log('סיסמה: admin123');
    } else {
      console.log('יוצר משתמש admin חדש...');
      
      // הצפנת הסיסמה
      const hashedPassword = await bcrypt.hash('admin123', 12);
      
      // יצירת המשתמש
      const newUser = await prisma.user.create({
        data: {
          username: 'admin',
          email: 'admin@example.com',
          password: hashedPassword,
          role: 'ADMIN',
          isActive: true
        }
      });
      
      console.log('✅ משתמש admin נוצר בהצלחה');
      console.log('שם משתמש: admin');
      console.log('סיסמה: admin123');
    }
    
  } catch (error) {
    console.error('שגיאה ביצירת משתמש:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser(); 