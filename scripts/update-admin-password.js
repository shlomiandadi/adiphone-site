const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// הסיסמה מהפרודקשן (מ-netlify.toml)
const PRODUCTION_PASSWORD = 'adi112211';

async function updateAdminPassword() {
  try {
    // חיפוש משתמש admin
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username: 'admin' },
          { email: 'shlomiandadi@gmail.com' },
          { role: 'ADMIN' }
        ]
      }
    });

    if (existingUser) {
      console.log('משתמש admin נמצא, מעדכן סיסמה...');
      
      // הצפנת הסיסמה מהפרודקשן
      const hashedPassword = await bcrypt.hash(PRODUCTION_PASSWORD, 12);
      
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
      console.log('שם משתמש:', existingUser.username);
      console.log('אימייל:', existingUser.email);
      console.log('סיסמה:', PRODUCTION_PASSWORD);
    } else {
      console.log('יוצר משתמש admin חדש...');
      
      // הצפנת הסיסמה
      const hashedPassword = await bcrypt.hash(PRODUCTION_PASSWORD, 12);
      
      // יצירת המשתמש
      const newUser = await prisma.user.create({
        data: {
          username: 'admin',
          email: 'shlomiandadi@gmail.com',
          password: hashedPassword,
          role: 'ADMIN',
          isActive: true
        }
      });
      
      console.log('✅ משתמש admin נוצר בהצלחה');
      console.log('שם משתמש: admin');
      console.log('אימייל: shlomiandadi@gmail.com');
      console.log('סיסמה:', PRODUCTION_PASSWORD);
    }
    
  } catch (error) {
    console.error('שגיאה בעדכון משתמש:', error);
    if (error.message.includes('DATABASE_URL')) {
      console.error('\n❌ שגיאה: לא נמצא DATABASE_URL');
      console.error('אנא צור קובץ .env עם משתנה DATABASE_URL');
    }
  } finally {
    await prisma.$disconnect();
  }
}

updateAdminPassword();
