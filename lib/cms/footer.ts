import prisma from '../prisma';
import { cmsCache } from './cache';
import { cmsRead, isCmsEnabled } from './enabled';
import {
  columnKind,
  FOOTER_BRAND_NAME,
  FOOTER_DESCRIPTION,
  footerCopyrightLine,
  type FooterView,
} from './footerData';

export type { FooterView } from './footerData';

export const getFooter = cmsCache('cms-footer', async (): Promise<FooterView | null> => {
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

    return {
      name: row.logoAlt || FOOTER_BRAND_NAME,
      description: row.description || FOOTER_DESCRIPTION,
      copyrightText: footerCopyrightLine(row.copyrightText),
      columns: row.columns.map((column) => {
        const links = column.links.map((link) => ({
          id: link.id,
          title: link.title,
          url: link.url || '',
          icon: link.icon,
          openInNewTab: link.openInNewTab,
        }));
        return {
          id: column.id,
          title: column.title,
          kind: columnKind(column.title, links),
          links,
        };
      }),
    };
  });
});
