import { NextRequest } from 'next/server';
import prisma from '../../../../../lib/prisma';
import { stamp, touch, revalidateLayout } from '../../../../../lib/cms/admin';
import { cmsGet, cmsWrite } from '../../../../../lib/cms/adminHandler';

export const dynamic = 'force-dynamic';

export async function GET() {
  return cmsGet(async () => ({
    row: await prisma.topStrip.findFirst(),
  }));
}

export async function PUT(request: NextRequest) {
  return cmsWrite(async () => {
    const body = await request.json();
    const existing = await prisma.topStrip.findFirst();
    const payload = {
      text: String(body.text || ''),
      backgroundColor: String(body.backgroundColor || '#3b82f6'),
      textColor: String(body.textColor || '#ffffff'),
      isActive: Boolean(body.isActive),
      showCloseButton: Boolean(body.showCloseButton),
      linkUrl: body.linkUrl ? String(body.linkUrl) : null,
      linkText: body.linkText ? String(body.linkText) : null,
      cmsEnabled: Boolean(body.cmsEnabled),
    };
    const row = existing
      ? await prisma.topStrip.update({ where: { id: existing.id }, data: { ...payload, ...touch() } })
      : await prisma.topStrip.create({ data: { ...payload, ...stamp() } });
    revalidateLayout();
    return { row };
  });
}
