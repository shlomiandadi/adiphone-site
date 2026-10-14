import { absoluteUrl } from './seo';

export const AGENCY_PROVIDER = {
  '@type': 'ProfessionalService',
  name: 'Top Webstak בנייה וקידום אתרים',
  alternateName: 'עדי פון תקשורת',
  url: 'https://adi-phone.co.il',
  telephone: '+972-50-9159951',
  email: 'adiphoneseo@gmail.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'זמיר 95',
    addressLocality: 'פרדס חנה-כרכור',
    addressCountry: 'IL',
  },
} as const;

export const DEFAULT_AREA_SERVED = [
  'פרדס חנה-כרכור',
  'חדרה',
  'קיסריה',
  'זכרון יעקב',
  'חיפה',
  'נתניה',
  'אור עקיבא',
  'בנימינה',
  'יוקנעם',
  'עפולה',
  'השרון',
  'הצפון',
  'IL',
];

const SERVICE_PATH_BY_TYPE: Record<string, string> = {
  ai: '/services/ai',
  analytics: '/services/analytics',
  cloud: '/services/cloud',
  ecommerce: '/services/ecommerce',
  'mobile-apps': '/services/mobile-apps',
  'app-development': '/services/mobile-apps',
  'software-development': '/services/software-development',
  software: '/services/software-development',
  'ui-design': '/services/ui-design',
  'web-development': '/services/web-development',
  wordpress: '/services/wordpress',
  seo: '/services/seo',
  ppc: '/services/ppc',
  'paid-promotion': '/services/ppc',
};

export function servicePathForType(serviceType?: string, explicitPath?: string): string {
  if (explicitPath) return explicitPath;
  if (serviceType && SERVICE_PATH_BY_TYPE[serviceType]) return SERVICE_PATH_BY_TYPE[serviceType];
  if (serviceType) return `/services/${serviceType}`;
  return '/services';
}

export function buildServiceJsonLd({
  name,
  description,
  path,
}: {
  name: string;
  description: string;
  path: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    url: absoluteUrl(path),
    provider: AGENCY_PROVIDER,
    areaServed: DEFAULT_AREA_SERVED,
  };
}

export const SERVICES_HUB_ITEMS = [
  { name: 'קידום אתרים', path: '/services/seo' },
  { name: 'בניית אתרים', path: '/services/web-development' },
  { name: 'בניית אתרי וורדפרס', path: '/services/wordpress' },
  { name: 'חנויות אינטרנט', path: '/services/ecommerce' },
  { name: 'פיתוח אפליקציות', path: '/services/mobile-apps' },
  { name: 'עיצוב UI/UX', path: '/services/ui-design' },
  { name: 'פיתוח תוכנה', path: '/services/software-development' },
  { name: 'אנליטיקס ומדידה', path: '/services/analytics' },
  { name: 'פתרונות AI', path: '/services/ai' },
  { name: 'שירותי ענן', path: '/services/cloud' },
] as const;
