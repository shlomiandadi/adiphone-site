import type { Metadata } from 'next';
import ServiceLayout from '../../components/ServiceLayout';

export const metadata: Metadata = {
  title: 'פיתוח תוכנה - WebStudio',
  description: 'פיתוח תוכנה מותאם אישית לעסקים',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#2563eb',
};

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
          icon: 'code',
          title: 'פיתוח מתקדם',
          description: 'שימוש בטכנולוגיות חדישות'
        },
        {
          icon: 'mobile',
          title: 'חווית משתמש',
          description: 'ממשק נוח ואינטואיטיבי'
        },
        {
          icon: 'shield',
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
        '/images/portfolio/software1.jpg',
        '/images/portfolio/software2.jpg',
        '/images/portfolio/software3.jpg'
      ]}
    />
  );
} 