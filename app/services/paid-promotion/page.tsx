'use client';

import ServiceLayout from '../../components/ServiceLayout';
import { FaChartLine, FaUsers, FaLightbulb } from 'react-icons/fa';

export default function PaidPromotionPage() {
  return (
    <ServiceLayout
      title="קידום ממומן"
      subtitle="ניהול קמפיינים ממומנים בגוגל ופייסבוק"
      description="אנו מתמחים בניהול קמפיינים ממומנים בפלטפורמות המובילות, תוך שימוש בכלים מתקדמים ואסטרטגיות פרסום מוכחות. הצוות המקצועי שלנו מביא ניסיון עשיר בניהול תקציבי פרסום ומקסום החזר השקעה."
      heroImage="/images/services/paid-promotion-hero.jpg"
      features={[
        {
          icon: FaChartLine,
          title: 'ROI מקסימלי',
          description: 'מיקסום החזר ההשקעה בפרסום'
        },
        {
          icon: FaUsers,
          title: 'קהל יעד ממוקד',
          description: 'פילוח מדויק של קהל המטרה'
        },
        {
          icon: FaLightbulb,
          title: 'אסטרטגיה חכמה',
          description: 'תכנון וביצוע מותאם אישית'
        }
      ]}
      benefits={[
        'ניתוח מתחרים מעמיק',
        'פילוח קהל יעד מדויק',
        'אופטימיזציה מתמדת',
        'דיווח שקוף ומפורט',
        'מעקב אחר ביצועים',
        'התאמה לתקציב'
      ]}
      process={[
        {
          title: 'אפיון צרכים',
          description: 'הגדרת מטרות ויעדים'
        },
        {
          title: 'מחקר שוק',
          description: 'ניתוח מתחרים וקהלי יעד'
        },
        {
          title: 'בניית קמפיין',
          description: 'עיצוב מודעות ותקציב'
        },
        {
          title: 'אופטימיזציה',
          description: 'שיפור ביצועים מתמיד'
        }
      ]}
      faq={[
        {
          question: 'כמה זמן לוקח לראות תוצאות?',
          answer: 'בקמפיינים ממומנים ניתן לראות תוצאות כבר מהיום הראשון, אך נדרש זמן לאופטימיזציה מלאה.'
        },
        {
          question: 'מה התקציב המינימלי הנדרש?',
          answer: 'התקציב המינימלי תלוי בתחום ובמטרות. אנחנו נבנה תכנית המותאמת לתקציב שלך.'
        },
        {
          question: 'באילו פלטפורמות אתם מפרסמים?',
          answer: 'אנחנו מתמחים בפרסום בגוגל, פייסבוק, אינסטגרם ולינקדאין.'
        }
      ]}
      portfolio={[
        '/images/portfolio/ads1.jpg',
        '/images/portfolio/ads2.jpg',
        '/images/portfolio/ads3.jpg'
      ]}
    />
  );
}