'use client';

import ServiceLayout from '../../components/ServiceLayout';
import { FaCode, FaMobileAlt, FaShieldAlt } from 'react-icons/fa';

const softwareDevelopmentContent = `
<h2>פיתוח תוכנה מתקדם</h2>
<p>אנו מתמחים בפיתוח פתרונות תוכנה מתקדמים ומותאמים אישית לצרכי העסק שלך. הצוות המקצועי שלנו משלב ניסיון עשיר עם טכנולוגיות חדשניות.</p>

<h3>הפתרונות שלנו</h3>
<ul>
  <li>פיתוח מערכות ארגוניות</li>
  <li>אוטומציה ותהליכים עסקיים</li>
  <li>אינטגרציה עם מערכות קיימות</li>
  <li>פתרונות ענן מתקדמים</li>
  <li>מערכות ניהול תוכן</li>
</ul>

<h3>הטכנולוגיות שלנו</h3>
<p>אנו עובדים עם הטכנולוגיות המובילות בתעשייה:</p>
<ul>
  <li>Node.js ו-Python לפיתוח צד שרת</li>
  <li>React ו-Angular לממשקי משתמש</li>
  <li>MongoDB ו-PostgreSQL למסדי נתונים</li>
  <li>Docker וכלי ענן מתקדמים</li>
  <li>CI/CD לפריסה אוטומטית</li>
</ul>

<h3>תהליך העבודה</h3>
<p>תהליך הפיתוח שלנו מובנה ושקוף:</p>
<ul>
  <li>אפיון דרישות מפורט</li>
  <li>תכנון ארכיטקטורה</li>
  <li>פיתוח בשלבים</li>
  <li>בדיקות איכות קפדניות</li>
  <li>תחזוקה ותמיכה שוטפת</li>
</ul>`;

export default function SoftwareDevelopmentPage() {
  return (
    <ServiceLayout
      title="פיתוח תוכנה"
      subtitle="פתרונות תוכנה מותאמים אישית לעסקים"
      description="אנו מתמחים בפיתוח פתרונות תוכנה מתקדמים ומותאמים אישית לצרכי הלקוח. הצוות המקצועי שלנו משלב ידע טכנולוגי עמוק עם הבנה עסקית להשגת התוצאות הטובות ביותר."
      heroImage="/images/services/software-development-hero.jpg"
      features={[
        {
          icon: FaCode,
          title: 'פיתוח מתקדם',
          description: 'שימוש בטכנולוגיות חדישות'
        },
        {
          icon: FaMobileAlt,
          title: 'חווית משתמש',
          description: 'ממשק נוח ואינטואיטיבי'
        },
        {
          icon: FaShieldAlt,
          title: 'אבטחת מידע',
          description: 'הגנה מקסימלית על המידע'
        }
      ]}
      benefits={[
        'פתרונות מותאמים אישית',
        'טכנולוגיות מתקדמות',
        'תמיכה טכנית מלאה',
        'אבטחת מידע גבוהה',
        'ממשק משתמש נוח',
        'תחזוקה שוטפת'
      ]}
      process={[
        {
          title: 'אפיון',
          description: 'הגדרת דרישות ומטרות'
        },
        {
          title: 'תכנון',
          description: 'עיצוב ארכיטקטורה'
        },
        {
          title: 'פיתוח',
          description: 'יישום הפתרון'
        },
        {
          title: 'בדיקות',
          description: 'בקרת איכות מקיפה'
        }
      ]}
      faq={[
        {
          question: 'כמה זמן לוקח לפתח מערכת?',
          answer: 'זמן הפיתוח תלוי בהיקף ומורכבות הפרויקט. נוכל לתת הערכה מדויקת לאחר פגישת אפיון.'
        },
        {
          question: 'האם אתם מספקים תמיכה לאחר השקת המערכת?',
          answer: 'כן, אנחנו מציעים חבילות תמיכה ותחזוקה שוטפת למערכות שפיתחנו.'
        },
        {
          question: 'באילו טכנולוגיות אתם משתמשים?',
          answer: 'אנחנו עובדים עם מגוון טכנולוגיות מתקדמות כולל Node.js, React, Python, ועוד.'
        }
      ]}
      portfolio={[
        {
          image: '/images/portfolio/software1.jpg',
          title: 'מערכת ניהול לקוחות',
          description: 'פיתוח מערכת CRM מותאמת אישית',
          link: '#'
        },
        {
          image: '/images/portfolio/software2.jpg',
          title: 'מערכת אוטומציה',
          description: 'אוטומציה של תהליכים עסקיים',
          link: '#'
        },
        {
          image: '/images/portfolio/software3.jpg',
          title: 'פיתוח API',
          description: 'פיתוח ממשקי API מתקדמים',
          link: '#'
        }
      ]}
      testimonials={[
        {
          quote: "פיתוח התוכנה היה מקצועי, מהיר ומותאם בדיוק לצרכים שלנו. ממליץ בחום!",
          author: "יוסי מזרחי",
          company: "מזרחי מערכות"
        },
        {
          quote: "הצוות היה זמין לכל שאלה והפיתוח היה ברמה גבוהה.",
          author: "דנה כהן",
          company: "דיגיטל פתרונות"
        }
      ]}
    />
  );
} 