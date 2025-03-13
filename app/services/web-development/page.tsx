import type { Metadata } from 'next';
import ServiceLayout from '../../components/ServiceLayout';

export const metadata: Metadata = {
  title: 'פיתוח אתרים - WebStudio',
  description: 'פיתוח אתרים מקצועי ומותאם אישית',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#2563eb',
};

const webDevContent = `
<h2>בניית אתרים מקצועית ומותאמת אישית</h2>
<p>אנחנו מתמחים בבניית אתרים מודרניים, מהירים ומותאמים לכל המכשירים. הצוות המקצועי שלנו משלב טכנולוגיות מתקדמות עם עיצוב חדשני כדי ליצור חווית משתמש מושלמת.</p>

<h3>למה לבחור בנו?</h3>
<ul>
  <li>טכנולוגיות מתקדמות ועדכניות</li>
  <li>עיצוב מותאם אישית לצרכי העסק שלך</li>
  <li>ביצועים מהירים ואופטימיזציה מקסימלית</li>
  <li>תמיכה טכנית מקצועית</li>
  <li>אבטחה מתקדמת</li>
</ul>

<h3>הטכנולוגיות שלנו</h3>
<p>אנחנו עובדים עם הטכנולוגיות המובילות בתעשייה:</p>
<ul>
  <li>React ו-Next.js לפיתוח מודרני וביצועים מעולים</li>
  <li>Node.js ו-Python לצד השרת</li>
  <li>MongoDB ו-PostgreSQL למסדי נתונים</li>
  <li>AWS ו-Vercel לאחסון ופריסה</li>
</ul>`;

export default function WebDevelopmentPage() {
  return (
    <ServiceLayout
      title="פיתוח אתרים"
      subtitle="אתרים מקצועיים ומותאמים אישית"
      description="אנו מתמחים בפיתוח אתרים מודרניים ומותאמים אישית לצרכי העסק שלך. הצוות המקצועי שלנו משלב טכנולוגיות מתקדמות עם עיצוב מרהיב להשגת התוצאות הטובות ביותר."
      heroImage="/images/services/web-development-hero.jpg"
      features={[
        {
          icon: 'laptop-code',
          title: 'עיצוב מותאם',
          description: 'עיצוב מודרני ומרשים'
        },
        {
          icon: 'mobile-screen',
          title: 'רספונסיביות',
          description: 'התאמה לכל המכשירים'
        },
        {
          icon: 'gauge-high',
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
        '/images/portfolio/web1.jpg',
        '/images/portfolio/web2.jpg',
        '/images/portfolio/web3.jpg'
      ]}
    />
  );
} 