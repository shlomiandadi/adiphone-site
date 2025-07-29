'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FaCheck, FaStar, FaRocket, FaCrown, FaGem } from 'react-icons/fa';

interface PricingPlan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  popular?: boolean;
  icon: React.ReactNode;
  color: string;
}

interface ServicePricingProps {
  serviceType: string;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const staggerChildren = {
  visible: {
    transition: {
      staggerChildren: 0.2
    }
  }
};

export default function ServicePricing({ serviceType }: ServicePricingProps) {
  // Define pricing data for each service type
  const pricingData: { [key: string]: PricingPlan[] } = {
    'web-development': [
      {
        name: 'אתר תדמית בסיסי',
        price: '₪3,500',
        period: 'חד פעמי',
        description: 'אתר תדמית מקצועי עם עיצוב מותאם אישית',
        features: [
          'עיצוב מותאם אישית',
          'עד 5 עמודים',
          'מותאם למובייל',
          'חיבור לרשתות חברתיות',
          'טופס יצירת קשר',
          'SEO בסיסי',
          'תמיכה טכנית חודש'
        ],
        icon: <FaStar className="w-8 h-8" />,
        color: 'from-blue-500 to-blue-600'
      },
      {
        name: 'אתר קטלוג מתקדם',
        price: '₪6,500',
        period: 'חד פעמי',
        description: 'אתר קטלוג מקצועי עם ניהול תוכן מתקדם',
        features: [
          'כל מה שבחבילה הבסיסית',
          'עד 15 עמודים',
          'מערכת ניהול תוכן (CMS)',
          'גלריית תמונות מתקדמת',
          'חיפוש פנימי',
          'אנליטיקס מתקדם',
          'תמיכה טכנית 3 חודשים',
          'הדרכה לשימוש'
        ],
        popular: true,
        icon: <FaRocket className="w-8 h-8" />,
        color: 'from-purple-500 to-purple-600'
      },
      {
        name: 'חנות אונליין מלאה',
        price: '₪12,000',
        period: 'חד פעמי',
        description: 'חנות אונליין מלאה עם כל הפיצ\'רים המתקדמים',
        features: [
          'כל מה שבחבילה המתקדמת',
          'מערכת מכירות מלאה',
          'עד 50 מוצרים',
          'מערכת תשלומים מאובטחת',
          'ניהול מלאי',
          'שילוח אוטומטי',
          'אפליקציה למובייל',
          'תמיכה טכנית 6 חודשים',
          'הדרכה מלאה'
        ],
        icon: <FaCrown className="w-8 h-8" />,
        color: 'from-yellow-500 to-orange-500'
      }
    ],
    'ecommerce': [
      {
        name: 'חנות בסיסית',
        price: '₪8,000',
        period: 'חד פעמי',
        description: 'חנות אונליין בסיסית עם פונקציונליות חיונית',
        features: [
          'עד 100 מוצרים',
          'עיצוב מותאם אישית',
          'מערכת תשלומים מאובטחת',
          'ניהול מלאי בסיסי',
          'מותאם למובייל',
          'SEO בסיסי',
          'תמיכה טכנית חודש'
        ],
        icon: <FaStar className="w-8 h-8" />,
        color: 'from-green-500 to-green-600'
      },
      {
        name: 'חנות מתקדמת',
        price: '₪15,000',
        period: 'חד פעמי',
        description: 'חנות אונליין מתקדמת עם כל הפיצ\'רים הנדרשים',
        features: [
          'עד 500 מוצרים',
          'כל מה שבחבילה הבסיסית',
          'מערכת שילוח מתקדמת',
          'קופונים והנחות',
          'ביקורות מוצרים',
          'אנליטיקס מתקדם',
          'אינטגרציה עם מערכות חיצוניות',
          'תמיכה טכנית 3 חודשים'
        ],
        popular: true,
        icon: <FaRocket className="w-8 h-8" />,
        color: 'from-purple-500 to-purple-600'
      },
      {
        name: 'חנות פרימיום',
        price: '₪25,000',
        period: 'חד פעמי',
        description: 'חנות אונליין פרימיום עם כל הפיצ\'רים המתקדמים',
        features: [
          'מוצרים ללא הגבלה',
          'כל מה שבחבילה המתקדמת',
          'אפליקציה למובייל',
          'מערכת נאמנות מתקדמת',
          'AI להמלצות מוצרים',
          'ניהול מלאי מתקדם',
          'דשבורד ניהול מתקדם',
          'תמיכה טכנית 6 חודשים',
          'הדרכה מלאה'
        ],
        icon: <FaCrown className="w-8 h-8" />,
        color: 'from-yellow-500 to-orange-500'
      }
    ],
    'seo': [
      {
        name: 'SEO בסיסי',
        price: '₪1,500',
        period: 'לחודש',
        description: 'קידום אורגני בסיסי לאתר שלכם',
        features: [
          'ניתוח מילות מפתח',
          'אופטימיזציה על-דף',
          'דוחות חודשיים',
          'עד 10 מילות מפתח',
          'תמיכה טכנית',
          'המלצות לשיפור'
        ],
        icon: <FaStar className="w-8 h-8" />,
        color: 'from-blue-500 to-blue-600'
      },
      {
        name: 'SEO מתקדם',
        price: '₪2,500',
        period: 'לחודש',
        description: 'קידום אורגני מתקדם עם תוצאות מדידות',
        features: [
          'כל מה שבחבילה הבסיסית',
          'עד 25 מילות מפתח',
          'בניית קישורים',
          'תוכן SEO איכותי',
          'ניתוח מתחרים',
          'דוחות שבועיים',
          'תמיכה טכנית מתקדמת'
        ],
        popular: true,
        icon: <FaRocket className="w-8 h-8" />,
        color: 'from-purple-500 to-purple-600'
      },
      {
        name: 'SEO פרימיום',
        price: '₪4,000',
        period: 'לחודש',
        description: 'קידום אורגני פרימיום עם תוצאות מהירות',
        features: [
          'כל מה שבחבילה המתקדמת',
          'מילות מפתח ללא הגבלה',
          'בניית קישורים פרימיום',
          'תוכן SEO מתקדם',
          'ניתוח מתחרים מעמיק',
          'דוחות יומיים',
          'תמיכה טכנית 24/7',
          'אסטרטגיה מותאמת אישית'
        ],
        icon: <FaCrown className="w-8 h-8" />,
        color: 'from-yellow-500 to-orange-500'
      }
    ],
    'ppc': [
      {
        name: 'קמפיין בסיסי',
        price: '₪2,000',
        period: 'לחודש',
        description: 'ניהול קמפיינים ממומנים בסיסי',
        features: [
          'ניהול קמפיין אחד',
          'תקציב עד ₪5,000',
          'דוחות חודשיים',
          'אופטימיזציה בסיסית',
          'תמיכה טכנית',
          'המלצות לשיפור'
        ],
        icon: <FaStar className="w-8 h-8" />,
        color: 'from-green-500 to-green-600'
      },
      {
        name: 'קמפיין מתקדם',
        price: '₪3,500',
        period: 'לחודש',
        description: 'ניהול קמפיינים ממומנים מתקדם',
        features: [
          'ניהול עד 3 קמפיינים',
          'תקציב עד ₪15,000',
          'כל מה שבחבילה הבסיסית',
          'אופטימיזציה מתקדמת',
          'דוחות שבועיים',
          'ניתוח מתחרים',
          'תמיכה טכנית מתקדמת'
        ],
        popular: true,
        icon: <FaRocket className="w-8 h-8" />,
        color: 'from-purple-500 to-purple-600'
      },
      {
        name: 'קמפיין פרימיום',
        price: '₪6,000',
        period: 'לחודש',
        description: 'ניהול קמפיינים ממומנים פרימיום',
        features: [
          'ניהול קמפיינים ללא הגבלה',
          'תקציב ללא הגבלה',
          'כל מה שבחבילה המתקדמת',
          'אופטימיזציה מתקדמת',
          'דוחות יומיים',
          'ניתוח מתחרים מעמיק',
          'תמיכה טכנית 24/7',
          'אסטרטגיה מותאמת אישית'
        ],
        icon: <FaCrown className="w-8 h-8" />,
        color: 'from-yellow-500 to-orange-500'
      }
    ],
    'software-development': [
      {
        name: 'פיתוח בסיסי',
        price: '₪15,000',
        period: 'חד פעמי',
        description: 'פיתוח תוכנה בסיסי עם פונקציונליות חיונית',
        features: [
          'פיתוח עד 3 מודולים',
          'עיצוב UI/UX בסיסי',
          'בדיקות איכות',
          'תיעוד בסיסי',
          'תמיכה טכנית חודש',
          'הדרכה בסיסית'
        ],
        icon: <FaStar className="w-8 h-8" />,
        color: 'from-blue-500 to-blue-600'
      },
      {
        name: 'פיתוח מתקדם',
        price: '₪35,000',
        period: 'חד פעמי',
        description: 'פיתוח תוכנה מתקדם עם פונקציונליות מלאה',
        features: [
          'פיתוח עד 8 מודולים',
          'כל מה שבחבילה הבסיסית',
          'עיצוב UI/UX מתקדם',
          'אינטגרציה עם מערכות חיצוניות',
          'בדיקות איכות מתקדמות',
          'תיעוד מלא',
          'תמיכה טכנית 3 חודשים'
        ],
        popular: true,
        icon: <FaRocket className="w-8 h-8" />,
        color: 'from-purple-500 to-purple-600'
      },
      {
        name: 'פיתוח פרימיום',
        price: '₪75,000',
        period: 'חד פעמי',
        description: 'פיתוח תוכנה פרימיום עם כל הפיצ\'רים המתקדמים',
        features: [
          'פיתוח ללא הגבלת מודולים',
          'כל מה שבחבילה המתקדמת',
          'עיצוב UI/UX פרימיום',
          'אינטגרציה מתקדמת',
          'בדיקות איכות מקיפות',
          'תיעוד מקצועי',
          'תמיכה טכנית 6 חודשים',
          'הדרכה מלאה'
        ],
        icon: <FaCrown className="w-8 h-8" />,
        color: 'from-yellow-500 to-orange-500'
      }
    ],
    'ai': [
      {
        name: 'פתרון AI בסיסי',
        price: '₪8,000',
        period: 'חד פעמי',
        description: 'הטמעת פתרונות AI בסיסיים לעסק שלכם',
        features: [
          'צ\'אטבוט בסיסי',
          'ניתוח נתונים פשוט',
          'אוטומציה בסיסית',
          'הדרכה בסיסית',
          'תמיכה טכנית חודש',
          'אינטגרציה עם מערכות קיימות'
        ],
        icon: <FaStar className="w-8 h-8" />,
        color: 'from-blue-500 to-blue-600'
      },
      {
        name: 'פתרון AI מתקדם',
        price: '₪18,000',
        period: 'חד פעמי',
        description: 'פתרונות AI מתקדמים עם יכולות מתקדמות',
        features: [
          'כל מה שבחבילה הבסיסית',
          'צ\'אטבוט מתקדם עם NLP',
          'מערכות המלצה חכמות',
          'ניתוח נתונים מתקדם',
          'אוטומציה מתקדמת',
          'תמיכה טכנית 3 חודשים',
          'הדרכה מתקדמת'
        ],
        popular: true,
        icon: <FaRocket className="w-8 h-8" />,
        color: 'from-purple-500 to-purple-600'
      },
      {
        name: 'פתרון AI פרימיום',
        price: '₪35,000',
        period: 'חד פעמי',
        description: 'פתרונות AI פרימיום עם כל הפיצ\'רים המתקדמים',
        features: [
          'כל מה שבחבילה המתקדמת',
          'AI מותאם אישית',
          'מערכות חיזוי מתקדמות',
          'אוטומציה מלאה',
          'ניתוח Big Data',
          'תמיכה טכנית 6 חודשים',
          'הדרכה מלאה',
          'ייעוץ אסטרטגי'
        ],
        icon: <FaCrown className="w-8 h-8" />,
        color: 'from-yellow-500 to-orange-500'
      }
    ],
    'mobile-apps': [
      {
        name: 'אפליקציה בסיסית',
        price: '₪12,000',
        period: 'חד פעמי',
        description: 'אפליקציה בסיסית עם פונקציונליות חיונית',
        features: [
          'עד 5 מסכים',
          'עיצוב בסיסי',
          'פיתוח Cross-Platform',
          'בדיקות בסיסיות',
          'העלאה לחנויות',
          'תמיכה טכנית חודש'
        ],
        icon: <FaStar className="w-8 h-8" />,
        color: 'from-blue-500 to-blue-600'
      },
      {
        name: 'אפליקציה מתקדמת',
        price: '₪25,000',
        period: 'חד פעמי',
        description: 'אפליקציה מתקדמת עם פיצ\'רים מתקדמים',
        features: [
          'עד 15 מסכים',
          'כל מה שבחבילה הבסיסית',
          'עיצוב מתקדם',
          'אינטגרציה עם מערכות',
          'בדיקות מקיפות',
          'תמיכה טכנית 3 חודשים',
          'הדרכה לשימוש'
        ],
        popular: true,
        icon: <FaRocket className="w-8 h-8" />,
        color: 'from-purple-500 to-purple-600'
      },
      {
        name: 'אפליקציה פרימיום',
        price: '₪45,000',
        period: 'חד פעמי',
        description: 'אפליקציה פרימיום עם כל הפיצ\'רים המתקדמים',
        features: [
          'מסכים ללא הגבלה',
          'כל מה שבחבילה המתקדמת',
          'עיצוב פרימיום',
          'אינטגרציה מתקדמת',
          'בדיקות מקיפות',
          'תמיכה טכנית 6 חודשים',
          'הדרכה מלאה',
          'תחזוקה שוטפת'
        ],
        icon: <FaCrown className="w-8 h-8" />,
        color: 'from-yellow-500 to-orange-500'
      }
    ],
    'cloud': [
      {
        name: 'שירותי ענן בסיסיים',
        price: '₪2,500',
        period: 'לחודש',
        description: 'שירותי ענן בסיסיים לעסקים קטנים',
        features: [
          'אחסון עד 100GB',
          'גיבוי אוטומטי',
          'אבטחה בסיסית',
          'תמיכה טכנית',
          'ניטור בסיסי',
          'גישה 24/7'
        ],
        icon: <FaStar className="w-8 h-8" />,
        color: 'from-blue-500 to-blue-600'
      },
      {
        name: 'שירותי ענן מתקדמים',
        price: '₪5,000',
        period: 'לחודש',
        description: 'שירותי ענן מתקדמים לעסקים בינוניים',
        features: [
          'אחסון עד 1TB',
          'כל מה שבחבילה הבסיסית',
          'אבטחה מתקדמת',
          'ניטור מתקדם',
          'תמיכה טכנית מתקדמת',
          'אוטומציה מתקדמת'
        ],
        popular: true,
        icon: <FaRocket className="w-8 h-8" />,
        color: 'from-purple-500 to-purple-600'
      },
      {
        name: 'שירותי ענן פרימיום',
        price: '₪10,000',
        period: 'לחודש',
        description: 'שירותי ענן פרימיום לעסקים גדולים',
        features: [
          'אחסון ללא הגבלה',
          'כל מה שבחבילה המתקדמת',
          'אבטחה פרימיום',
          'ניטור 24/7',
          'תמיכה טכנית 24/7',
          'אוטומציה מלאה',
          'ייעוץ אסטרטגי'
        ],
        icon: <FaCrown className="w-8 h-8" />,
        color: 'from-yellow-500 to-orange-500'
      }
    ],
    'analytics': [
      {
        name: 'אנליטיקס בסיסי',
        price: '₪1,200',
        period: 'לחודש',
        description: 'שירותי אנליטיקס בסיסיים לעסקים קטנים',
        features: [
          'הטמעת Google Analytics 4',
          'דוחות חודשיים',
          'מעקב המרות בסיסי',
          'תמיכה טכנית',
          'ניתוח בסיסי',
          'המלצות לשיפור'
        ],
        icon: <FaStar className="w-8 h-8" />,
        color: 'from-blue-500 to-blue-600'
      },
      {
        name: 'אנליטיקס מתקדם',
        price: '₪2,500',
        period: 'לחודש',
        description: 'שירותי אנליטיקס מתקדמים לעסקים בינוניים',
        features: [
          'כל מה שבחבילה הבסיסית',
          'דוחות מותאמים אישית',
          'מעקב המרות מתקדם',
          'ניתוח מתחרים',
          'דוחות שבועיים',
          'תמיכה טכנית מתקדמת'
        ],
        popular: true,
        icon: <FaRocket className="w-8 h-8" />,
        color: 'from-purple-500 to-purple-600'
      },
      {
        name: 'אנליטיקס פרימיום',
        price: '₪4,500',
        period: 'לחודש',
        description: 'שירותי אנליטיקס פרימיום לעסקים גדולים',
        features: [
          'כל מה שבחבילה המתקדמת',
          'דשבורדים מותאמים אישית',
          'ניתוח Big Data',
          'חיזוי ומודלים מתקדמים',
          'דוחות יומיים',
          'תמיכה טכנית 24/7',
          'ייעוץ אסטרטגי'
        ],
        icon: <FaCrown className="w-8 h-8" />,
        color: 'from-yellow-500 to-orange-500'
      }
    ],
    'app-development': [
      {
        name: 'אפליקציה בסיסית',
        price: '₪15,000',
        period: 'חד פעמי',
        description: 'פיתוח אפליקציה בסיסית עם פונקציונליות חיונית',
        features: [
          'עד 8 מסכים',
          'עיצוב בסיסי',
          'פיתוח Cross-Platform',
          'בדיקות בסיסיות',
          'העלאה לחנויות',
          'תמיכה טכנית חודש'
        ],
        icon: <FaStar className="w-8 h-8" />,
        color: 'from-blue-500 to-blue-600'
      },
      {
        name: 'אפליקציה מתקדמת',
        price: '₪35,000',
        period: 'חד פעמי',
        description: 'פיתוח אפליקציה מתקדמת עם פיצ\'רים מתקדמים',
        features: [
          'עד 20 מסכים',
          'כל מה שבחבילה הבסיסית',
          'עיצוב מתקדם',
          'אינטגרציה עם מערכות',
          'בדיקות מקיפות',
          'תמיכה טכנית 3 חודשים',
          'הדרכה לשימוש'
        ],
        popular: true,
        icon: <FaRocket className="w-8 h-8" />,
        color: 'from-purple-500 to-purple-600'
      },
      {
        name: 'אפליקציה פרימיום',
        price: '₪65,000',
        period: 'חד פעמי',
        description: 'פיתוח אפליקציה פרימיום עם כל הפיצ\'רים המתקדמים',
        features: [
          'מסכים ללא הגבלה',
          'כל מה שבחבילה המתקדמת',
          'עיצוב פרימיום',
          'אינטגרציה מתקדמת',
          'בדיקות מקיפות',
          'תמיכה טכנית 6 חודשים',
          'הדרכה מלאה',
          'תחזוקה שוטפת'
        ],
        icon: <FaCrown className="w-8 h-8" />,
        color: 'from-yellow-500 to-orange-500'
      }
    ],
    'ui-design': [
      {
        name: 'עיצוב בסיסי',
        price: '₪3,500',
        period: 'חד פעמי',
        description: 'עיצוב UI/UX בסיסי למוצר דיגיטלי',
        features: [
          'עיצוב עד 5 מסכים',
          'Wireframes בסיסיים',
          'עיצוב ויזואלי בסיסי',
          'מערכת צבעים',
          'טיפוגרפיה בסיסית',
          'תמיכה טכנית חודש'
        ],
        icon: <FaStar className="w-8 h-8" />,
        color: 'from-blue-500 to-blue-600'
      },
      {
        name: 'עיצוב מתקדם',
        price: '₪8,000',
        period: 'חד פעמי',
        description: 'עיצוב UI/UX מתקדם עם מחקר משתמשים',
        features: [
          'עיצוב עד 15 מסכים',
          'כל מה שבחבילה הבסיסית',
          'מחקר משתמשים',
          'Wireframes מתקדמים',
          'פרוטוטייפ אינטראקטיבי',
          'מערכת עיצוב מלאה',
          'בדיקות שמישות',
          'תמיכה טכנית 3 חודשים'
        ],
        icon: <FaGem className="w-8 h-8" />,
        color: 'from-purple-500 to-purple-600'
      },
      {
        name: 'עיצוב פרימיום',
        price: '₪15,000',
        period: 'חד פעמי',
        description: 'עיצוב UI/UX מקיף עם אסטרטגיה מלאה',
        features: [
          'עיצוב ללא הגבלה',
          'כל מה שבחבילה המתקדמת',
          'אסטרטגיה עסקית',
          'מחקר מתחרים',
          'פרוטוטייפ מלא',
          'מערכת עיצוב מקיפה',
          'בדיקות משתמשים מקיפות',
          'אופטימיזציה מתמשכת',
          'תמיכה טכנית 6 חודשים'
        ],
        icon: <FaCrown className="w-8 h-8" />,
        color: 'from-yellow-500 to-orange-500'
      }
    ]
  };

  // Get pricing plans for the specific service type
  const plans = pricingData[serviceType] || pricingData['web-development'];

  return (
    <section className="bg-gradient-to-b from-gray-50 to-white px-4 py-16 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center mb-12"
        >
          <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
            מחירון שירותים
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            בחרנו עבורכם את החבילות המתאימות ביותר לכל צורך ומטרה. 
            כל חבילה כוללת תמיכה טכנית מלאה והדרכה מקצועית.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerChildren}
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className={`relative rounded-2xl bg-white p-8 shadow-xl transition-all hover:shadow-2xl dark:bg-gray-800 ${
                plan.popular ? 'ring-2 ring-purple-500 scale-105' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                    הכי פופולרי
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${plan.color} text-white mb-4`}>
                  {plan.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {plan.name}
                </h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">
                    {plan.price}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">
                    /{plan.period}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <FaCheck className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => window.open('https://wa.me/972509159951?text=שלום! אני מעוניין בחבילה ' + plan.name + ' עבור ' + serviceType, '_blank')}
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-all ${
                  plan.popular
                    ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700'
                    : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-900 hover:from-gray-200 hover:to-gray-300 dark:from-gray-700 dark:to-gray-600 dark:text-white dark:hover:from-gray-600 dark:hover:to-gray-500'
                }`}
              >
                התחל עכשיו
              </button>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="mt-12 text-center"
        >
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            לא מצאתם את החבילה המתאימה? צרו איתנו קשר ונבנה עבורכם פתרון מותאם אישית
          </p>
          <button 
            onClick={() => window.open('tel:0509159951', '_self')}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all"
          >
            צרו קשר לקבלת הצעת מחיר מותאמת
          </button>
        </motion.div>
      </div>
    </section>
  );
} 