export interface NavigationItem {
  name: string;
  href: string;
  icon?: string;
  description?: string;
  submenu?: {
    name: string;
    href: string;
    icon?: string;
    description?: string;
  }[];
}

export interface SubMenuItem {
  name: string;
  href: string;
  icon: string;
  description: string;
}

// Define navigation data
export const navigation: NavigationItem[] = [
  {
    name: "בית",
    href: "/",
    icon: "home"
  },
  {
    name: "שירותים",
    href: "/services",
    icon: "code",
    submenu: [
      {
        name: "קידום אתרים",
        href: "/services/seo",
        icon: "chart-line",
        description: "קידום אורגני מקצועי לעסקים"
      },
      {
        name: "קידום במנועי AI (AEO/GEO)",
        href: "/services/aeo-geo",
        icon: "chart-line",
        description: "שהעסק יופיע בתשובות של מנועי AI"
      },
      {
        name: "בניית אתרים",
        href: "/services/web-development",
        icon: "globe",
        description: "פיתוח אתרי תדמית ומערכות Web"
      },
      {
        name: "מחירון בניית אתרים",
        href: "/pricing",
        icon: "chart-line",
        description: "מחירים שקופים לדף נחיתה, אתר תדמית, חנות ומערכת"
      },
      {
        name: "בניית אתרי וורדפרס",
        href: "/services/wordpress",
        icon: "globe",
        description: "פיתוח אתרים מותאמים אישית"
      },
      {
        name: "חנויות אינטרנט",
        href: "/services/ecommerce",
        icon: "shopping-cart",
        description: "בניית חנויות אונליין מהירות, מעוצבות ומותאמות למובייל"
      },
      {
        name: "פיתוח אפליקציות",
        href: "/services/mobile-apps",
        icon: "mobile",
        description: "אפליקציות מובייל iOS ו-Android"
      },
      {
        name: "עיצוב ממשק משתמש",
        href: "/services/ui-design",
        icon: "paint-brush",
        description: "עיצוב חווית משתמש מודרנית"
      },
      {
        name: "קמפיינים ממומנים",
        href: "/services/ppc",
        icon: "chart-line",
        description: "ניהול קמפיינים בגוגל ופייסבוק"
      },
      {
        name: "אנליטיקס ומדידה",
        href: "/services/analytics",
        icon: "chart-line",
        description: "ניתוח נתונים ואופטימיזציה"
      },
      {
        name: "פתרונות תוכנה",
        href: "/services/software",
        icon: "code",
        description: "ייעוץ, אינטגרציה והתאמת מערכות"
      },
      {
        name: "פיתוח תוכנה בהתאמה אישית",
        href: "/services/software-development",
        icon: "code",
        description: "בניית מערכות Web ו-Desktop מאפס"
      },
      {
        name: "פתרונות AI",
        href: "/services/ai",
        icon: "code",
        description: "שילוב בינה מלאכותית בעסק"
      },
      {
        name: "שירותי ענן",
        href: "/services/cloud",
        icon: "globe",
        description: "פתרונות ענן מתקדמים"
      }
    ]
  },
  {
    name: "אודות",
    href: "/about",
    icon: "users"
  },
  {
    name: "בלוג",
    href: "/blog",
    icon: "blog"
  },
  {
    name: "פרוייקטים",
    href: "/portfolio",
    icon: "briefcase"
  },
  {
    name: "צור קשר",
    href: "/contact",
    icon: "envelope"
  },
];

export const promotions = [
  "שירותי פיתוח אתרים מקצועיים",
  "בניית אפליקציות מותאמות אישית",
  "קידום אתרים אורגני",
  "פתרונות דיגיטליים מתקדמים"
]; 