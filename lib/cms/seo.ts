import type { Metadata } from 'next';
import prisma from '../prisma';
import { cmsRead, isCmsEnabled } from './enabled';

const PAGE_KEY_BY_PATH: Record<string, string> = {
  '/': 'home',
  '/about': 'about',
  '/services': 'services',
  '/portfolio': 'portfolio',
  '/blog': 'blog',
  '/contact': 'contact',
};

export async function getCmsSeo(pageKeyOrPath: string) {
  return cmsRead(async () => {
    const key = PAGE_KEY_BY_PATH[pageKeyOrPath] || pageKeyOrPath.replace(/^\//, '') || 'home';
    const row = await prisma.seoPage.findFirst({
      where: { page: key },
    });
    if (!row || !isCmsEnabled(row)) return null;
    return row;
  });
}

export async function getCmsCanonical(path: string) {
  return cmsRead(async () => {
    const row = await prisma.canonicalTag.findFirst({
      where: { pageSlug: path, isActive: true },
    });
    if (!row || !isCmsEnabled(row)) return null;
    return row.canonicalUrl;
  });
}

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
