'use client';

import ServiceLayout from '../../components/ServiceLayout';

export default function AIService() {
  const serviceData = {
    title: "פתרונות בינה מלאכותית",
    subtitle: "טכנולוגיות AI חדשניות להאצת הצמיחה העסקית",
    description: `בינה מלאכותית (AI) היא לא רק מילת באזז - זו טכנולוגיה שמשנה את כללי המשחק בכל תחום עסקי. אנחנו מתמחים בהטמעת פתרונות AI מתקדמים שמייעלים תהליכים, משפרים את חווית הלקוח ומגדילים את הרווחיות.

    הצוות שלנו מורכב ממומחי AI עם ניסיון עשיר בפיתוח והטמעת מערכות בינה מלאכותית בארגונים מכל הגדלים. אנחנו מבינים שכל עסק ייחודי, ולכן אנחנו מתאימים את הפתרונות בדיוק לצרכים ולאתגרים הספציפיים שלכם.
    
    אנחנו מציעים מגוון רחב של פתרונות AI, החל מצ'אטבוטים חכמים ומערכות המלצה, ועד למערכות ניתוח נתונים מתקדמות ואוטומציה של תהליכים עסקיים. כל פתרון מתוכנן לספק ערך מיידי תוך שמירה על יכולת צמיחה והתאמה לצרכים עתידיים.
    
    אנחנו מלווים אתכם בכל שלב בדרך - מהאפיון הראשוני, דרך הפיתוח וההטמעה, ועד לתחזוקה שוטפת ושדרוגים עתידיים. המטרה שלנו היא להפוך את ה-AI לכלי צמיחה משמעותי עבור העסק שלכם.`,
    heroImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200",
    features: [
      {
        title: "צ'אטבוטים חכמים",
        description: "פיתוח צ'אטבוטים מבוססי AI לשירות לקוחות 24/7",
        icon: "robot"
      },
      {
        title: "עיבוד שפה טבעית",
        description: "מערכות NLP מתקדמות לניתוח טקסט והבנת שפה",
        icon: "language"
      },
      {
        title: "מערכות המלצה",
        description: "אלגוריתמים חכמים להתאמה אישית של תוכן ומוצרים",
        icon: "brain"
      },
      {
        title: "אוטומציה חכמה",
        description: "אוטומציה של תהליכים עסקיים באמצעות AI",
        icon: "cogs"
      }
    ],
    benefits: [
      "שיפור משמעותי בחווית הלקוח",
      "ייעול תהליכים וחיסכון בעלויות",
      "קבלת החלטות מבוססת נתונים",
      "זיהוי מגמות והזדמנויות חדשות",
      "אוטומציה של משימות חוזרות",
      "יתרון תחרותי משמעותי"
    ],
    process: [
      {
        title: "אפיון צרכים",
        description: "הבנת האתגרים והזדמנויות ליישום AI בעסק שלכם"
      },
      {
        title: "פיתוח פתרון",
        description: "פיתוח והתאמה של פתרונות AI מותאמים אישית"
      },
      {
        title: "הטמעה והדרכה",
        description: "הטמעת המערכת והדרכת הצוות לשימוש מיטבי"
      },
      {
        title: "מדידה ושיפור",
        description: "ניטור ביצועים מתמיד ושיפור המערכת"
      }
    ],
    faq: [
      {
        question: "איך AI יכול לעזור לעסק שלי?",
        answer: "AI יכול לסייע במגוון דרכים: שיפור שירות הלקוחות באמצעות צ'אטבוטים חכמים, ייעול תהליכים פנימיים באמצעות אוטומציה, שיפור קבלת ההחלטות באמצעות ניתוח נתונים מתקדם, התאמה אישית של חווית המשתמש, ועוד. נשמח לייעץ לכם ספציפית לגבי העסק שלכם."
      },
      {
        question: "כמה זמן לוקח להטמיע פתרון AI?",
        answer: "משך ההטמעה תלוי בסוג הפתרון והיקפו. פרויקט בסיסי כמו צ'אטבוט יכול להיות מוכן תוך מספר שבועות, בעוד שפרויקטים מורכבים יותר עשויים לקחת מספר חודשים. אנחנו תמיד מתכננים את הפרויקט בשלבים כדי לספק ערך מהר ככל האפשר."
      },
      {
        question: "האם נדרשת תשתית מיוחדת?",
        answer: "רוב פתרונות ה-AI שלנו מבוססי ענן ודורשים תשתית מינימלית מצד הלקוח. אנחנו מטפלים בכל ההיבטים הטכניים ומספקים פתרון מקצה לקצה, כולל תשתיות, אבטחה, וגיבויים."
      },
      {
        question: "איך מודדים את ההצלחה של פתרון AI?",
        answer: "אנחנו מגדירים מדדי הצלחה ברורים בתחילת כל פרויקט, כגון: שיפור בשביעות רצון לקוחות, חיסכון בזמן ועלויות, שיפור בהמרות, ועוד. המערכות שלנו כוללות כלי ניטור ומדידה מובנים המאפשרים מעקב מתמיד אחר הביצועים."
      }
    ],
    portfolio: [
      'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800',
      'https://images.unsplash.com/photo-1488229297570-58520851e868?w=800'
    ]
  };

  return <ServiceLayout {...serviceData} />;
} 