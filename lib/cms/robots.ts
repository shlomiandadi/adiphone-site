import type { MetadataRoute } from 'next';
import prisma from '../prisma';
import { getSiteUrl } from '../seo';
import { cmsCache } from './cache';
import { cmsRead, isCmsEnabled } from './enabled';

const BLOCKED = ['/', '/_next', '/_next/', '/_next/*'];

export function isSafeRobotsConfig(disallowPaths: string[] | null | undefined, allowPaths?: string[] | null) {
  const disallows = (disallowPaths || []).map((path) => path.trim()).filter(Boolean);
  if (disallows.some((path) => BLOCKED.includes(path) || path === '/_next' || path.startsWith('/_next'))) {
    return false;
  }
  const allows = (allowPaths || []).map((path) => path.trim()).filter(Boolean);
  if (allows.length > 0 && !allows.includes('/')) {
    return false;
  }
  return true;
}

export const getValidatedRobots = cmsCache('cms-robots', async (): Promise<MetadataRoute.Robots | null> => {
  return cmsRead(async () => {
    const row = await prisma.robotsSetting.findFirst({
      where: { isActive: true },
    });
    if (!row || !isCmsEnabled(row)) return null;
    if (!isSafeRobotsConfig(row.disallowPaths, row.allowPaths)) return null;

    const siteUrl = getSiteUrl();
    const sitemap = row.sitemapUrl?.trim() || `${siteUrl}/sitemap.xml`;
    const disallow = (row.disallowPaths || []).filter((path) => path && path !== '/' && !path.startsWith('/_next'));
    const allow = (row.allowPaths || []).length ? row.allowPaths : ['/'];

    return {
      rules: {
        userAgent: row.userAgent || '*',
        allow,
        disallow: disallow.length ? disallow : ['/admin/', '/api/'],
      },
      sitemap,
    };
  });
});
