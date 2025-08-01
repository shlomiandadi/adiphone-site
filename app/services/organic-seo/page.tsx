'use client';

import ServiceLayout from '../../components/ServiceLayout';
import { FaChartLine, FaLightbulb, FaRobot } from 'react-icons/fa';

export default function OrganicSeoPage() {
  return (
    <ServiceLayout
      title="קידום אורגני"
      subtitle="קידום אתרים בגוגל בשיטות אורגניות"
      serviceType="seo"
      description="אנו מתמחים בקידום אתרים אורגני בגוגל, תוך שימוש בשיטות עבודה מתקדמות ואסטרטגיות SEO מוכחות. הצוות המקצועי שלנו מביא ניסיון עשיר בהעלאת אתרים לעמודים הראשונים בגוגל."
      heroImage="/images/services/organic-seo-hero.jpg"
      features={[
        {
          icon: FaChartLine,
          title: 'תוצאות מוכחות',
          description: 'שיפור דירוג בתוצאות החיפוש'
        },
        {
          icon: FaLightbulb,
          title: 'אסטרטגיה חכמה',
          description: 'תכנון וביצוע מותאם אישית'
        },
        {
          icon: FaRobot,
          title: 'כלים מתקדמים',
          description: 'שימוש בכלי SEO מובילים'
        }
      ]}
      benefits={[
        'ניתוח מתחרים מעמיק',
        'אופטימיזציה טכנית מקיפה',
        'בניית תוכן איכותי',
        'בניית קישורים חזקים',
        'מעקב וניתוח תוצאות',
        'דוחות ביצועים חודשיים'
      ]}
      process={[
        {
          title: 'אבחון ראשוני',
          description: 'ניתוח מצב קיים ומתחרים'
        },
        {
          title: 'בניית אסטרטגיה',
          description: 'תכנון תהליך הקידום'
        },
        {
          title: 'אופטימיזציה',
          description: 'יישום שינויים ושיפורים'
        },
        {
          title: 'מעקב ודיווח',
          description: 'ניטור תוצאות ועדכון'
        }
      ]}
      faq={[
        {
          question: 'כמה זמן לוקח לראות תוצאות בקידום אורגני?',
          answer: 'תהליך הקידום האורגני הוא הדרגתי. בדרך כלל רואים שיפור משמעותי תוך 3-6 חודשים.'
        },
        {
          question: 'האם אתם מתחייבים לתוצאות?',
          answer: 'אנחנו לא מתחייבים למיקומים ספציפיים, אבל כן מתחייבים לעבודה מקצועית ושקופה.'
        },
        {
          question: 'האם אתם משתמשים בשיטות עבודה לגיטימיות?',
          answer: 'כן, אנחנו עובדים רק בשיטות White Hat שעומדות בהנחיות גוגל.'
        }
      ]}
      portfolio={[
        {
          image: '/images/portfolio/seo1.jpg',
          title: 'קידום אתר תדמית',
          description: 'העלאת אתר לעמוד הראשון בגוגל',
          link: '#'
        },
        {
          image: '/images/portfolio/seo2.jpg',
          title: 'קידום חנות אונליין',
          description: 'שיפור תנועת גולשים והמרות',
          link: '#'
        },
        {
          image: '/images/portfolio/seo3.jpg',
          title: 'קידום לוקאלי',
          description: 'קידום עסקים מקומיים בגוגל',
          link: '#'
        }
      ]}
      testimonials={[
        {
          quote: "הקידום האורגני העלה אותנו לעמוד הראשון בגוגל תוך חודשים ספורים! צוות מקצועי ושירות מעולה.",
          author: "נועה כהן",
          company: "סטודיו עיצוב גרפי"
        },
        {
          quote: "הצלחנו להגדיל את כמות הפניות מהאתר פי 3 בזכות העבודה שלכם!",
          author: "אורן ברק",
          company: "ברק פתרונות דיגיטליים"
        }
      ]}
    />
  );
} 