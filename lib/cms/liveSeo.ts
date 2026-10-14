import type { Metadata } from 'next';
import { getSiteUrl, normalizeCanonicalUrl } from '../seo';
import { metadata as homeMeta } from '../../app/metadata';
import { metadata as aboutMeta } from '../../app/about/metadata';
import { metadata as servicesMeta } from '../../app/services/metadata';
import { metadata as portfolioMeta } from '../../app/portfolio/metadata';
import { metadata as blogMeta } from '../../app/blog/metadata';
import { metadata as contactMeta } from '../../app/contact/metadata';
import { metadata as pricingMeta } from '../../app/pricing/metadata';
import { metadata as aeoGeoMeta } from '../../app/services/aeo-geo/metadata';
import { metadata as analyticsMeta } from '../../app/services/analytics/metadata';
import { metadata as aiMeta } from '../../app/services/ai/metadata';
import { metadata as appDevMeta } from '../../app/services/app-development/metadata';
import { metadata as cloudMeta } from '../../app/services/cloud/metadata';
import { metadata as ecommerceMeta } from '../../app/services/ecommerce/metadata';
import { metadata as mobileAppsMeta } from '../../app/services/mobile-apps/metadata';
import { metadata as organicSeoMeta } from '../../app/services/organic-seo/metadata';
import { metadata as paidPromoMeta } from '../../app/services/paid-promotion/metadata';
import { metadata as ppcMeta } from '../../app/services/ppc/metadata';
import { metadata as seoMeta } from '../../app/services/seo/metadata';
import { metadata as softwareMeta } from '../../app/services/software/metadata';
import { metadata as softwareDevMeta } from '../../app/services/software-development/metadata';
import { metadata as uiDesignMeta } from '../../app/services/ui-design/metadata';
import { metadata as webDevMeta } from '../../app/services/web-development/metadata';
import { metadata as wordpressMeta } from '../../app/services/wordpress/metadata';
import { metadata as afulaMeta } from '../../app/services/bniyat-atarim-afula/metadata';
import { metadata as binyaminaMeta } from '../../app/services/bniyat-atarim-binyamina/metadata';
import { metadata as caesareaMeta } from '../../app/services/bniyat-atarim-caesarea/metadata';
import { metadata as haderaMeta } from '../../app/services/bniyat-atarim-hadera/metadata';
import { metadata as haifaMeta } from '../../app/services/bniyat-atarim-haifa/metadata';
import { metadata as netanyaMeta } from '../../app/services/bniyat-atarim-netanya/metadata';
import { metadata as orAkivaMeta } from '../../app/services/bniyat-atarim-or-akiva/metadata';
import { metadata as pardesHanaMeta } from '../../app/services/bniyat-atarim-pardes-hana/metadata';
import { metadata as yokneamMeta } from '../../app/services/bniyat-atarim-yokneam/metadata';
import { metadata as zichronMeta } from '../../app/services/bniyat-atarim-zichron-yaakov/metadata';
import { metadata as kamaOlehMeta } from '../../app/blog/kama-oleh-bniyat-atar-2026/metadata';

export type LiveSeoRow = {
  page: string;
  path: string;
  title: string;
  description: string;
  keywords: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  canonicalUrl: string;
  robots: string;
};

function titleOf(meta: Metadata): string {
  const title = meta.title;
  if (typeof title === 'string') return title;
  if (title && typeof title === 'object') {
    if ('absolute' in title && title.absolute) return String(title.absolute);
    if ('default' in title && title.default) return String(title.default);
  }
  return '';
}

function keywordsOf(meta: Metadata): string {
  const value = meta.keywords;
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return value.join(', ');
  return '';
}

function ogTitleOf(meta: Metadata, fallback: string): string {
  const og = meta.openGraph && typeof meta.openGraph === 'object' ? meta.openGraph : null;
  return (og && 'title' in og && og.title ? String(og.title) : fallback);
}

function ogDescriptionOf(meta: Metadata, fallback: string): string {
  const og = meta.openGraph && typeof meta.openGraph === 'object' ? meta.openGraph : null;
  return (og && 'description' in og && og.description ? String(og.description) : fallback);
}

function ogImageOf(meta: Metadata): string {
  const og = meta.openGraph && typeof meta.openGraph === 'object' ? meta.openGraph : null;
  const images = og && 'images' in og ? og.images : undefined;
  if (Array.isArray(images) && images[0]) {
    const first = images[0];
    if (typeof first === 'string') return first;
    if (first && typeof first === 'object' && 'url' in first) return String(first.url);
  }
  if (typeof images === 'string') return images;
  return '';
}

function robotsOf(meta: Metadata): string {
  const robots = meta.robots;
  if (typeof robots === 'string') return robots;
  if (robots && typeof robots === 'object') {
    const index = 'index' in robots && robots.index === false ? 'noindex' : 'index';
    const follow = 'follow' in robots && robots.follow === false ? 'nofollow' : 'follow';
    return `${index}, ${follow}`;
  }
  return 'index, follow';
}

function canonicalOf(path: string, meta: Metadata): string {
  const raw = meta.alternates?.canonical;
  const value = typeof raw === 'string' ? raw : '';
  return normalizeCanonicalUrl(value, path);
}

function pageKey(path: string): string {
  return path === '/' ? 'home' : path.replace(/^\//, '');
}

export function flattenLiveMetadata(path: string, meta: Metadata): LiveSeoRow {
  const title = titleOf(meta);
  const description = typeof meta.description === 'string' ? meta.description : '';
  return {
    page: pageKey(path),
    path,
    title,
    description,
    keywords: keywordsOf(meta),
    ogTitle: ogTitleOf(meta, title),
    ogDescription: ogDescriptionOf(meta, description),
    ogImage: ogImageOf(meta),
    canonicalUrl: canonicalOf(path, meta),
    robots: robotsOf(meta),
  };
}

const INLINE_PAGES: Array<{ path: string; meta: Metadata }> = [
  {
    path: '/privacy-policy',
    meta: {
      title: 'מדיניות פרטיות | עדי פון תקשורת',
      description:
        'מדיניות פרטיות בהתאם לתיקון 13 לחוק הגנת הפרטיות: מטרות עיבוד, בסיס משפטי, עוגיות, זכויות משתמשים ופרטי קשר.',
      alternates: { canonical: '/privacy-policy' },
    },
  },
  {
    path: '/thank-you',
    meta: {
      title: 'תודה על פנייתך',
      robots: { index: false, follow: false },
    },
  },
  {
    path: '/accessibility-statement',
    meta: {
      title: 'הצהרת נגישות',
      description:
        'הצהרת הנגישות של אתר Top Webstak מבית עדי פון תקשורת: אמצעי הנגישות באתר, הוראות שימוש ודרכי פנייה בנושא נגישות.',
      alternates: { canonical: '/accessibility-statement' },
      robots: { index: true, follow: true },
    },
  },
];

const METADATA_PAGES: Array<{ path: string; meta: Metadata }> = [
  { path: '/', meta: homeMeta },
  { path: '/about', meta: aboutMeta },
  { path: '/services', meta: servicesMeta },
  { path: '/portfolio', meta: portfolioMeta },
  { path: '/blog', meta: blogMeta },
  { path: '/contact', meta: contactMeta },
  { path: '/pricing', meta: pricingMeta },
  { path: '/services/aeo-geo', meta: aeoGeoMeta },
  { path: '/services/analytics', meta: analyticsMeta },
  { path: '/services/ai', meta: aiMeta },
  { path: '/services/app-development', meta: appDevMeta },
  { path: '/services/cloud', meta: cloudMeta },
  { path: '/services/ecommerce', meta: ecommerceMeta },
  { path: '/services/mobile-apps', meta: mobileAppsMeta },
  { path: '/services/organic-seo', meta: organicSeoMeta },
  { path: '/services/paid-promotion', meta: paidPromoMeta },
  { path: '/services/ppc', meta: ppcMeta },
  { path: '/services/seo', meta: seoMeta },
  { path: '/services/software', meta: softwareMeta },
  { path: '/services/software-development', meta: softwareDevMeta },
  { path: '/services/ui-design', meta: uiDesignMeta },
  { path: '/services/web-development', meta: webDevMeta },
  { path: '/services/wordpress', meta: wordpressMeta },
  { path: '/services/bniyat-atarim-afula', meta: afulaMeta },
  { path: '/services/bniyat-atarim-binyamina', meta: binyaminaMeta },
  { path: '/services/bniyat-atarim-caesarea', meta: caesareaMeta },
  { path: '/services/bniyat-atarim-hadera', meta: haderaMeta },
  { path: '/services/bniyat-atarim-haifa', meta: haifaMeta },
  { path: '/services/bniyat-atarim-netanya', meta: netanyaMeta },
  { path: '/services/bniyat-atarim-or-akiva', meta: orAkivaMeta },
  { path: '/services/bniyat-atarim-pardes-hana', meta: pardesHanaMeta },
  { path: '/services/bniyat-atarim-yokneam', meta: yokneamMeta },
  { path: '/services/bniyat-atarim-zichron-yaakov', meta: zichronMeta },
  { path: '/blog/kama-oleh-bniyat-atar-2026', meta: kamaOlehMeta },
  ...INLINE_PAGES,
];

export const LIVE_SEO: Record<string, LiveSeoRow> = Object.fromEntries(
  METADATA_PAGES.map(({ path, meta }) => {
    const row = flattenLiveMetadata(path, meta);
    return [row.page, row];
  })
);

export function seoLookupKeys(path: string): string[] {
  const keys = [path, path.replace(/^\//, ''), pageKey(path)];
  if (path === '/') keys.push('home');
  return Array.from(new Set(keys.filter(Boolean)));
}

export function absoluteCanonical(path: string): string {
  return normalizeCanonicalUrl(null, path === '/' ? '/' : path);
}

export { getSiteUrl };
