import type { Metadata } from 'next';
import prisma from '../prisma';
import { cmsCache } from './cache';
import { cmsRead, isCmsEnabled } from './enabled';
import { seoLookupKeys } from './liveSeo';

export const getCmsSeo = cmsCache('cms-seo', async (pageKeyOrPath: string) => {
  return cmsRead(async () => {
    const keys = seoLookupKeys(pageKeyOrPath);
    const row = await prisma.seoPage.findFirst({
      where: { page: { in: keys } },
    });
    if (!row || !isCmsEnabled(row)) return null;
    return row;
  });
});

export const getCmsCanonical = cmsCache('cms-canonical', async (path: string) => {
  return cmsRead(async () => {
    const keys = seoLookupKeys(path);
    const row = await prisma.canonicalTag.findFirst({
      where: { pageSlug: { in: keys }, isActive: true },
    });
    if (!row || !isCmsEnabled(row)) return null;
    return row.canonicalUrl;
  });
});

/**
 * CMS metadata applies only when a row exists for this path AND cmsEnabled is true.
 * Wired through createSeoAgentGenerateMetadata / mergeSeoAgentMetadata on core pages
 * so static generation stays cached (unstable_cache, no headers()/cookies()).
 */
export async function mergeCmsMetadata(path: string, base: Metadata): Promise<Metadata> {
  const [seo, canonical] = await Promise.all([getCmsSeo(path), getCmsCanonical(path)]);
  if (!seo && !canonical) return base;

  const next: Metadata = { ...base };
  if (seo) {
    next.title = typeof base.title === 'object' && base.title && 'absolute' in base.title
      ? { absolute: seo.title }
      : seo.title;
    next.description = seo.description;
    next.keywords = seo.keywords;
    if (seo.robots) next.robots = seo.robots;
    const ogTitle = seo.ogTitle || seo.title;
    const ogDescription = seo.ogDescription || seo.description;
    next.openGraph = {
      ...(typeof base.openGraph === 'object' ? base.openGraph : {}),
      title: ogTitle,
      description: ogDescription,
      ...(seo.ogImage ? { images: [{ url: seo.ogImage }] } : {}),
      ...(seo.canonicalUrl ? { url: seo.canonicalUrl } : {}),
    };
  }
  const canonicalUrl = seo?.canonicalUrl || canonical;
  if (canonicalUrl) {
    next.alternates = {
      ...(base.alternates || {}),
      canonical: canonicalUrl,
    };
  }
  return next;
}
