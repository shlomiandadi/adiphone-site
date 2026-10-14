import { GOOGLE_MAPS_REVIEWS_URL, GOOGLE_RATING } from './reviews';
import { getSiteUrl } from './seo';

export const BUSINESS_NAME = 'Top Webstak בנייה וקידום אתרים';
export const BUSINESS_ALTERNATE_NAME = 'עדי פון תקשורת';
export const BUSINESS_PHONE = '+972-50-9159951';
export const BUSINESS_EMAIL = 'adiphoneseo@gmail.com';
export const BUSINESS_STREET = 'זמיר 95';
export const BUSINESS_LOCALITY = 'פרדס חנה-כרכור';

export const OFFER_CATALOG_SERVICES = [
  { name: 'בניית אתרים', path: '/services/web-development' },
  { name: 'אתרי וורדפרס', path: '/services/wordpress' },
  { name: 'חנויות אונליין', path: '/services/ecommerce' },
  { name: 'קידום אורגני SEO', path: '/services/seo' },
  { name: 'קידום ממומן PPC', path: '/services/ppc' },
  { name: 'ניהול סושיאל', path: '/contact' },
  { name: 'בוטים AI', path: '/services/ai' },
] as const;

export const LOCAL_PAGE_CITIES = [
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
] as const;

export const AREA_SERVED = [
  ...LOCAL_PAGE_CITIES,
  'השרון',
  'חיפה והקריות',
  'הצפון',
] as const;

type BuildOptions = {
  url?: string;
  extraAreaServed?: string[];
};

export function buildLocalBusinessJsonLd(options: BuildOptions = {}) {
  const siteUrl = getSiteUrl();
  const pageUrl = options.url || `${siteUrl}/contact`;
  const areas = Array.from(new Set([...(options.extraAreaServed || []), ...AREA_SERVED]));

  return {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'ProfessionalService'],
    name: BUSINESS_NAME,
    alternateName: BUSINESS_ALTERNATE_NAME,
    url: pageUrl,
    telephone: BUSINESS_PHONE,
    email: BUSINESS_EMAIL,
    openingHours: 'Su-Th 09:00-18:00',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
        opens: '09:00',
        closes: '18:00',
      },
    ],
    address: {
      '@type': 'PostalAddress',
      streetAddress: BUSINESS_STREET,
      addressLocality: BUSINESS_LOCALITY,
      addressCountry: 'IL',
    },
    hasMap: GOOGLE_MAPS_REVIEWS_URL,
    sameAs: [
      'https://www.facebook.com/profile.php?id=61578707397365',
      'https://www.linkedin.com/in/shlomi-malfuf-709961221/',
      GOOGLE_MAPS_REVIEWS_URL,
    ],
    areaServed: areas.map((name) => ({
      '@type': name === 'השרון' || name === 'הצפון' || name === 'חיפה והקריות' ? 'AdministrativeArea' : 'City',
      name,
    })),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'שירותי דיגיטל',
      itemListElement: OFFER_CATALOG_SERVICES.map((service) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: service.name,
          url: `${siteUrl}${service.path}`,
        },
      })),
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: GOOGLE_RATING.ratingValue,
      reviewCount: String(GOOGLE_RATING.reviewCount),
      bestRating: GOOGLE_RATING.bestRating,
    },
  };
}
