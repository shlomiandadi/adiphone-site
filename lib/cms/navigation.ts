import prisma from '../prisma';
import type { NavigationItem } from '../../app/components/navigation-data';
import { cmsCache } from './cache';
import { cmsRead, isCmsEnabled } from './enabled';

function toNavItem(item: {
  title: string;
  url: string | null;
  icon: string | null;
  description?: string | null;
  children?: Array<{
    title: string;
    url: string | null;
    icon: string | null;
    description?: string | null;
  }>;
}): NavigationItem {
  return {
    name: item.title,
    href: item.url || '/',
    icon: item.icon || undefined,
    description: item.description || undefined,
    submenu: item.children?.length
      ? item.children.map((child) => ({
          name: child.title,
          href: child.url || '/',
          icon: child.icon || undefined,
          description: child.description || undefined,
        }))
      : undefined,
  };
}

export const getHeaderMenu = cmsCache('cms-header-menu', async (): Promise<NavigationItem[] | null> => {
  return cmsRead(async () => {
    const menu = await prisma.menu.findFirst({
      where: { location: 'HEADER_MAIN', isActive: true },
      include: {
        items: {
          where: { isActive: true, parentId: null },
          orderBy: { order: 'asc' },
          include: {
            children: {
              where: { isActive: true },
              orderBy: { order: 'asc' },
            },
          },
        },
      },
    });
    if (!menu || !isCmsEnabled(menu) || menu.items.length === 0) return null;

    return menu.items.map(toNavItem);
  });
});

export const getHeaderSetting = cmsCache('cms-header-setting', async () => {
  return cmsRead(async () => {
    const row = await prisma.headerSetting.findFirst();
    if (!row || !isCmsEnabled(row)) return null;
    return row;
  });
});
