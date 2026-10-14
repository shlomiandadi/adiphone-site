import { NextRequest } from 'next/server';
import prisma from '../../../../../lib/prisma';
import { stamp, touch, revalidateLayout } from '../../../../../lib/cms/admin';
import { cmsGet, cmsWrite } from '../../../../../lib/cms/adminHandler';

export const dynamic = 'force-dynamic';

export async function GET() {
  return cmsGet(async () => ({
    nodes: await prisma.pageHierarchy.findMany({
      orderBy: [{ level: 'asc' }, { order: 'asc' }],
    }),
  }));
}

export async function PUT(request: NextRequest) {
  return cmsWrite(async () => {
    const body = await request.json();
    const { id, ...data } = body as Record<string, unknown>;
    const payload = {
      pageId: String(data.pageId || ''),
      pageSlug: String(data.pageSlug || ''),
      pageTitle: String(data.pageTitle || ''),
      parentId: data.parentId ? String(data.parentId) : null,
      level: Number(data.level || 0),
      order: Number(data.order || 0),
      isActive: Boolean(data.isActive),
      showInBreadcrumb: Boolean(data.showInBreadcrumb),
      breadcrumbTitle: data.breadcrumbTitle ? String(data.breadcrumbTitle) : null,
      cmsEnabled: Boolean(data.cmsEnabled),
    };
    const row = id
      ? await prisma.pageHierarchy.update({
          where: { id: String(id) },
          data: { ...payload, ...touch() },
        })
      : await prisma.pageHierarchy.create({
          data: { ...payload, ...stamp() },
        });
    revalidateLayout();
    return { node: row };
  });
}

export async function DELETE(request: NextRequest) {
  return cmsWrite(async () => {
    const { id } = await request.json();
    await prisma.pageHierarchy.delete({ where: { id: String(id) } });
    revalidateLayout();
    return { ok: true };
  });
}
