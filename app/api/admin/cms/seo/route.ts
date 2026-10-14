import { NextRequest } from 'next/server';
import prisma from '../../../../../lib/prisma';
import { LIVE_SEO, stamp, touch, revalidateLayout } from '../../../../../lib/cms/admin';
import { cmsGet, cmsWrite } from '../../../../../lib/cms/adminHandler';

export const dynamic = 'force-dynamic';

export async function GET() {
  return cmsGet(async () => ({
    rows: await prisma.seoPage.findMany({ orderBy: { page: 'asc' } }),
    live: LIVE_SEO,
  }));
}

export async function PUT(request: NextRequest) {
  return cmsWrite(async () => {
    const body = await request.json();
    const payload = {
      page: String(body.page || ''),
      title: String(body.title || ''),
      description: String(body.description || ''),
      keywords: String(body.keywords || ''),
      ogTitle: body.ogTitle ? String(body.ogTitle) : null,
      ogDescription: body.ogDescription ? String(body.ogDescription) : null,
      ogImage: body.ogImage ? String(body.ogImage) : null,
      canonicalUrl: body.canonicalUrl ? String(body.canonicalUrl) : null,
      robots: String(body.robots || 'index, follow'),
      cmsEnabled: Boolean(body.cmsEnabled),
    };
    const row = body.id
      ? await prisma.seoPage.update({
          where: { id: String(body.id) },
          data: { ...payload, ...touch() },
        })
      : await prisma.seoPage.create({ data: { ...payload, ...stamp() } });
    revalidateLayout();
    return { row };
  });
}
