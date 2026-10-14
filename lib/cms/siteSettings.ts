import prisma from '../prisma';
import { GA4_MEASUREMENT_ID } from '../tracking';
import { cmsRead, isCmsEnabled } from './enabled';

export async function getSiteSettings() {
  return cmsRead(async () => {
    const row = await prisma.siteSetting.findFirst();
    if (!row || !isCmsEnabled(row)) return null;
    return row;
  });
}

export const GTM_CONTAINER_ID = 'GTM-NHQ4DRWX';

export async function getTrackingIds() {
  const settings = await getSiteSettings();
  return {
    ga: settings?.googleAnalyticsId?.trim() || GA4_MEASUREMENT_ID,
    gtm: settings?.googleTagManagerId?.trim() || GTM_CONTAINER_ID,
    pixel: settings?.facebookPixelId?.trim() || '',
  };
}
