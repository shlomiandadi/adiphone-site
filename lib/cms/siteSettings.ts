import prisma from '../prisma';
import { META_PIXEL_ID, resolveMetaPixelId } from '../thirdPartyTags';
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

/** Read at runtime so the value is not inlined into the client or server bundle. */
function blockedPixelId(): string {
  if (typeof process === 'undefined' || !process.env) return '';
  const value = process.env['FB_' + 'PIXEL_ID'];
  return typeof value === 'string' ? value : '';
}

export const getTrackingIds = cmsCache('cms-tracking-ids', async () => {
  const settings = await getSiteSettings();
  const pixelId = settings?.facebookPixelId?.trim() || '';
  // CMS pixel overrides the built-in id. An empty CMS value keeps the default.
  // FB_PIXEL_ID is not used as the live pixel; when it differs from the official
  // id it is refused so that value cannot be booted.
  const pixel = settings && isCmsEnabled(settings) && pixelId
    ? resolveMetaPixelId(pixelId, blockedPixelId())
    : META_PIXEL_ID;
  return {
    ga: settings?.googleAnalyticsId?.trim() || GA4_MEASUREMENT_ID,
    pixel,
  };
});
