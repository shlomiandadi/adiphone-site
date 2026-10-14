import { NextRequest } from 'next/server';
import prisma from '../../../../../lib/prisma';
import { stamp, touch, revalidateLayout } from '../../../../../lib/cms/admin';
import { cmsGet, cmsWrite } from '../../../../../lib/cms/adminHandler';

export const dynamic = 'force-dynamic';

export async function GET() {
  return cmsGet(async () => ({
    rows: await prisma.canonicalTag.findMany({ orderBy: { pageSlug: 'asc' } }),
  }));
}

export async function PUT(request: NextRequest) {
  return cmsWrite(async () => {
    const body = await request.json();
    const payload = {
      pageSlug: String(body.pageSlug || ''),
      canonicalUrl: String(body.canonicalUrl || ''),
      isActive: Boolean(body.isActive),
      cmsEnabled: Boolean(body.cmsEnabled),
    };
    const row = body.id
      ? await prisma.canonicalTag.update({
          where: { id: String(body.id) },
          data: { ...payload, ...touch() },
        })
      : await prisma.canonicalTag.create({ data: { ...payload, ...stamp() } });
    revalidateLayout();
    return { row };
  });
}

export async function DELETE(request: NextRequest) {
  return cmsWrite(async () => {
    const { id } = await request.json();
    await prisma.canonicalTag.delete({ where: { id: String(id) } });
    revalidateLayout();
    return { ok: true };
  });
}
