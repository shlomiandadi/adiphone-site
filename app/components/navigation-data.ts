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
export const serviceAreaLinks = [
  {
    name: "בניית אתרים בפרדס חנה",
    href: "/services/bniyat-atarim-pardes-hana",
    icon: "globe",
    description: "אתרי תדמית, חנויות ומערכות בפרדס חנה-כרכור"
  },
  {
    name: "בניית אתרים בחדרה",
    href: "/services/bniyat-atarim-hadera",
    icon: "globe",
    description: "אתרי תדמית, חנויות ומערכות בחדרה והסביבה"
  },
  {
    name: "בניית אתרים בקיסריה",
    href: "/services/bniyat-atarim-caesarea",
    icon: "globe",
    description: "אתרי תדמית, חנויות ומערכות בקיסריה"
  },
  {
    name: "בניית אתרים בזכרון יעקב",
    href: "/services/bniyat-atarim-zichron-yaakov",
    icon: "globe",
    description: "אתרי תדמית, חנויות ומערכות בזכרון יעקב"
  },
  {
    name: "בניית אתרים בחיפה",
    href: "/services/bniyat-atarim-haifa",
    icon: "globe",
    description: "אתרי תדמית, חנויות ומערכות בחיפה והקריות"
  },
  {
    name: "בניית אתרים בנתניה",
    href: "/services/bniyat-atarim-netanya",
    icon: "globe",
    description: "אתרי תדמית, חנויות ומערכות בנתניה והשרון"
  },
  {
    name: "בניית אתרים באור עקיבא",
    href: "/services/bniyat-atarim-or-akiva",
    icon: "globe",
    description: "אתרי תדמית, חנויות ומערכות באור עקיבא"
  },
  {
    name: "בניית אתרים בבנימינה",
    href: "/services/bniyat-atarim-binyamina",
    icon: "globe",
    description: "אתרי תדמית, חנויות ומערכות בבנימינה וגבעת עדה"
  },
  {
    name: "בניית אתרים ביוקנעם",
    href: "/services/bniyat-atarim-yokneam",
    icon: "globe",
    description: "אתרי תדמית, חנויות ומערכות ביוקנעם עילית"
  },
  {
    name: "בניית אתרים בעפולה",
    href: "/services/bniyat-atarim-afula",
    icon: "globe",
    description: "אתרי תדמית, חנויות ומערכות בעפולה ובעמק יזרעאל"
  },
] as const;

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
        href: "/services/software-development",
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
    name: "מחירון",
    href: "/pricing",
    icon: "chart-line"
  },
  {
    name: "אזורי שירות",
    href: "/services/bniyat-atarim-pardes-hana",
    icon: "globe",
    submenu: [...serviceAreaLinks]
  },
  {
    name: "אודות",
    href: "/about",
    icon: "users"
  },
  {
    name: "בלוג",
    href: "/blog",
    icon: "blog",
    submenu: [
      {
        name: "כמה עולה בניית אתר ב-2026",
        href: "/blog/kama-oleh-bniyat-atar-2026",
        icon: "blog",
        description: "טווחי מחירים לדף נחיתה, אתר תדמית, חנות ומערכת"
      }
    ]
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