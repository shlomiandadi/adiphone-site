import prisma from '../prisma';
import { cmsCache } from './cache';
import { cmsRead, isCmsEnabled } from './enabled';

export const getFooter = cmsCache('cms-footer', async () => {
  return cmsRead(async () => {
    const row = await prisma.footerSetting.findFirst({
      include: {
        columns: {
          where: { isActive: true },
          orderBy: { order: 'asc' },
          include: {
            links: {
              where: { isActive: true },
              orderBy: { order: 'asc' },
            },
          },
        },
      },
    });
    if (!row || !isCmsEnabled(row)) return null;
    const hasLinks = row.columns.some((column) => column.links.length > 0);
    if (!hasLinks) return null;
    return row;
  });
});
