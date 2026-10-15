import type { PortfolioTopic } from './website-projects';

export type ServiceCtaCopy = {
  title: string;
  text: string;
  whatsappText: string;
  topic?: PortfolioTopic;
};

const SERVICE_CTA_BY_KEY: Record<string, ServiceCtaCopy> = {
  'web-development': {
    title: 'אתר תדמית מקצועי מוכן תוך 14–21 יום',
    text: 'שיחת ייעוץ של 15 דקות – בחינם. נבין מה צריך ונחזור עם הצעה ברורה, בלי התחייבות.',
    whatsappText: 'שלום, אשמח לקבוע שיחת ייעוץ לבניית אתר תדמית.',
    topic: 'websites',
  },
  wordpress: {
    title: 'אתר וורדפרס שתוכלו לעדכן לבד – מוכן תוך 14–21 יום',
    text: 'שיחת ייעוץ של 15 דקות – בחינם. נבדוק אם וורדפרס מתאים לעסק שלכם.',
    whatsappText: 'שלום, אשמח לקבוע שיחת ייעוץ לאתר וורדפרס.',
    topic: 'wordpress',
  },
  ecommerce: {
    title: 'חנות אונליין עם סליקה ישראלית – נתחיל מאפיון השבוע',
    text: 'שיחת ייעוץ של 15 דקות – בחינם. בלי הבטחות מחיר שלא בדקנו איתכם.',
    whatsappText: 'שלום, אשמח לקבוע שיחת ייעוץ לחנות אונליין.',
    topic: 'ecommerce',
  },
  seo: {
    title: 'נבדוק מה עוצר את האתר בגוגל',
    text: 'שיחת ייעוץ של 15 דקות – בחינם. נסביר מה כדאי לתקן קודם ומה אפשר לדחות, בלי התחייבות.',
    whatsappText: 'שלום, אשמח לשיחת ייעוץ על קידום אורגני.',
    topic: 'seo',
  },
  ppc: {
    title: 'קמפיין ממומן יכול להתחיל להביא פניות כבר בימים הקרובים',
    text: 'שיחת ייעוץ של 15 דקות – בחינם. נגדיר יעד מדיד לפני שמוציאים שקל על מודעות.',
    whatsappText: 'שלום, אשמח לשיחת ייעוץ על קידום ממומן.',
    topic: 'seo',
  },
  'aeo-geo': {
    title: 'נכין את האתר להופעה בתשובות של מנועי AI',
    text: 'שיחת ייעוץ של 15 דקות – בחינם. נבדוק אם העסק מוכן ל-AEO/GEO.',
    whatsappText: 'שלום, אשמח לשיחת ייעוץ על קידום במנועי AI.',
    topic: 'seo',
  },
  ai: {
    title: 'בוט AI שעונה ללקוחות באתר ובוואטסאפ',
    text: 'שיחת ייעוץ של 15 דקות – בחינם. נאפיין מה הבוט צריך לענות ומה לא.',
    whatsappText: 'שלום, אשמח לשיחת ייעוץ על בוט AI לעסק.',
    topic: 'software',
  },
  analytics: {
    title: 'נחבר מדידה אמיתית לפניות ומכירות',
    text: 'שיחת ייעוץ של 15 דקות – בחינם. בלי דשבורד יפה שלא אומר כלום.',
    whatsappText: 'שלום, אשמח לשיחת ייעוץ על אנליטיקס ומדידה.',
    topic: 'seo',
  },
  'mobile-apps': {
    title: 'אפיון אפליקציה לפני שמתחילים לפתח',
    text: 'שיחת ייעוץ של 15 דקות – בחינם. נבין אם צריך אפליקציה, אתר, או משהו קטן יותר.',
    whatsappText: 'שלום, אשמח לשיחת ייעוץ על פיתוח אפליקציה.',
    topic: 'apps',
  },
  'website-tadmit': {
    title: 'אתר תדמית מוכן תוך 14–21 יום',
    text: 'שיחת ייעוץ של 15 דקות – בחינם. נבין את העסק ונחזור עם מבנה והצעה ברורה, בלי התחייבות.',
    whatsappText: 'שלום, אשמח לקבוע שיחת ייעוץ לבניית אתר תדמית.',
    topic: 'websites',
  },
  'software-development': {
    title: 'מערכת מותאמת לפי תהליך העסק – לא תבנית גנרית',
    text: 'שיחת ייעוץ של 15 דקות – בחינם. נמפה מה באמת צריך לבנות.',
    whatsappText: 'שלום, אשמח לשיחת ייעוץ על פיתוח מערכת מותאמת.',
    topic: 'software',
  },
  'ui-design': {
    title: 'עיצוב ממשק שמוביל לפנייה, לא רק למראה יפה',
    text: 'שיחת ייעוץ של 15 דקות – בחינם. נסתכל על האתר הקיים או על הרעיון.',
    whatsappText: 'שלום, אשמח לשיחת ייעוץ על עיצוב UI/UX.',
    topic: 'ui',
  },
  cloud: {
    title: 'תשתית ענן יציבה לאתר ולמערכת',
    text: 'שיחת ייעוץ של 15 דקות – בחינם. נבדוק אחסון, גיבוי ומהירות.',
    whatsappText: 'שלום, אשמח לשיחת ייעוץ על שירותי ענן.',
    topic: 'software',
  },
  services: {
    title: 'שיחת ייעוץ של 15 דקות – בחינם, בלי התחייבות',
    text: 'ספרו מה העסק צריך: אתר, חנות, קידום או בוט. נחזור עם כיוון ברור עוד היום.',
    whatsappText: 'שלום, אשמח לקבוע שיחת ייעוץ קצרה.',
    topic: 'websites',
  },
  local: {
    title: 'אתר מקומי שעובד בטלפון – מוכן תוך 14–21 יום',
    text: 'שיחת ייעוץ של 15 דקות – בחינם. נתאים את האתר לעיר ולאזור השירות שלכם.',
    whatsappText: 'שלום, אשמח לקבוע שיחת ייעוץ לבניית אתר לעסק מקומי.',
    topic: 'websites',
  },
};

const PATH_TO_KEY: Record<string, string> = {
  '/services/web-development': 'web-development',
  '/services/website-tadmit': 'website-tadmit',
  '/services/wordpress': 'wordpress',
  '/services/ecommerce': 'ecommerce',
  '/services/seo': 'seo',
  '/services/organic-seo': 'seo',
  '/services/ppc': 'ppc',
  '/services/paid-promotion': 'ppc',
  '/services/aeo-geo': 'aeo-geo',
  '/services/ai': 'ai',
  '/services/analytics': 'analytics',
  '/services/mobile-apps': 'mobile-apps',
  '/services/app-development': 'mobile-apps',
  '/services/software-development': 'software-development',
  '/services/software': 'software-development',
  '/services/ui-design': 'ui-design',
  '/services/cloud': 'cloud',
  '/services': 'services',
};

export function getServiceCta(keyOrPath?: string): ServiceCtaCopy {
  if (!keyOrPath) return SERVICE_CTA_BY_KEY.services;
  if (SERVICE_CTA_BY_KEY[keyOrPath]) return SERVICE_CTA_BY_KEY[keyOrPath];
  if (PATH_TO_KEY[keyOrPath] && SERVICE_CTA_BY_KEY[PATH_TO_KEY[keyOrPath]]) {
    return SERVICE_CTA_BY_KEY[PATH_TO_KEY[keyOrPath]];
  }
  if (keyOrPath.startsWith('/services/bniyat-atarim-')) {
    return SERVICE_CTA_BY_KEY.local;
  }
  return SERVICE_CTA_BY_KEY.services;
}
