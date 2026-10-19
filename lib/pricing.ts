export const PHONE_DISPLAY = '050-9159951';
export const PHONE_TEL = '+972509159951';
export { WHATSAPP_BASE, whatsappUrl, whatsappHrefForPath, PRICING_ARTICLE_PATH, PRICING_ARTICLE_WHATSAPP_TEXT } from './whatsapp';
export const PRICING_PATH = '/pricing';

export type PricingPackageId = 'landing' | 'brochure' | 'store' | 'custom';

export type PricingPackage = {
  id: PricingPackageId;
  name: string;
  startingPrice: number;
  priceLabel: string;
  summary: string;
  includes: string[];
  serviceHref: string;
  serviceLabel: string;
  whatsappText: string;
  highlighted?: boolean;
};

export const PRICING_PACKAGES: PricingPackage[] = [
  {
    id: 'landing',
    name: 'דף נחיתה',
    startingPrice: 2500,
    priceLabel: 'מ-2,500 ₪',
    summary: 'עמוד אחד ממוקד לקמפיין או לשירות בודד.',
    includes: [
      'עיצוב מותאם אישית',
      'התאמה מלאה לנייד',
      'טופס יצירת קשר וכפתור וואטסאפ',
      'חיבור לאנליטיקס ולפיקסל',
    ],
    serviceHref: '/services/web-development',
    serviceLabel: 'בניית אתרים',
    whatsappText: 'שלום, אשמח לקבל הצעת מחיר לדף נחיתה.',
  },
  {
    id: 'brochure',
    name: 'אתר תדמית',
    startingPrice: 6500,
    priceLabel: 'מ-6,500 ₪',
    summary: 'עד 6–8 עמודים ב-Next.js או בוורדפרס.',
    includes: [
      'עיצוב ייחודי לעסק',
      'SEO טכני',
      'סכמת LocalBusiness',
      'שאלות ותשובות באתר',
      'מוכנות לחיפוש AI / GEO',
    ],
    serviceHref: '/services/wordpress',
    serviceLabel: 'אתרי וורדפרס',
    whatsappText: 'שלום, אשמח לקבל הצעת מחיר לאתר תדמית של עד 6–8 עמודים.',
    highlighted: true,
  },
  {
    id: 'store',
    name: 'חנות אונליין',
    startingPrice: 12000,
    priceLabel: 'מ-12,000 ₪',
    summary: 'מכירה ישירה עם סליקה ישראלית ומשלוחים.',
    includes: [
      'סליקה ישראלית',
      'משלוחים',
      'עד כ-50 מוצרים',
      'SEO למוצרים',
    ],
    serviceHref: '/services/ecommerce',
    serviceLabel: 'חנויות אונליין',
    whatsappText: 'שלום, אשמח לקבל הצעת מחיר לחנות אונליין.',
  },
  {
    id: 'custom',
    name: 'פיתוח מותאם / מערכת',
    startingPrice: 20000,
    priceLabel: 'מ-20,000 ₪',
    summary: 'מערכת או אתר מורכב לפי אפיון.',
    includes: [
      'אפיון משותף',
      'פיתוח לפי מפרט',
      'התאמה לתהליך העסקי שלכם',
    ],
    serviceHref: '/services/software-development',
    serviceLabel: 'פיתוח תוכנה',
    whatsappText: 'שלום, אשמח לקבל הצעת מחיר לפיתוח מערכת או אתר מותאם.',
  },
];

export const PRICING_ADDONS = [
  { name: 'תחזוקה', priceLabel: '250–500 ₪ לחודש', detail: 'עדכונים, גיבויים ותמיכה שוטפת.' },
  { name: 'אחסון מנוהל', priceLabel: '50–150 ₪ לחודש', detail: 'אחסון ותפעול טכני של האתר.' },
  { name: 'כתיבת תוכן', priceLabel: '250–400 ₪ לעמוד', detail: 'ניסוח מקצועי לעמוד חדש או קיים.' },
  { name: 'SEO / GEO חודשי', priceLabel: 'לפי הצעת מחיר', detail: 'קידום אורגני ומוכנות לחיפוש מבוסס בינה מלאכותית.' },
  { name: 'עמודים נוספים', priceLabel: 'לפי היקף העמוד', detail: 'מעבר להיקף החבילה שנבחרה.' },
] as const;

/** Which approved website-building packages belong on a given service page. */
const PACKAGES_FOR_SERVICE: Record<string, PricingPackageId[]> = {
  'web-development': ['landing', 'brochure', 'store', 'custom'],
  wordpress: ['landing', 'brochure', 'store', 'custom'],
  ecommerce: ['store'],
  'software-development': ['custom'],
  software: ['custom'],
};

export function packagesForService(serviceType: string): PricingPackage[] {
  const ids = PACKAGES_FOR_SERVICE[serviceType];
  if (!ids) return [];
  return PRICING_PACKAGES.filter((pkg) => ids.includes(pkg.id));
}
