import prisma from '../prisma';
import type { NavigationItem } from '../../app/components/navigation-data';
import { cmsRead, isCmsEnabled } from './enabled';

export async function getHeaderMenu(): Promise<NavigationItem[] | null> {
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

    return menu.items.map((item) => ({
      name: item.title,
      href: item.url || '/',
      submenu: item.children.length
        ? item.children.map((child) => ({
            name: child.title,
            href: child.url || '/',
          }))
        : undefined,
    }));
  });
}

export async function getHeaderSetting() {
  return cmsRead(async () => {
    const row = await prisma.headerSetting.findFirst();
    if (!row || !isCmsEnabled(row)) return null;
    return row;
  });
}
