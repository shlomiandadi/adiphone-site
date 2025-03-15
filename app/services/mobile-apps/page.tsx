'use client';

import ServiceLayout from '../../components/ServiceLayout';
import Link from 'next/link';

export default function MobileAppService() {
  const serviceData = {
    title: "פיתוח אפליקציות",
    subtitle: "פיתוח אפליקציות חדשניות שמשנות את כללי המשחק",
    description: (
      <>
        <p>
          פיתוח אפליקציות מודרניות הוא הרבה יותר מסתם כתיבת קוד - זו אומנות של יצירת חוויות דיגיטליות מרהיבות שמשנות את האופן בו אנשים חיים, עובדים ומתקשרים.
        </p>
        <p>
          הצוות שלנו מתמחה בפיתוח אפליקציות Cross-Platform עבור iOS ו-Android, תוך שימוש בטכנולוגיות המתקדמות ביותר כמו React Native, Flutter ו-Native Development. אנו מקפידים על סטנדרטים גבוהים של קוד נקי, ביצועים מהירים, ואבטחה מתקדמת.
        </p>
        <p>
          בכל פרויקט, אנו שמים דגש על{' '}
          <Link href="/services/ui-design" className="text-blue-600 hover:underline">
            חווית משתמש מעולה ועיצוב מודרני
          </Link>
          , וארכיטקטורה מדרגית שמאפשרת צמיחה והתפתחות. אנו מלווים אתכם בכל שלב - מהרעיון הראשוני ועד להשקה בחנויות האפליקציות ומעבר לכך.
        </p>
        <p>
          בשילוב עם{' '}
          <Link href="/services/cloud" className="text-blue-600 hover:underline">
            שירותי ענן
          </Link>
          {' '}מתקדמים ו{' '}
          <Link href="/services/ai" className="text-blue-600 hover:underline">
            פתרונות בינה מלאכותית
          </Link>
          , אנחנו יכולים ליצור אפליקציות חכמות ומתקדמות שיתנו לכם יתרון תחרותי משמעותי.
        </p>
        <p>
          הניסיון העשיר שלנו בפיתוח אפליקציות עבור מגוון תעשיות - מסטארטאפים ועד לחברות אנטרפרייז - מאפשר לנו להביא תובנות וניסיון מעשי שיעזרו להפוך את החזון שלכם למציאות.
        </p>
      </>
    ),
    heroImage: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1200&auto=format&fit=crop&q=60",
    features: [
      {
        title: "פיתוח Cross-Platform",
        description: "אפליקציה אחת שרצה על iOS ו-Android עם קוד משותף",
        icon: "mobile"
      },
      {
        title: "עיצוב UX/UI מתקדם",
        description: "ממשק משתמש אינטואיטיבי ועיצוב מודרני",
        icon: "paint-brush"
      },
      {
        title: "ביצועים מהירים",
        description: "אופטימיזציה לביצועים מקסימליים וחוויה חלקה",
        icon: "bolt"
      },
      {
        title: "אבטחה מתקדמת",
        description: "הגנה על מידע רגיש ופרטיות המשתמשים",
        icon: "shield"
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
      'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1573867639040-6dd25fa5f597?w=800&auto=format&fit=crop&q=60'
    ]
  };

  return <ServiceLayout {...serviceData} />;
} 