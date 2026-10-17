import prisma from '../prisma';
import { META_PIXEL_ID } from '../thirdPartyTags';
import { GA4_MEASUREMENT_ID } from '../tracking';
import { cmsCache } from './cache';
import { cmsRead, isCmsEnabled } from './enabled';

export const getSiteSettings = cmsCache('cms-site-settings', async () => {
  return cmsRead(async () => {
    const row = await prisma.siteSetting.findFirst();
    if (!row || !isCmsEnabled(row)) return null;
    return row;
  });
});

export const getTrackingIds = cmsCache('cms-tracking-ids', async () => {
  const settings = await getSiteSettings();
  const pixelId = settings?.facebookPixelId?.trim() || '';
  // CMS pixel overrides the built-in id. An empty CMS value keeps the default.
  const pixel = settings && isCmsEnabled(settings) && pixelId ? pixelId : META_PIXEL_ID;
  return {
    ga: settings?.googleAnalyticsId?.trim() || GA4_MEASUREMENT_ID,
    pixel,
  };
});
