import prisma from '../prisma';
import { GA4_MEASUREMENT_ID } from '../tracking';
import { cmsCache } from './cache';
import { cmsRead, isCmsEnabled } from './enabled';

export const GTM_CONTAINER_ID = 'GTM-NHQ4DRWX';

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
  // Pixel only when site_settings is cmsEnabled AND the ID is non-empty.
  const pixel = settings && isCmsEnabled(settings) && pixelId ? pixelId : '';
  return {
    ga: settings?.googleAnalyticsId?.trim() || GA4_MEASUREMENT_ID,
    gtm: settings?.googleTagManagerId?.trim() || GTM_CONTAINER_ID,
    pixel,
  };
});
