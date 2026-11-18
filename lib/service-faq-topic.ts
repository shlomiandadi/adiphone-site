/** FAQ hub titles (must match data/faq/index.json). Safe for client components. */
export const FAQ_TOPIC_TITLE_HE: Record<string, string> = {
  'aeo-geo': 'קידום במנועי AI (AEO/GEO)',
  'ai-bots': 'בינה מלאכותית, בוטים ואוטומציה',
  'chatgpt-ads': 'פרסום ממומן ב-ChatGPT',
  'chatgpt-business-hub': 'פרופיל עסקי ב-ChatGPT (Business Hub)',
  ecommerce: 'חנות אינטרנטית',
  general: 'מי אנחנו, יצירת קשר ואמון',
  glossary: 'מילון מונחים',
  'landing-page': 'דף נחיתה',
  'local-areas': 'בניית אתרים לפי אזור',
  'local-seo': 'קידום מקומי וגוגל העסק שלי',
  'mobile-apps': 'פיתוח אפליקציות',
  objections: 'חששות, התנגדויות והשוואות',
  'ownership-hosting-security': 'בעלות, דומיין, אחסון, אבטחה, נגישות ופרטיות',
  ppc: 'קמפיינים ממומנים: גוגל, פייסבוק ואינסטגרם',
  pricing: 'מחירים ועלויות',
  'sentry-guard': 'אפליקציית Sentry Guard לרכב',
  seo: 'קידום אתרים אורגני (SEO)',
  social: 'סושיאל ורשתות חברתיות',
  'ui-software-analytics-cloud': 'עיצוב UI/UX, פיתוח מערכות, אנליטיקס וענן',
  verticals: 'אתרים לפי תחום עסק',
  'web-development': 'בניית אתרים, אתר תדמית ווורדפרס',
};

const EXACT_SERVICE_FAQ_TOPIC: Record<string, string> = {
  '/services/seo': 'seo',
  '/services/organic-seo': 'seo',
  '/services/ppc': 'ppc',
  '/services/paid-promotion': 'ppc',
  '/services/aeo-geo': 'aeo-geo',
  '/services/chatgpt-ads': 'chatgpt-ads',
  '/services/chatgpt-business-hub': 'chatgpt-business-hub',
  '/services/ecommerce': 'ecommerce',
  '/services/wordpress': 'web-development',
  '/services/web-development': 'web-development',
  '/services/web-development/lawyers': 'verticals',
  '/services/web-development/clinics': 'verticals',
  '/services/web-development/accountants': 'verticals',
  '/services/ai': 'ai-bots',
  '/services/analytics': 'ui-software-analytics-cloud',
  '/services/cloud': 'ui-software-analytics-cloud',
  '/services/ui-design': 'ui-software-analytics-cloud',
  '/services/software': 'ui-software-analytics-cloud',
  '/services/software-development': 'ui-software-analytics-cloud',
  '/services/mobile-apps': 'mobile-apps',
  '/services/app-development': 'mobile-apps',
  '/services/bniyat-atarim-afula': 'local-areas',
  '/services/bniyat-atarim-binyamina': 'local-areas',
  '/services/bniyat-atarim-caesarea': 'local-areas',
  '/services/bniyat-atarim-hadera': 'local-areas',
  '/services/bniyat-atarim-haifa': 'local-areas',
  '/services/bniyat-atarim-netanya': 'local-areas',
  '/services/bniyat-atarim-or-akiva': 'local-areas',
  '/services/bniyat-atarim-pardes-hana': 'local-areas',
  '/services/bniyat-atarim-yokneam': 'local-areas',
  '/services/bniyat-atarim-zichron-yaakov': 'local-areas',
};

export type ServiceFaqTopicLink = {
  topic: string;
  titleHe: string;
  href: string;
};

function normalizeServicePath(path: string): string {
  const trimmed = path.trim();
  if (!trimmed) return '';
  const withSlash = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return withSlash.replace(/\/+$/, '') || '/';
}

export function faqTopicForServicePath(path: string): ServiceFaqTopicLink | null {
  const normalized = normalizeServicePath(path);
  const topic = EXACT_SERVICE_FAQ_TOPIC[normalized];
  if (!topic) return null;
  const titleHe = FAQ_TOPIC_TITLE_HE[topic];
  if (!titleHe) return null;
  return { topic, titleHe, href: `/faq/${topic}` };
}

const SERVICE_TYPE_PATH: Record<string, string> = {
  ai: '/services/ai',
  analytics: '/services/analytics',
  cloud: '/services/cloud',
  ecommerce: '/services/ecommerce',
  'mobile-apps': '/services/mobile-apps',
  'app-development': '/services/app-development',
  'software-development': '/services/software-development',
  software: '/services/software',
  'ui-design': '/services/ui-design',
  'web-development': '/services/web-development',
  wordpress: '/services/wordpress',
  seo: '/services/seo',
  ppc: '/services/ppc',
  'paid-promotion': '/services/paid-promotion',
  'organic-seo': '/services/organic-seo',
};

export function faqTopicForService(serviceType?: string, servicePath?: string): ServiceFaqTopicLink | null {
  const path = servicePath
    || (serviceType && SERVICE_TYPE_PATH[serviceType])
    || (serviceType ? `/services/${serviceType}` : '');
  return path ? faqTopicForServicePath(path) : null;
}

export function listedServiceFaqMappings(): Array<{ path: string; topic: string }> {
  return Object.entries(EXACT_SERVICE_FAQ_TOPIC).map(([path, topic]) => ({ path, topic }));
}
