import prisma from '../prisma';
import { cmsRead, isCmsEnabled } from './enabled';

export async function getFooter() {
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
}
