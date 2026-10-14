import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';
import { jsonError, requireCmsAdmin, stamp, touch, revalidateLayout } from '../../../../../lib/cms/admin';
import { cmsGet } from '../../../../../lib/cms/adminHandler';
import { isSafeRobotsConfig } from '../../../../../lib/cms/robots';

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
    row: await prisma.robotsSetting.findFirst(),
  }));
}

export async function PUT(request: NextRequest) {
  const unauthorized = await requireCmsAdmin();
  if (unauthorized) return unauthorized;
  try {
    const body = await request.json();
    const allowPaths = asList(body.allowPaths);
    const disallowPaths = asList(body.disallowPaths);
    if (body.cmsEnabled && !isSafeRobotsConfig(disallowPaths, allowPaths)) {
      return jsonError(
        'לא ניתן להפעיל: אסור לחסום / או /_next, ורשימת Allow חייבת לכלול /'
      );
    }
    const existing = await prisma.robotsSetting.findFirst();
    const payload = {
      userAgent: String(body.userAgent || '*'),
      allowPaths,
      disallowPaths,
      crawlDelay: Number(body.crawlDelay || 0),
      sitemapUrl: body.sitemapUrl ? String(body.sitemapUrl) : 'https://adi-phone.co.il/sitemap.xml',
      isActive: Boolean(body.isActive),
      cmsEnabled: Boolean(body.cmsEnabled),
    };
    const row = existing
      ? await prisma.robotsSetting.update({
          where: { id: existing.id },
          data: { ...payload, ...touch() },
        })
      : await prisma.robotsSetting.create({ data: { ...payload, ...stamp() } });
    revalidateLayout();
    return NextResponse.json({ row });
  } catch (error) {
    console.error('CMS robots write failed:', error);
    return jsonError(error instanceof Error ? error.message : 'CMS write failed', 500);
  }
}
