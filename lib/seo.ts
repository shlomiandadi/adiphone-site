const DEFAULT_SITE_URL = 'https://adi-phone.co.il';

/** Primary service URLs that own money keywords (avoid blog cannibalization). */
export const SERVICE_CANONICALS = {
  wordpress: '/services/wordpress',
  ppc: '/services/ppc',
  seo: '/services/seo',
  webDevelopment: '/services/web-development',
  mobileApps: '/services/mobile-apps',
  software: '/services/software',
  softwareDevelopment: '/services/software-development',
} as const;

/**
 * Per-post SEO overrides for blog posts.
 *
 * `metaTitle`/`metaDesc` are OPTIONAL: provide them only when the stored DB values
 * are weak and the code should win. For posts whose DB metaTitle/metaDesc were
 * rewritten, omit them here so the DB values are used (the blog template falls back
 * to `post.metaTitle`/`post.metaDesc`). `relatedService`/`relatedLabel` keep the
 * contextual "related service" CTA at the bottom of the post.
 *
 * Note: entries for posts that are now 301-redirected (e.g. kmpyynym-mmvmnym,
 * kydvm-mmvmn-ppc, bnyyt-atry-vvrdprs, nyhvl-kmpyynym-mmvmnym) were removed — those
 * URLs no longer render.
 */
export const BLOG_META_OVERRIDES: Record<
  string,
  { metaTitle?: string; metaDesc?: string; relatedService: string; relatedLabel: string }
> = {
  // DB meta was rewritten — prefer DB values, keep only the related-service CTA.
  'mvmchh-vvrdprs': {
    relatedService: SERVICE_CANONICALS.wordpress,
    relatedLabel: 'שירות בניית אתרי וורדפרס',
  },
  'nyhvl-kmpyyn-mmvmn': {
    relatedService: SERVICE_CANONICALS.ppc,
    relatedLabel: 'שירות ניהול קמפיינים ממומנים',
  },
};

export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_API_URL || DEFAULT_SITE_URL;
  return raw.replace(/\/$/, '').replace(/^http:\/\//i, 'https://');
}

/**
 * Force a safe self-referencing HTTPS canonical.
 * Fixes Ahrefs "Non-canonical in Sitemap" + "Canonical to Redirect" when DB stores http://.
 */
export function normalizeCanonicalUrl(
  input: string | null | undefined,
  fallbackPath: string
): string {
  const siteUrl = getSiteUrl();
  const fallback = fallbackPath.startsWith('http')
    ? fallbackPath.replace(/^http:\/\//i, 'https://')
    : `${siteUrl}${fallbackPath.startsWith('/') ? fallbackPath : `/${fallbackPath}`}`;

  if (!input || !input.trim()) return fallback.replace(/\/$/, '') || siteUrl;

  try {
    const url = new URL(input.trim(), siteUrl);
    url.protocol = 'https:';
    url.hash = '';
    if (
      url.hostname === 'adi-phone.co.il' ||
      url.hostname === 'www.adi-phone.co.il' ||
      url.hostname === 'localhost'
    ) {
      url.hostname = new URL(siteUrl).hostname;
    }
    const normalized = url.toString().replace(/\/$/, '');
    return normalized || fallback;
  } catch {
    return fallback.replace(/\/$/, '') || siteUrl;
  }
}

export function absoluteUrl(path: string): string {
  const siteUrl = getSiteUrl();
  if (path.startsWith('http')) return normalizeCanonicalUrl(path, path);
  return `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`;
}
