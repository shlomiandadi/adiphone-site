import { NextRequest } from 'next/server';
import prisma from '../../../../../lib/prisma';
import { stamp, touch, revalidateLayout } from '../../../../../lib/cms/admin';
import { cmsGet, cmsWrite } from '../../../../../lib/cms/adminHandler';

export const dynamic = 'force-dynamic';

export async function GET() {
  return cmsGet(async () => ({
    pages: await prisma.cmsPage.findMany({ orderBy: { updatedAt: 'desc' } }),
    templates: await prisma.template.findMany({ orderBy: { name: 'asc' } }),
  }));
}

export async function PUT(request: NextRequest) {
  return cmsWrite(async () => {
    const body = await request.json();
    const payload = {
      title: String(body.title || ''),
      slug: String(body.slug || '').replace(/^\//, ''),
      content: String(body.content || ''),
      excerpt: body.excerpt ? String(body.excerpt) : null,
      template: body.template || 'DEFAULT',
      published: Boolean(body.published),
      order: Number(body.order || 0),
      metaTitle: body.metaTitle ? String(body.metaTitle) : null,
      metaDesc: body.metaDesc ? String(body.metaDesc) : null,
      templateId: body.templateId ? String(body.templateId) : null,
      cmsEnabled: Boolean(body.cmsEnabled),
    };
    const row = body.id
      ? await prisma.cmsPage.update({ where: { id: String(body.id) }, data: { ...payload, ...touch() } })
      : await prisma.cmsPage.create({ data: { ...payload, ...stamp() } });
    revalidateLayout();
    return { page: row };
  });
}

export async function DELETE(request: NextRequest) {
  return cmsWrite(async () => {
    const { id } = await request.json();
    await prisma.cmsPage.delete({ where: { id: String(id) } });
    revalidateLayout();
    return { ok: true };
  });
}
