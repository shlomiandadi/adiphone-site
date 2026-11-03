import type { Metadata } from 'next';
import { absoluteUrl } from './seo';

export const PHONE_DISPLAY = '050-9159951';
export const PHONE_TEL = '+972509159951';
export const PROVIDER_NAME = 'Top Webstak בנייה וקידום אתרים';
export const PROVIDER_EMAIL = 'adiphoneseo@gmail.com';
export const PROVIDER_STREET = 'זמיר 95';
export const PROVIDER_LOCALITY = 'פרדס חנה-כרכור';
export const PROVIDER_HOME_CITY = 'פרדס חנה';

const HE_GERESH = /[\u05B0-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7]/g;

/** Attach a Hebrew inseparable prefix (ב/ל/מ/כ) with no space. */
export function hebrewPrefix(prefix: 'ב' | 'ל' | 'מ' | 'כ', place: string): string {
  const name = place.trim();
  if (!name) return prefix;
  const first = name.replace(HE_GERESH, '')[0] || name[0];
  // Names that already begin with ה keep בהרצליה / להרצליה, not ב הרצליה.
  if (first === 'ה' || first === 'א' || first === 'ע') {
    return `${prefix}${name}`;
  }
  return `${prefix}${name}`;
}

export function inCity(cityName: string): string {
  return hebrewPrefix('ב', cityName);
}

export function toCity(cityName: string): string {
  return hebrewPrefix('ל', cityName);
}

export function isProviderHomeCity(cityName: string): boolean {
  const name = cityName.trim();
  return name === PROVIDER_HOME_CITY || name === PROVIDER_LOCALITY || name.startsWith('פרדס חנה');
}

/** Agency origin: from Pardes Hanna, near the target city — never "near itself". */
export function originFromPardesHana(cityName: string): string {
  if (isProviderHomeCity(cityName)) {
    return 'אנחנו יושבים בפרדס חנה ומלווים עסקים מקומיים בפגישה או מרחוק.';
  }
  return `אנחנו מגיעים מפרדס חנה, הקרובה ${toCity(cityName)}.`;
}

export const REGIONAL_PORTFOLIO_INTRO =
  'אנחנו מלווים לקוחות באזור מרחוק ובפגישה. דוגמאות אתרים מהתיק הכללי אפשר לראות בפורטפוליו.';

export type LocalFaqItem = {
  question: string;
  answer: string;
};

export type LocalCityLink = {
  path: string;
  name: string;
};

export type LocalCityContent = {
  path: string;
  cityName: string;
  heroLead: string;
  introTitle: string;
  introParagraphs: string[];
  localContextTitle: string;
  localContextParagraphs: string[];
  typicalBusinessesTitle: string;
  typicalBusinesses: { title: string; description: string }[];
  includedTitle: string;
  included: { title: string; description: string }[];
  servingTitle: string;
  servingParagraphs: string[];
  process: { title: string; description: string }[];
  areasIntro: string;
  nearbyTowns: string[];
  extraSection?: {
    title: string;
    paragraphs: string[];
    links: { href: string; label: string }[];
  };
  neighborhoods?: {
    title?: string;
    places: string[];
    paragraphs: string[];
  };
  localExamples?: {
    title: string;
    paragraphs: string[];
    href: string;
    label: string;
  };
  faq: LocalFaqItem[];
  ctaTitle: string;
  ctaText: string;
  areaServed: string[];
  serviceName: string;
};

export const LOCAL_WEBSITE_PAGES: readonly LocalCityLink[] = [
  { path: '/services/bniyat-atarim-pardes-hana', name: 'פרדס חנה' },
  { path: '/services/bniyat-atarim-hadera', name: 'חדרה' },
  { path: '/services/bniyat-atarim-caesarea', name: 'קיסריה' },
  { path: '/services/bniyat-atarim-zichron-yaakov', name: 'זכרון יעקב' },
  { path: '/services/bniyat-atarim-haifa', name: 'חיפה' },
  { path: '/services/bniyat-atarim-netanya', name: 'נתניה' },
  { path: '/services/bniyat-atarim-or-akiva', name: 'אור עקיבא' },
  { path: '/services/bniyat-atarim-binyamina', name: 'בנימינה' },
  { path: '/services/bniyat-atarim-yokneam', name: 'יוקנעם' },
  { path: '/services/bniyat-atarim-afula', name: 'עפולה' },
] as const;

export const LOCAL_WEBSITE_PAGE_PATHS = LOCAL_WEBSITE_PAGES.map((page) => page.path);

export function buildLocalCityMetadata({
  path,
  title,
  description,
  keywords,
  ogTitle,
  ogDescription,
}: {
  path: string;
  title: string;
  description: string;
  keywords: string;
  ogTitle?: string;
  ogDescription?: string;
}): Metadata {
  const canonical = absoluteUrl(path);
  return {
    title,
    description,
    keywords,
    alternates: {
      canonical,
    },
    openGraph: {
      title: ogTitle || title,
      description: ogDescription || description,
      url: canonical,
      type: 'website',
      locale: 'he_IL',
      siteName: 'Top Webstak',
    },
  };
}

export const localCityViewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#03173A',
};
