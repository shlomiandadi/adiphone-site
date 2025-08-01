const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createDefaultTemplates() {
  try {
    console.log('יוצר תבניות מוכנות...');

    // תבנית דף שירותים
    const serviceTemplate = await prisma.template.create({
      data: {
        name: 'תבנית דף שירותים',
        description: 'תבנית מלאה לדף שירותים עם כל הסקשנים הנדרשים',
        sections: {
          create: [
            {
              type: 'hero',
              title: 'באנר עליון',
              content: {
                title: 'כותרת השירות',
                subtitle: 'תיאור קצר של השירות',
                backgroundImage: '/images/services/hero-bg.jpg',
                buttonText: 'צור קשר',
                buttonLink: '/contact'
              },
              order: 0
            },
            {
              type: 'content',
              title: 'תוכן עיקרי',
              content: {
                title: 'על השירות',
                content: '<p>תוכן מפורט על השירות עם אפשרות לעריכת HTML מלאה.</p><h2>כותרת משנה</h2><p>פסקה נוספת עם <strong>טקסט מודגש</strong> ו<a href="#">קישורים</a>.</p>',
                showTableOfContents: true
              },
              order: 1
            },
            {
              type: 'features',
              title: 'יתרונות השירות',
              content: {
                title: 'למה לבחור בנו?',
                features: [
                  {
                    title: 'איכות גבוהה',
                    description: 'אנו מספקים שירות באיכות הגבוהה ביותר',
                    icon: 'star',
                    color: 'blue'
                  },
                  {
                    title: 'מחיר משתלם',
                    description: 'מחירים תחרותיים עם ערך מוסף',
                    icon: 'check',
                    color: 'green'
                  },
                  {
                    title: 'תמיכה 24/7',
                    description: 'תמיכה מלאה בכל שעות היום',
                    icon: 'heart',
                    color: 'red'
                  }
                ]
              },
              order: 2
            },
            {
              type: 'process',
              title: 'תהליך העבודה',
              content: {
                title: 'איך זה עובד?',
                steps: [
                  {
                    number: 1,
                    title: 'פגישת ייעוץ',
                    description: 'נפגש לשיחת היכרות ונבין את הצרכים'
                  },
                  {
                    number: 2,
                    title: 'אפיון ותכנון',
                    description: 'נגבש אסטרטגיה מותאמת אישית'
                  },
                  {
                    number: 3,
                    title: 'פיתוח ועיצוב',
                    description: 'נפתח ונעצב את הפתרון המושלם'
                  },
                  {
                    number: 4,
                    title: 'השקה וליווי',
                    description: 'נשיק את הפרויקט ונלווה אותך'
                  }
                ]
              },
              order: 3
            },
            {
              type: 'pricing',
              title: 'מחירון',
              content: {
                title: 'החבילות שלנו',
                plans: [
                  {
                    name: 'חבילה בסיסית',
                    price: '₪999',
                    period: 'חודש',
                    features: ['תכונה 1', 'תכונה 2', 'תכונה 3'],
                    popular: false,
                    color: 'blue'
                  },
                  {
                    name: 'חבילה מתקדמת',
                    price: '₪1,999',
                    period: 'חודש',
                    features: ['כל התכונות הבסיסיות', 'תכונה 4', 'תכונה 5', 'תכונה 6'],
                    popular: true,
                    color: 'green'
                  },
                  {
                    name: 'חבילה פרימיום',
                    price: '₪2,999',
                    period: 'חודש',
                    features: ['כל התכונות המתקדמות', 'תכונה 7', 'תכונה 8', 'תכונה 9'],
                    popular: false,
                    color: 'purple'
                  }
                ]
              },
              order: 4
            },
            {
              type: 'faq',
              title: 'שאלות נפוצות',
              content: {
                title: 'שאלות נפוצות',
                questions: [
                  {
                    question: 'כמה זמן לוקח להשלים פרויקט?',
                    answer: 'זמן ההשלמה תלוי בגודל הפרויקט ומורכבותו. בדרך כלל בין 2-8 שבועות.'
                  },
                  {
                    question: 'האם אתם מספקים תמיכה לאחר ההשקה?',
                    answer: 'כן, אנו מספקים תמיכה מלאה למשך 3 חודשים לאחר ההשקה.'
                  },
                  {
                    question: 'האם אפשר לערוך את התוכן בעצמי?',
                    answer: 'כן, אנו מספקים מערכת ניהול תוכן ידידותית לעריכה עצמית.'
                  }
                ]
              },
              order: 5
            },
            {
              type: 'cta',
              title: 'קריאה לפעולה',
              content: {
                title: 'מוכנים להתחיל?',
                subtitle: 'צרו איתנו קשר ונחזור אליכם בהקדם',
                buttonText: 'צור קשר עכשיו',
                buttonLink: '/contact',
                backgroundColor: 'blue'
              },
              order: 6
            }
          ]
        }
      }
    });

    // תבנית דף אודות
    const aboutTemplate = await prisma.template.create({
      data: {
        name: 'תבנית דף אודות',
        description: 'תבנית מלאה לדף אודות עם מידע על החברה והצוות',
        sections: {
          create: [
            {
              type: 'hero',
              title: 'באנר עליון',
              content: {
                title: 'אודות החברה',
                subtitle: 'למדו על ההיסטוריה, החזון והערכים שלנו',
                backgroundImage: '/images/about/hero-bg.jpg',
                buttonText: 'צור קשר',
                buttonLink: '/contact'
              },
              order: 0
            },
            {
              type: 'content',
              title: 'תוכן עיקרי',
              content: {
                title: 'הסיפור שלנו',
                content: '<p>אנחנו חברה המתמחה בפיתוח פתרונות דיגיטליים מתקדמים.</p><h2>החזון שלנו</h2><p>לספק פתרונות חדשניים ואיכותיים לכל לקוח.</p>',
                showTableOfContents: true
              },
              order: 1
            },
            {
              type: 'benefits',
              title: 'היתרונות שלנו',
              content: {
                title: 'למה לבחור בנו?',
                benefits: [
                  {
                    title: 'ניסיון עשיר',
                    description: 'מעל 10 שנות ניסיון בתעשייה',
                    icon: 'star'
                  },
                  {
                    title: 'צוות מקצועי',
                    description: 'צוות מומחים בתחומים שונים',
                    icon: 'crown'
                  },
                  {
                    title: 'שירות אישי',
                    description: 'ליווי אישי לכל לקוח',
                    icon: 'heart'
                  }
                ]
              },
              order: 2
            },
            {
              type: 'testimonials',
              title: 'המלצות לקוחות',
              content: {
                title: 'מה הלקוחות אומרים',
                testimonials: [
                  {
                    name: 'דנה כהן',
                    role: 'מנכ"לית, דיגיטל פלוס',
                    content: 'עדי פון תקשורת עזרו לנו להגדיל את התנועה לאתר שלנו ב-300% תוך 6 חודשים.',
                    image: '/images/testimonials/dana.svg',
                    rating: 5
                  },
                  {
                    name: 'יוסי לוי',
                    role: 'בעלים, חנות אונליין',
                    content: 'האתר החדש שהבנו איתם נראה מדהים ומביא לנו הרבה יותר המרות.',
                    image: '/images/testimonials/yossi.svg',
                    rating: 5
                  }
                ]
              },
              order: 3
            },
            {
              type: 'cta',
              title: 'קריאה לפעולה',
              content: {
                title: 'רוצים לעבוד איתנו?',
                subtitle: 'צרו איתנו קשר ונשמח לעזור לכם',
                buttonText: 'צור קשר',
                buttonLink: '/contact',
                backgroundColor: 'blue'
              },
              order: 4
            }
          ]
        }
      }
    });

    // תבנית דף נחיתה
    const landingTemplate = await prisma.template.create({
      data: {
        name: 'תבנית דף נחיתה',
        description: 'תבנית מלאה לדף נחיתה עם כל הסקשנים הנדרשים',
        sections: {
          create: [
            {
              type: 'hero',
              title: 'באנר עליון',
              content: {
                title: 'כותרת ראשית',
                subtitle: 'תיאור קצר ומדויק של השירות או המוצר',
                backgroundImage: '/images/landing/hero-bg.jpg',
                buttonText: 'התחל עכשיו',
                buttonLink: '/contact'
              },
              order: 0
            },
            {
              type: 'content',
              title: 'תוכן עיקרי',
              content: {
                title: 'על המוצר/שירות',
                content: '<p>תיאור מפורט על המוצר או השירות שלכם.</p><h2>יתרונות מרכזיים</h2><ul><li>יתרון ראשון</li><li>יתרון שני</li><li>יתרון שלישי</li></ul>',
                showTableOfContents: true
              },
              order: 1
            },
            {
              type: 'features',
              title: 'תכונות מרכזיות',
              content: {
                title: 'מה כלול?',
                features: [
                  {
                    title: 'תכונה 1',
                    description: 'תיאור מפורט של התכונה הראשונה',
                    icon: 'star',
                    color: 'blue'
                  },
                  {
                    title: 'תכונה 2',
                    description: 'תיאור מפורט של התכונה השנייה',
                    icon: 'check',
                    color: 'green'
                  },
                  {
                    title: 'תכונה 3',
                    description: 'תיאור מפורט של התכונה השלישית',
                    icon: 'heart',
                    color: 'red'
                  }
                ]
              },
              order: 2
            },
            {
              type: 'pricing',
              title: 'מחירון',
              content: {
                title: 'בחרו את החבילה המתאימה',
                plans: [
                  {
                    name: 'חבילה בסיסית',
                    price: '₪499',
                    period: 'חודש',
                    features: ['תכונה 1', 'תכונה 2'],
                    popular: false,
                    color: 'blue'
                  },
                  {
                    name: 'חבילה מתקדמת',
                    price: '₪999',
                    period: 'חודש',
                    features: ['כל התכונות הבסיסיות', 'תכונה 3', 'תכונה 4'],
                    popular: true,
                    color: 'green'
                  }
                ]
              },
              order: 3
            },
            {
              type: 'cta',
              title: 'קריאה לפעולה',
              content: {
                title: 'מוכנים להתחיל?',
                subtitle: 'הצטרפו עכשיו וקבלו הטבה מיוחדת',
                buttonText: 'התחל עכשיו',
                buttonLink: '/contact',
                backgroundColor: 'green'
              },
              order: 4
            }
          ]
        }
      }
    });

    console.log('✅ התבניות נוצרו בהצלחה!');
    console.log('📋 תבניות שנוצרו:');
    console.log('- תבנית דף שירותים');
    console.log('- תבנית דף אודות');
    console.log('- תבנית דף נחיתה');

  } catch (error) {
    console.error('❌ שגיאה ביצירת התבניות:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createDefaultTemplates(); 