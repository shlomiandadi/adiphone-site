import prisma from '../prisma';
import { cmsCache } from './cache';
import { cmsRead, isCmsEnabled } from './enabled';

export const getActiveTopStrip = cmsCache('cms-top-strip', async () => {
  return cmsRead(async () => {
    const row = await prisma.topStrip.findFirst({
      where: { isActive: true },
    });
    if (!row || !isCmsEnabled(row)) return null;
    return row;
  });
});
