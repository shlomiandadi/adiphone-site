import { NextRequest } from 'next/server';
import prisma from '../../../../../lib/prisma';
import { stamp, touch, revalidateLayout } from '../../../../../lib/cms/admin';
import { cmsGet, cmsWrite } from '../../../../../lib/cms/adminHandler';

export const dynamic = 'force-dynamic';

function asList(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String).map((item) => item.trim()).filter(Boolean);
  if (typeof value === 'string') {
    return value.split('\n').map((item) => item.trim()).filter(Boolean);
  }
  return [];
}

export async function GET() {
  return cmsGet(async () => ({
    row: await prisma.sitemapSetting.findFirst(),
  }));
}

export async function PUT(request: NextRequest) {
  return cmsWrite(async () => {
    const body = await request.json();
    const existing = await prisma.sitemapSetting.findFirst();
    const payload = {
      isEnabled: Boolean(body.isEnabled),
      includePages: Boolean(body.includePages),
      includePosts: Boolean(body.includePosts),
      includeCategories: Boolean(body.includeCategories),
      includePortfolio: Boolean(body.includePortfolio),
      excludePages: asList(body.excludePages),
      excludePaths: asList(body.excludePaths),
      priority: Number(body.priority || 0.8),
      changeFreq: String(body.changeFreq || 'weekly'),
      lastModified: body.lastModified ? new Date(body.lastModified) : new Date(),
      cmsEnabled: Boolean(body.cmsEnabled),
    };
    const row = existing
      ? await prisma.sitemapSetting.update({
          where: { id: existing.id },
          data: { ...payload, ...touch() },
        })
      : await prisma.sitemapSetting.create({ data: { ...payload, ...stamp() } });
    revalidateLayout();
    return { row };
  });
}
