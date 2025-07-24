'use client';

import ServiceLayout from '../../components/ServiceLayout';
import { FaLaptopCode, FaMobileAlt, FaTachometerAlt } from 'react-icons/fa';

export default function WebDevelopmentPage() {
  return (
    <ServiceLayout
      title="פיתוח אתרים"
      subtitle="אתרים מקצועיים ומותאמים אישית"
      description="אנו מתמחים בפיתוח אתרים מודרניים ומותאמים אישית לצרכי העסק שלך. הצוות המקצועי שלנו משלב טכנולוגיות מתקדמות עם עיצוב מרהיב להשגת התוצאות הטובות ביותר."
      heroImage="/images/services/web-development-hero.jpg"
      features={[
        {
          icon: FaLaptopCode,
          title: 'עיצוב מותאם',
          description: 'עיצוב מודרני ומרשים'
        },
        {
          icon: FaMobileAlt,
          title: 'רספונסיביות',
          description: 'התאמה לכל המכשירים'
        },
        {
          icon: FaTachometerAlt,
          title: 'ביצועים',
          description: 'מהירות טעינה גבוהה'
        }
      ]}
      benefits={[
        'עיצוב מותאם אישית',
        'תאימות לכל המכשירים',
        'אופטימיזציה למנועי חיפוש',
        'מהירות טעינה גבוהה',
        'אבטחה מתקדמת',
        'תמיכה טכנית'
      ]}
      process={[
        {
          title: 'אפיון',
          description: 'הגדרת צרכים ומטרות'
        },
        {
          title: 'עיצוב',
          description: 'יצירת מראה ייחודי'
        },
        {
          title: 'פיתוח',
          description: 'בניית האתר'
        },
        {
          title: 'השקה',
          description: 'העלאה לאוויר'
        }
      ]}
      faq={[
        {
          question: 'כמה זמן לוקח לבנות אתר?',
          answer: 'זמן הפיתוח תלוי בהיקף ומורכבות האתר. נוכל לתת הערכה מדויקת לאחר פגישת אפיון.'
        },
        {
          question: 'האם האתר יהיה מותאם לנייד?',
          answer: 'כן, כל האתרים שלנו מפותחים בגישת Mobile First ומותאמים לכל סוגי המכשירים.'
        },
        {
          question: 'האם אתם מספקים אחסון לאתר?',
          answer: 'כן, אנחנו מציעים חבילות אחסון מאובטחות ומהירות כולל גיבוי יומי.'
        }
      ]}
      portfolio={[
        {
          image: '/images/portfolio/web1.jpg',
          title: 'אתר תדמית',
          description: 'פיתוח אתר תדמית מודרני לעסק',
          link: '#'
        },
        {
          image: '/images/portfolio/web2.jpg',
          title: 'אתר חנות',
          description: 'בניית חנות אונליין עם מערכת ניהול',
          link: '#'
        },
        {
          image: '/images/portfolio/web3.jpg',
          title: 'אתר קטלוג',
          description: 'פיתוח אתר קטלוג להצגת מוצרים',
          link: '#'
        }
      ]}
      testimonials={[
        {
          quote: "האתר החדש שלנו נראה מדהים ומביא הרבה יותר פניות! תודה על שירות מקצועי.",
          author: "אורית לוי",
          company: "לוי פתרונות דיגיטליים"
        },
        {
          quote: "הצוות היה זמין, מקצועי והפך את התהליך לפשוט ומהיר.",
          author: "דני כהן",
          company: "דיגיטל ביזנס"
        }
      ]}
    />
  );
} 