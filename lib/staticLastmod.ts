export const STATIC_ROUTES = [
  '',
  '/about',
  '/services',
  '/portfolio',
  '/blog',
  '/contact',
  '/pricing',
  '/privacy-policy',
  '/accessibility-statement',
  '/services/ai',
  '/services/analytics',
  '/services/cloud',
  '/services/ecommerce',
  '/services/mobile-apps',
  '/services/ppc',
  '/services/seo',
  '/services/aeo-geo',
  '/services/software-development',
  '/services/ui-design',
  '/services/web-development',
  '/services/website-tadmit',
  '/services/wordpress',
  '/blog/kama-oleh-bniyat-atar-2026',
  '/services/bniyat-atarim-pardes-hana',
  '/services/bniyat-atarim-hadera',
  '/services/bniyat-atarim-caesarea',
  '/services/bniyat-atarim-zichron-yaakov',
  '/services/bniyat-atarim-haifa',
  '/services/bniyat-atarim-netanya',
  '/services/bniyat-atarim-or-akiva',
  '/services/bniyat-atarim-binyamina',
  '/services/bniyat-atarim-yokneam',
  '/services/bniyat-atarim-afula',
] as const;

export type StaticLastmodMap = {
  source?: string;
  unshallowAttempted?: boolean;
  stillShallow?: boolean;
  routes?: Record<string, string>;
};

export function getStaticLastmodRoutes(
  data: StaticLastmodMap
): Record<string, string> {
  return data.routes && typeof data.routes === 'object' ? data.routes : {};
}

/**
 * Per-route lastmod from the prebuild git map.
 * Missing or invalid dates are omitted — never invent a date, and never
 * apply a single CMS lastModified to every static URL.
 */
export function resolveStaticLastModified(
  route: string,
  data: StaticLastmodMap
): Date | undefined {
  const iso = getStaticLastmodRoutes(data)[route];
  if (typeof iso !== 'string' || !iso.trim()) return undefined;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return undefined;
  return date;
}
