import { NextRequest } from 'next/server';
import prisma from '../../../../../lib/prisma';
import { stamp, touch, revalidateLayout } from '../../../../../lib/cms/admin';
import { cmsGet, cmsWrite } from '../../../../../lib/cms/adminHandler';

export const dynamic = 'force-dynamic';

export async function GET() {
  return cmsGet(async () => ({
    rows: await prisma.breadcrumb.findMany({ orderBy: { pageSlug: 'asc' } }),
  }));
}

export async function PUT(request: NextRequest) {
  return cmsWrite(async () => {
    const body = await request.json();
    const { id, pageSlug, breadcrumbData, isActive, cmsEnabled } = body;
    let data: unknown = breadcrumbData;
    if (typeof breadcrumbData === 'string') {
      data = JSON.parse(breadcrumbData);
    }
    const payload = {
      pageSlug: String(pageSlug || ''),
      breadcrumbData: data as object,
      isActive: Boolean(isActive),
      cmsEnabled: Boolean(cmsEnabled),
    };
    const row = id
      ? await prisma.breadcrumb.update({
          where: { id: String(id) },
          data: { ...payload, ...touch() },
        })
      : await prisma.breadcrumb.create({ data: { ...payload, ...stamp() } });
    revalidateLayout();
    return { row };
  });
}

export async function DELETE(request: NextRequest) {
  return cmsWrite(async () => {
    const { id } = await request.json();
    await prisma.breadcrumb.delete({ where: { id: String(id) } });
    revalidateLayout();
    return { ok: true };
  });
}
