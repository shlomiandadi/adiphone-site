'use client';

import type { Metadata } from 'next';
import ServiceLayout from '../../components/ServiceLayout';
import Link from 'next/link';
import { FaMobileAlt, FaRocket, FaCode, FaTools, FaPaintBrush, FaBolt, FaShieldAlt } from 'react-icons/fa';

export default function MobileAppService() {
  const serviceData = {
    title: "פיתוח אפליקציות",
    subtitle: "אפליקציות מובייל חדשניות ומותאמות אישית",
    description: `אנחנו מתמחים בפיתוח אפליקציות מובייל מתקדמות לעסקים וארגונים. הצוות שלנו משלב מומחיות טכנית עם הבנה עסקית עמוקה כדי ליצור אפליקציות שמביאות ערך אמיתי ללקוחות שלכם.

    אנחנו מפתחים אפליקציות native ל-iOS ו-Android, וכן אפליקציות היברידיות באמצעות טכנולוגיות כמו React Native ו-Flutter. הגישה שלנו מבטיחה ביצועים מעולים, חווית משתמש מצוינת, ותאימות מלאה לכל הפלטפורמות.
    
    הפיתוח כולל תכנון UI/UX מדויק, אינטגרציה עם מערכות קיימות, אבטחת מידע ברמה הגבוהה ביותר, ותמיכה טכנית מתמשכת. אנחנו מלווים אתכם משלב הרעיון ועד להשקה ומעבר לה.
    
    בנוסף לפיתוח האפליקציה עצמה, אנחנו מציעים שירותי תחזוקה, עדכונים, ואופטימיזציה מתמשכת כדי להבטיח שהאפליקציה שלכם תישאר רלוונטית ויעילה לאורך זמן.`,
    heroImage: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1200",
    features: [
      {
        title: "פיתוח מותאם",
        description: "פיתוח אפליקציות מותאמות אישית לצרכים שלכם",
        icon: FaMobileAlt
      },
      {
        title: "ביצועים מעולים",
        description: "אפליקציות מהירות עם חווית משתמש מעולה",
        icon: FaRocket
      },
      {
        title: "קוד איכותי",
        description: "פיתוח בסטנדרטים הגבוהים ביותר",
        icon: FaCode
      },
      {
        title: "תחזוקה ותמיכה",
        description: "תמיכה טכנית ועדכונים שוטפים",
        icon: FaTools
      }
    ],
    benefits: [
      "חיסכון של 40%-60% בעלויות פיתוח בהשוואה לפיתוח נפרד ל-iOS ו-Android",
      "זמן פיתוח מהיר יותר והשקה מהירה לשוק",
      "חווית משתמש אחידה בכל הפלטפורמות",
      "תחזוקה פשוטה יותר ועדכונים מהירים",
      "ביצועים מעולים הקרובים לאפליקציות Native",
      "גמישות מקסימלית בהתאמות ושינויים"
    ],
    process: [
      {
        title: "אפיון ותכנון",
        description: "ניתוח דרישות מעמיק ותכנון ארכיטקטורה"
      },
      {
        title: "עיצוב ו-UX",
        description: "עיצוב חווית משתמש ועיצוב ויזואלי"
      },
      {
        title: "פיתוח ובדיקות",
        description: "פיתוח איטרטיבי עם בדיקות מקיפות"
      },
      {
        title: "השקה ותמיכה",
        description: "העלאה לחנויות ותמיכה מתמשכת"
      }
    ],
    faq: [
      {
        question: "כמה זמן לוקח לפתח אפליקציה?",
        answer: "זמן הפיתוח תלוי במורכבות האפליקציה. אפליקציה בסיסית יכולה להיות מוכנה תוך 2-3 חודשים, בעוד שאפליקציה מורכבת עם פיצ'רים מתקדמים עשויה לקחת 4-6 חודשים או יותר. אנחנו עובדים בשיטה איטרטיבית שמאפשרת לראות תוצאות ולקבל גרסה ראשונית מהר יחסית."
      },
      {
        question: "האם האפליקציה תעבוד באותה צורה על iOS ו-Android?",
        answer: "כן, בזכות השימוש בטכנולוגיות Cross-Platform מתקדמות, האפליקציה תספק חווית משתמש עקבית בשתי הפלטפורמות, תוך שמירה על העיצוב והפונקציונליות הייחודיים לכל פלטפורמה. אנו מקפידים על עמידה בהנחיות העיצוב של Apple ו-Google."
      },
      {
        question: "איך מבטיחים את אבטחת המידע באפליקציה?",
        answer: "אנו מיישמים שכבות אבטחה מרובות הכוללות: הצפנת נתונים ב-transit ובאחסון, אימות משתמשים מאובטח, הגנה מפני התקפות נפוצות, ועמידה בתקני אבטחה מחמירים. כמו כן, אנו מבצעים בדיקות אבטחה שוטפות ומעדכנים את מערכות האבטחה באופן קבוע."
      },
      {
        question: "האם אתם מספקים תמיכה לאחר ההשקה?",
        answer: "כן, אנו מציעים חבילות תמיכה ותחזוקה הכוללות: ניטור ביצועים, תיקון באגים, עדכוני אבטחה, התאמות לגרסאות OS חדשות, וסיוע בהטמעת פיצ'רים חדשים. אנו מלווים את הלקוחות שלנו לטווח ארוך ומבטיחים את הצלחת האפליקציה גם לאחר ההשקה."
      }
    ],
    portfolio: [
      {
        image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800',
        title: 'אפליקציית מסחר',
        description: 'פיתוח אפליקציה לחנות אונליין',
        link: '#'
      },
      {
        image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800',
        title: 'אפליקציית שירות',
        description: 'אפליקציה לשירות לקוחות',
        link: '#'
      },
      {
        image: 'https://images.unsplash.com/photo-1573867639040-6dd25fa5f597?w=800',
        title: 'אפליקציית ניהול',
        description: 'פיתוח אפליקציה לניהול עסקי',
        link: '#'
      }
    ],
    testimonials: [
      {
        quote: "האפליקציה שפיתחתם לנו שינתה את כל חווית השירות ללקוחות. ממליץ בחום!",
        author: "רועי לוי",
        company: "לוי פתרונות מובייל"
      }
    ]
  };

  return <ServiceLayout {...serviceData} />;
} 