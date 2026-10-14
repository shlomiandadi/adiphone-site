import { NextRequest } from 'next/server';
import prisma from '../../../../../lib/prisma';
import { stamp, touch, revalidateLayout } from '../../../../../lib/cms/admin';
import { cmsGet, cmsWrite } from '../../../../../lib/cms/adminHandler';

export const dynamic = 'force-dynamic';

export async function GET() {
  return cmsGet(async () => ({
    templates: await prisma.template.findMany({
      orderBy: { name: 'asc' },
      include: { sections: { orderBy: { order: 'asc' } } },
    }),
  }));
}

export async function PUT(request: NextRequest) {
  return cmsWrite(async () => {
    const body = await request.json();
    if (body.kind === 'template') {
      const payload = {
        name: String(body.name || ''),
        description: body.description ? String(body.description) : null,
        cmsEnabled: Boolean(body.cmsEnabled),
      };
      const row = body.id
        ? await prisma.template.update({ where: { id: String(body.id) }, data: { ...payload, ...touch() } })
        : await prisma.template.create({ data: { ...payload, ...stamp() } });
      revalidateLayout();
      return { template: row };
    }
    let content = body.content;
    if (typeof content === 'string') {
      content = JSON.parse(content);
    }
    const payload = {
      type: String(body.type || 'content'),
      title: String(body.title || ''),
      content,
      order: Number(body.order || 0),
      templateId: String(body.templateId),
      cmsEnabled: Boolean(body.cmsEnabled),
    };
    const row = body.id
      ? await prisma.section.update({ where: { id: String(body.id) }, data: { ...payload, ...touch() } })
      : await prisma.section.create({ data: { ...payload, ...stamp() } });
    revalidateLayout();
    return { section: row };
  });
}

export async function DELETE(request: NextRequest) {
  return cmsWrite(async () => {
    const { id } = await request.json();
    await prisma.section.delete({ where: { id: String(id) } });
    revalidateLayout();
    return { ok: true };
  });
}
