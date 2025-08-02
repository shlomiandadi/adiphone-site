const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function initSiteSettings() {
  try {
    console.log('מתחיל יצירת הגדרות ראשוניות לאתר...');

    // יצירת הגדרות האתר
    const existingSettings = await prisma.siteSettings.findFirst();
    let siteSettings;
    if (existingSettings) {
      siteSettings = existingSettings;
    } else {
      siteSettings = await prisma.siteSettings.create({
        data: {
          siteName: 'Top WebStack - בניה וקידום אתרים',
          siteDescription: 'חברת פיתוח אתרים מקצועית - בניית אתרים, אפליקציות ופתרונות דיגיטליים',
          siteKeywords: 'פיתוח אתרים, בניית אתרים, אפליקציות, SEO, דיגיטל, תוכנה',
          siteUrl: 'https://adi-phone.co.il',
          siteLogo: '/logo.png',
          siteFavicon: '/favicon.ico',
          googleAnalyticsId: '',
          googleTagManagerId: '',
          facebookPixelId: '',
          twitterHandle: '',
          facebookPage: '',
          instagramHandle: '',
          linkedinPage: '',
        },
      });
    }

    console.log('✅ הגדרות האתר נוצרו בהצלחה');

    // יצירת הדר ראשוני
    const existingHeader = await prisma.header.findFirst();
    let header;
    if (existingHeader) {
      header = existingHeader;
    } else {
      header = await prisma.header.create({
        data: {
          logo: '/logo.png',
          logoAlt: 'Top WebStack Logo',
          logoWidth: 150,
          logoHeight: 50,
          showSearch: true,
          searchPlaceholder: 'חיפוש...',
          showContactButton: true,
          contactButtonText: 'צור קשר',
          contactButtonLink: '/contact',
          backgroundColor: '#ffffff',
          textColor: '#000000',
          stickyHeader: true,
          showLanguageSwitcher: false,
          languages: [],
        },
      });
    }

    console.log('✅ הדר ראשוני נוצר בהצלחה');

    // יצירת פוטר ראשוני
    const existingFooter = await prisma.footer.findFirst();
    let footer;
    if (existingFooter) {
      footer = existingFooter;
    } else {
      footer = await prisma.footer.create({
        data: {
          logo: '/logo.png',
          logoAlt: 'Top WebStack Logo',
          logoWidth: 120,
          logoHeight: 40,
          description: 'חברת פיתוח אתרים מקצועית המתמחה בבניית אתרים, אפליקציות ופתרונות דיגיטליים מתקדמים.',
          backgroundColor: '#1f2937',
          textColor: '#ffffff',
          linkColor: '#9ca3af',
          linkHoverColor: '#ffffff',
          showNewsletter: true,
          newsletterTitle: 'הישארו מעודכנים',
          newsletterDescription: 'הירשמו לניוזלטר שלנו וקבלו עדכונים על פרויקטים חדשים וטיפים לפיתוח',
          newsletterPlaceholder: 'האימייל שלכם',
          newsletterButtonText: 'הרשמה',
          showSocialLinks: true,
          copyrightText: '© 2024 Top WebStack. כל הזכויות שמורות.',
        },
      });
    }

    console.log('✅ פוטר ראשוני נוצר בהצלחה');

    // יצירת עמודות פוטר ראשוניות
    const footerColumns = [
      {
        title: 'שירותים',
        order: 1,
        isActive: true,
      },
      {
        title: 'חברה',
        order: 2,
        isActive: true,
      },
      {
        title: 'תמיכה',
        order: 3,
        isActive: true,
      },
    ];

    for (const columnData of footerColumns) {
      const existingColumn = await prisma.footerColumn.findFirst({
        where: { 
          footerId: footer.id,
          title: columnData.title 
        }
      });
      
      if (!existingColumn) {
        await prisma.footerColumn.create({
          data: {
            ...columnData,
            footerId: footer.id,
          },
        });
      }
    }

    console.log('✅ עמודות פוטר ראשוניות נוצרו בהצלחה');

    // יצירת סטריפ עליון ראשוני
    const existingTopStrip = await prisma.topStrip.findFirst();
    let topStrip;
    if (existingTopStrip) {
      topStrip = existingTopStrip;
    } else {
      topStrip = await prisma.topStrip.create({
        data: {
          text: '🎉 מבצע מיוחד! 20% הנחה על כל הפרויקטים החדשים עד סוף החודש',
          backgroundColor: '#3b82f6',
          textColor: '#ffffff',
          isActive: false,
          showCloseButton: true,
          linkUrl: '/contact',
          linkText: 'צור קשר עכשיו',
        },
      });
    }

    console.log('✅ סטריפ עליון ראשוני נוצר בהצלחה');

    // יצירת תפריט ראשי
    const existingMenu = await prisma.menu.findFirst({
      where: { name: 'תפריט ראשי' }
    });
    let mainMenu;
    if (existingMenu) {
      mainMenu = existingMenu;
    } else {
      mainMenu = await prisma.menu.create({
        data: {
          name: 'תפריט ראשי',
          location: 'HEADER_MAIN',
          isActive: true,
        },
      });
    }

    console.log('✅ תפריט ראשי נוצר בהצלחה');

    // יצירת פריטי תפריט ראשוניים
    const menuItems = [
      {
        title: 'בית',
        url: '/',
        order: 1,
        isActive: true,
      },
      {
        title: 'שירותים',
        url: '/services',
        order: 2,
        isActive: true,
      },
      {
        title: 'פורטפוליו',
        url: '/portfolio',
        order: 3,
        isActive: true,
      },
      {
        title: 'בלוג',
        url: '/blog',
        order: 4,
        isActive: true,
      },
      {
        title: 'אודות',
        url: '/about',
        order: 5,
        isActive: true,
      },
      {
        title: 'צור קשר',
        url: '/contact',
        order: 6,
        isActive: true,
      },
    ];

    for (const itemData of menuItems) {
      const existingItem = await prisma.menuItem.findFirst({
        where: { 
          menuId: mainMenu.id,
          title: itemData.title 
        }
      });
      
      if (!existingItem) {
        await prisma.menuItem.create({
          data: {
            ...itemData,
            menuId: mainMenu.id,
          },
        });
      }
    }

    console.log('✅ פריטי תפריט ראשוניים נוצרו בהצלחה');

    console.log('🎉 כל ההגדרות הראשוניות נוצרו בהצלחה!');

  } catch (error) {
    console.error('שגיאה ביצירת הגדרות ראשוניות:', error);
  } finally {
    await prisma.$disconnect();
  }
}

initSiteSettings(); 