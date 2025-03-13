import type { Metadata } from 'next';
import ServiceLayout from '../../components/ServiceLayout';

export const metadata: Metadata = {
  title: 'קידום אורגני - WebStudio',
  description: 'קידום אורגני מקצועי לאתרי אינטרנט',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#2563eb',
};

export default function OrganicSeoPage() {
  return (
    <ServiceLayout
      title="קידום אורגני"
      subtitle="קידום אתרים בגוגל בשיטות אורגניות"
      description="אנו מתמחים בקידום אתרים אורגני בגוגל, תוך שימוש בשיטות עבודה מתקדמות ואסטרטגיות SEO מוכחות. הצוות המקצועי שלנו מביא ניסיון עשיר בהעלאת אתרים לעמודים הראשונים בגוגל."
      heroImage="/images/services/organic-seo-hero.jpg"
      features={[
        {
          icon: 'chart-line',
          title: 'תוצאות מוכחות',
          description: 'שיפור דירוג בתוצאות החיפוש'
        },
        {
          icon: 'lightbulb',
          title: 'אסטרטגיה חכמה',
          description: 'תכנון וביצוע מותאם אישית'
        },
        {
          icon: 'robot',
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
        '/images/portfolio/seo1.jpg',
        '/images/portfolio/seo2.jpg',
        '/images/portfolio/seo3.jpg'
      ]}
    />
  );
} 