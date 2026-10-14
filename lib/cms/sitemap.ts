import prisma from '../prisma';
import { cmsCache } from './cache';
import { cmsRead, isCmsEnabled } from './enabled';

export const getSitemapSettings = cmsCache('cms-sitemap-settings', async () => {
  return cmsRead(async () => {
    const row = await prisma.sitemapSetting.findFirst();
    if (!row || !isCmsEnabled(row) || !row.isEnabled) return null;
    return row;
  });
});
