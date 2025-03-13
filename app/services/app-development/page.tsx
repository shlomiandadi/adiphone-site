import type { Metadata } from 'next';
import ServiceLayout from '../../components/ServiceLayout';

export const metadata: Metadata = {
  title: 'פיתוח אפליקציות - WebStudio',
  description: 'פיתוח אפליקציות מובייל ווב מתקדמות',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#2563eb',
};

const appDevelopmentContent = `
<h2>פיתוח אפליקציות מתקדם</h2>
<p>אנו מתמחים בפיתוח אפליקציות מובייל ווב חדשניות ומותאמות אישית. הצוות שלנו משלב מומחיות טכנית עם הבנה עמוקה של צרכי המשתמש.</p>

<h3>סוגי האפליקציות</h3>
<ul>
  <li>אפליקציות iOS ו-Android</li>
  <li>אפליקציות ווב מתקדמות</li>
  <li>אפליקציות היברידיות</li>
  <li>Progressive Web Apps (PWA)</li>
  <li>אפליקציות ארגוניות</li>
</ul>

<h3>הטכנולוגיות שלנו</h3>
<p>אנו משתמשים בטכנולוגיות המובילות בתעשייה:</p>
<ul>
  <li>React Native לפיתוח חוצה פלטפורמות</li>
  <li>Swift ו-Kotlin לפיתוח נייטיב</li>
  <li>Flutter לאפליקציות היברידיות</li>
  <li>Firebase לתשתיות ענן</li>
  <li>GraphQL לממשקי API מתקדמים</li>
</ul>

<h3>היתרונות שלנו</h3>
<p>למה לבחור בנו לפיתוח האפליקציה שלך?</p>
<ul>
  <li>ניסיון רב בפיתוח אפליקציות</li>
  <li>דגש על חווית משתמש מעולה</li>
  <li>קוד איכותי ונקי</li>
  <li>תמיכה ותחזוקה שוטפת</li>
  <li>אבטחת מידע ברמה גבוהה</li>
</ul>`;

export default function AppDevelopmentPage() {
  return (
    <ServiceLayout
      title="פיתוח אפליקציות"
      subtitle="פתרונות תוכנה מתקדמים לעסקים"
      description="אנו מתמחים בפיתוח אפליקציות מובייל ווב מתקדמות, תוך שימוש בטכנולוגיות החדשניות ביותר. הצוות המקצועי שלנו מביא ניסיון עשיר בפיתוח פתרונות תוכנה מותאמים אישית לצרכי הלקוח."
      heroImage="/images/services/app-development-hero.jpg"
      features={[
        {
          icon: 'rocket',
          title: 'פיתוח מהיר',
          description: 'זמני פיתוח קצרים ויעילים'
        },
        {
          icon: 'cog',
          title: 'טכנולוגיה מתקדמת',
          description: 'שימוש בטכנולוגיות החדשניות ביותר'
        },
        {
          icon: 'users',
          title: 'ממשק משתמש מעולה',
          description: 'חווית משתמש אינטואיטיבית ונוחה'
        }
      ]}
      benefits={[
        'פיתוח מותאם אישית לצרכי העסק',
        'תמיכה טכנית מקצועית',
        'אבטחת מידע ברמה הגבוהה ביותר',
        'עיצוב מודרני ואינטואיטיבי',
        'אינטגרציה עם מערכות קיימות',
        'תחזוקה שוטפת ועדכונים'
      ]}
      process={[
        {
          title: 'אפיון',
          description: 'הגדרת דרישות ואפיון מפורט'
        },
        {
          title: 'עיצוב',
          description: 'עיצוב ממשק משתמש ו-UX'
        },
        {
          title: 'פיתוח',
          description: 'פיתוח האפליקציה ובדיקות'
        },
        {
          title: 'השקה',
          description: 'העלאה לאוויר ותמיכה שוטפת'
        }
      ]}
      faq={[
        {
          question: 'כמה זמן לוקח לפתח אפליקציה?',
          answer: 'זמן הפיתוח תלוי במורכבות האפליקציה. בממוצע, פיתוח אפליקציה בסיסית לוקח 2-3 חודשים.'
        },
        {
          question: 'האם אתם מפתחים גם לאייפון וגם לאנדרואיד?',
          answer: 'כן, אנחנו מפתחים אפליקציות היברידיות שעובדות על שתי הפלטפורמות.'
        },
        {
          question: 'האם אתם מספקים תמיכה לאחר ההשקה?',
          answer: 'כן, אנחנו מציעים חבילות תחזוקה ותמיכה שוטפת לכל האפליקציות שלנו.'
        }
      ]}
      portfolio={[
        '/images/portfolio/app1.jpg',
        '/images/portfolio/app2.jpg',
        '/images/portfolio/app3.jpg'
      ]}
    />
  );
} 