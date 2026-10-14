import type { Metadata } from 'next';
import prisma from '../prisma';
import { normalizeCanonicalUrl } from '../seo';
import { cmsCache } from './cache';
import { cmsRead, isCmsEnabled } from './enabled';
import {
  exactPathKeys,
  mergeOpenGraph,
  metadataKeywords,
  metadataTitle,
  nonEmpty,
  rowMatchesExactPath,
  shouldApplyRobots,
  withTitle,
} from './seoMerge';

export const getCmsSeo = cmsCache('cms-seo', async (path: string) => {
  return cmsRead(async () => {
    const keys = exactPathKeys(path);
    const row = await prisma.seoPage.findFirst({
      where: { page: { in: keys } },
    });
    if (!row || !isCmsEnabled(row) || !rowMatchesExactPath(row.page, path)) return null;
    return row;
  });
});

export const getCmsCanonical = cmsCache('cms-canonical', async (path: string) => {
  return cmsRead(async () => {
    const keys = exactPathKeys(path);
    const row = await prisma.canonicalTag.findFirst({
      where: { pageSlug: { in: keys }, isActive: true },
    });
    if (!row || !isCmsEnabled(row) || !rowMatchesExactPath(row.pageSlug, path)) return null;
    return row.canonicalUrl;
  });
});

/**
 * CMS metadata applies only when a row exists for this exact path AND cmsEnabled.
 * Robots / OG / Twitter are patched field-by-field; implicit defaults are left alone
 * so enabling an imported row does not rewrite 48 pages.
 */
export async function mergeCmsMetadata(path: string, base: Metadata): Promise<Metadata> {
  const [seo, canonical] = await Promise.all([getCmsSeo(path), getCmsCanonical(path)]);
  if (!seo && !canonical) return base;

  const next: Metadata = { ...base };
  if (seo) {
    if (nonEmpty(seo.title) && seo.title !== metadataTitle(base)) {
      next.title = withTitle(base, seo.title);
    }
    if (nonEmpty(seo.description) && seo.description !== (base.description || '')) {
      next.description = seo.description;
    }
    if (nonEmpty(seo.keywords) && metadataKeywords(base) && seo.keywords !== metadataKeywords(base)) {
      next.keywords = seo.keywords;
    }
    if (shouldApplyRobots(seo.robots, base)) {
      next.robots = seo.robots;
    }

    const openGraph = mergeOpenGraph(base, {
      title: seo.ogTitle && seo.ogTitle !== metadataTitle(base) ? seo.ogTitle : null,
      description:
        seo.ogDescription && seo.ogDescription !== (base.description || '') ? seo.ogDescription : null,
      image: seo.ogImage,
    });
    if (openGraph) next.openGraph = openGraph;
  }

  const canonicalUrl = nonEmpty(seo?.canonicalUrl) ? seo!.canonicalUrl : canonical;
  if (nonEmpty(canonicalUrl)) {
    const currentCanonical = typeof base.alternates?.canonical === 'string' ? base.alternates.canonical : null;
    const currentNorm = normalizeCanonicalUrl(currentCanonical, path);
    const incomingNorm = normalizeCanonicalUrl(canonicalUrl, path);
    if (incomingNorm !== currentNorm) {
      next.alternates = {
        ...(base.alternates || {}),
        canonical: canonicalUrl,
      };
    }
  }
  return next;
}

export {
  exactPathKeys,
  shouldApplyRobots,
  mergeOpenGraph,
} from './seoMerge';
