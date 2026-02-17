require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// קבלת פרטי ההתחברות ממשתני סביבה
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

async function updateAdminPassword() {
  try {
    // בדיקה שמשתני הסביבה קיימים
    if (!ADMIN_EMAIL) {
      throw new Error('ADMIN_EMAIL לא הוגדר במשתני הסביבה');
    }
    if (!ADMIN_PASSWORD) {
      throw new Error('ADMIN_PASSWORD לא הוגדר במשתני הסביבה');
    }

    // חיפוש משתמש admin
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username: ADMIN_USERNAME },
          { email: ADMIN_EMAIL },
          { role: 'ADMIN' }
        ]
      }
    });

    if (existingUser) {
      console.log('משתמש admin נמצא, מעדכן סיסמה...');
      
      // הצפנת הסיסמה
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);
      
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
    } else {
      console.log('יוצר משתמש admin חדש...');
      
      // הצפנת הסיסמה
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);
      
      // יצירת המשתמש
      const newUser = await prisma.user.create({
        data: {
          username: ADMIN_USERNAME,
          email: ADMIN_EMAIL,
          password: hashedPassword,
          role: 'ADMIN',
          isActive: true
        }
      });
      
      console.log('✅ משתמש admin נוצר בהצלחה');
      console.log('שם משתמש:', ADMIN_USERNAME);
      console.log('אימייל:', ADMIN_EMAIL);
    }
    
  } catch (error) {
    console.error('שגיאה בעדכון משתמש:', error);
    if (error.message.includes('DATABASE_URL')) {
      console.error('\n❌ שגיאה: לא נמצא DATABASE_URL');
      console.error('אנא צור קובץ .env עם משתנה DATABASE_URL');
    } else if (error.message.includes('ADMIN_EMAIL') || error.message.includes('ADMIN_PASSWORD')) {
      console.error('\n❌ שגיאה:', error.message);
      console.error('אנא הוסף את המשתנים הבאים לקובץ .env:');
      console.error('  ADMIN_USERNAME=admin');
      console.error('  ADMIN_EMAIL=your-email@example.com');
      console.error('  ADMIN_PASSWORD=your-secure-password');
    }
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

updateAdminPassword();
