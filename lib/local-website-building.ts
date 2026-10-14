import type { Metadata } from 'next';
import { absoluteUrl } from './seo';

export const PHONE_DISPLAY = '050-9159951';
export const PHONE_TEL = '+972509159951';
export const PROVIDER_NAME = 'Top Webstak בנייה וקידום אתרים';
export const PROVIDER_EMAIL = 'adiphoneseo@gmail.com';
export const PROVIDER_STREET = 'זמיר 95';
export const PROVIDER_LOCALITY = 'פרדס חנה-כרכור';

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
  themeColor: '#2563eb',
};
