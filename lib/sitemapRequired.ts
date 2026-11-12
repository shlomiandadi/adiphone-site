import type { MetadataRoute } from 'next';

type LastmodMap = {
  routes?: Record<string, string>;
};

function dateFromMap(path: string, lastmod: LastmodMap): Date | undefined {
  const iso = lastmod.routes?.[path];
  if (typeof iso !== 'string' || !iso.trim()) return undefined;
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

/** Always emit these paths, even if CMS excludes or the posts query misses them. */
export const REQUIRED_SITEMAP_PATHS = [
  '/services/web-development/lawyers',
  '/services/web-development/clinics',
  '/services/web-development/accountants',
  '/services/aeo-geo',
  '/blog/mh-zh-seo',
  '/blog/ayk-lbchvr-chbrt-kydvm-atrym',
  '/blog/ptrvnvt-bann',
] as const;

function pathnameOf(url: string, baseUrl: string): string {
  try {
    const parsed = new URL(url, baseUrl);
    return parsed.pathname.replace(/\/$/, '') || '/';
  } catch {
    return url.replace(baseUrl, '').replace(/\/$/, '') || '/';
  }
}

function fallbackLastModified(path: string, lastmod: LastmodMap): Date | undefined {
  return (
    dateFromMap(path, lastmod) ||
    (path.startsWith('/blog/') ? dateFromMap('/blog', lastmod) : undefined) ||
    (path.startsWith('/services/') ? dateFromMap('/services', lastmod) : undefined)
  );
}

export function mergeRequiredSitemapUrls(
  entries: MetadataRoute.Sitemap,
  baseUrl: string,
  lastmod: LastmodMap,
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']
): MetadataRoute.Sitemap {
  const seen = new Set(entries.map((entry) => pathnameOf(entry.url, baseUrl)));
  const extra: MetadataRoute.Sitemap = [];

  for (const path of REQUIRED_SITEMAP_PATHS) {
    if (seen.has(path)) continue;
    const lastModified = fallbackLastModified(path, lastmod);
    extra.push({
      url: `${baseUrl}${path}`,
      ...(lastModified ? { lastModified } : {}),
      changeFrequency,
      priority: path.startsWith('/blog/') ? 0.7 : 0.8,
    });
  }

  return extra.length ? [...entries, ...extra] : entries;
}
