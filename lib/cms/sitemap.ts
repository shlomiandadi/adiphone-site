import prisma from '../prisma';
import { cmsRead, isCmsEnabled } from './enabled';

export async function getSitemapSettings() {
  return cmsRead(async () => {
    const row = await prisma.sitemapSetting.findFirst();
    if (!row || !isCmsEnabled(row) || !row.isEnabled) return null;
    return row;
  });
}
