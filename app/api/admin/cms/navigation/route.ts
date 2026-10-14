import { NextRequest } from 'next/server';
import prisma from '../../../../../lib/prisma';
import { parseMenuLocation, stamp, touch, revalidateLayout } from '../../../../../lib/cms/admin';
import { cmsGet, cmsWrite } from '../../../../../lib/cms/adminHandler';
import { navigation } from '../../../../../app/components/navigation-data';

export const dynamic = 'force-dynamic';

export async function GET() {
  return cmsGet(async () => {
    const header = await prisma.headerSetting.findFirst();
    const menus = await prisma.menu.findMany({
      orderBy: { createdAt: 'asc' },
      include: {
        items: {
          orderBy: { order: 'asc' },
          include: { children: { orderBy: { order: 'asc' } } },
        },
      },
    });
    return { header, menus };
  });
}

export async function PUT(request: NextRequest) {
  return cmsWrite(async () => {
    const body = await request.json();
    if (body.kind === 'header') {
      const existing = await prisma.headerSetting.findFirst();
      const payload = {
        logo: body.logo ? String(body.logo) : null,
        logoAlt: body.logoAlt ? String(body.logoAlt) : null,
        logoWidth: Number(body.logoWidth || 150),
        logoHeight: Number(body.logoHeight || 50),
        showSearch: Boolean(body.showSearch),
        searchPlaceholder: String(body.searchPlaceholder || 'חיפוש...'),
        showContactButton: Boolean(body.showContactButton),
        contactButtonText: String(body.contactButtonText || 'צור קשר'),
        contactButtonLink: String(body.contactButtonLink || '/contact'),
        backgroundColor: String(body.backgroundColor || '#ffffff'),
        textColor: String(body.textColor || '#000000'),
        stickyHeader: Boolean(body.stickyHeader),
        showLanguageSwitcher: Boolean(body.showLanguageSwitcher),
        languages: Array.isArray(body.languages) ? body.languages.map(String) : [],
        cmsEnabled: Boolean(body.cmsEnabled),
      };
      const row = existing
        ? await prisma.headerSetting.update({ where: { id: existing.id }, data: { ...payload, ...touch() } })
        : await prisma.headerSetting.create({ data: { ...payload, ...stamp() } });
      revalidateLayout();
      return { header: row };
    }

    if (body.kind === 'menu') {
      const payload = {
        name: String(body.name || ''),
        location: parseMenuLocation(body.location),
        isActive: Boolean(body.isActive),
        cmsEnabled: Boolean(body.cmsEnabled),
      };
      const row = body.id
        ? await prisma.menu.update({ where: { id: String(body.id) }, data: { ...payload, ...touch() } })
        : await prisma.menu.create({ data: { ...payload, ...stamp() } });
      revalidateLayout();
      return { menu: row };
    }

    const itemPayload = {
      title: String(body.title || ''),
      url: body.url ? String(body.url) : '/',
      order: Number(body.order || 0),
      isActive: body.isActive !== false,
      openInNewTab: Boolean(body.openInNewTab),
      icon: body.icon ? String(body.icon) : null,
      cssClass: body.cssClass ? String(body.cssClass) : null,
      menuId: String(body.menuId),
      parentId: body.parentId ? String(body.parentId) : null,
      cmsEnabled: Boolean(body.cmsEnabled),
    };
    const item = body.id
      ? await prisma.menuItem.update({ where: { id: String(body.id) }, data: { ...itemPayload, ...touch() } })
      : await prisma.menuItem.create({ data: { ...itemPayload, ...stamp() } });
    revalidateLayout();
    return { item };
  });
}

export async function POST(request: NextRequest) {
  return cmsWrite(async () => {
    const body = await request.json().catch(() => ({}));
    if (body.action !== 'import') {
      throw new Error('Unknown action');
    }
    let menu = await prisma.menu.findFirst({ where: { location: 'HEADER_MAIN' } });
    if (!menu) {
      menu = await prisma.menu.create({
        data: {
          name: 'תפריט ראשי',
          location: 'HEADER_MAIN',
          isActive: true,
          ...stamp(),
          cmsEnabled: false,
        },
      });
    }
    await prisma.menuItem.deleteMany({ where: { menuId: menu.id } });
    let order = 1;
    for (const item of navigation) {
      const parent = await prisma.menuItem.create({
        data: {
          title: item.name,
          url: item.href,
          order: order++,
          isActive: true,
          openInNewTab: false,
          icon: item.icon || null,
          menuId: menu.id,
          ...stamp(),
          cmsEnabled: false,
        },
      });
      let childOrder = 1;
      for (const child of item.submenu || []) {
        await prisma.menuItem.create({
          data: {
            title: child.name,
            url: child.href,
            order: childOrder++,
            isActive: true,
            openInNewTab: false,
            icon: child.icon || null,
            menuId: menu.id,
            parentId: parent.id,
            ...stamp(),
            cmsEnabled: false,
          },
        });
      }
    }
    revalidateLayout();
    return { ok: true, menuId: menu.id };
  });
}

export async function DELETE(request: NextRequest) {
  return cmsWrite(async () => {
    const { id } = await request.json();
    await prisma.menuItem.delete({ where: { id: String(id) } });
    revalidateLayout();
    return { ok: true };
  });
}
