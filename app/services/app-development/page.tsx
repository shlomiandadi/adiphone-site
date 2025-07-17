'use client';

import ServiceLayout from '../../components/ServiceLayout';
import { FaRocket, FaCode, FaMobileAlt, FaShieldAlt } from 'react-icons/fa';

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
          title: 'פיתוח מהיר',
          description: 'זמני פיתוח קצרים ויעילים',
          icon: FaRocket
        },
        {
          title: 'קוד איכותי',
          description: 'פיתוח בסטנדרטים הגבוהים ביותר',
          icon: FaCode
        },
        {
          title: 'Cross-Platform',
          description: 'פיתוח לכל הפלטפורמות',
          icon: FaMobileAlt
        },
        {
          title: 'אבטחה מתקדמת',
          description: 'אבטחת מידע ברמה הגבוהה ביותר',
          icon: FaShieldAlt
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
        {
          image: '/images/portfolio/app1.jpg',
          title: 'אפליקציית מסחר',
          description: 'אפליקציה לחנות אונליין',
          link: '#'
        },
        {
          image: '/images/portfolio/app2.jpg',
          title: 'אפליקציית שירות',
          description: 'אפליקציה לשירות לקוחות',
          link: '#'
        },
        {
          image: '/images/portfolio/app3.jpg',
          title: 'אפליקציית ניהול',
          description: 'אפליקציה לניהול עסקי',
          link: '#'
        }
      ]}
      testimonials={[
        {
          quote: "האפליקציה שפיתחתם לנו העלתה את רמת השירות ללקוחות והפכה את התהליך לאוטומטי ופשוט.",
          author: "דנה ישראלי",
          company: "חברת פתרונות דיגיטליים"
        },
        {
          quote: "הצוות היה מקצועי, מהיר וזמין לכל שאלה. ממליץ בחום!",
          author: "יוסי כהן",
          company: "י.ק אפליקציות"
        }
      ]}
    />
  );
} 