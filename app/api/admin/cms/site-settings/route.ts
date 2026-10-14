import { NextRequest } from 'next/server';
import prisma from '../../../../../lib/prisma';
import { stamp, touch, revalidateLayout } from '../../../../../lib/cms/admin';
import { cmsGet, cmsWrite } from '../../../../../lib/cms/adminHandler';

export const dynamic = 'force-dynamic';

export async function GET() {
  return cmsGet(async () => ({
    row: await prisma.siteSetting.findFirst(),
  }));
}

export async function PUT(request: NextRequest) {
  return cmsWrite(async () => {
    const body = await request.json();
    const existing = await prisma.siteSetting.findFirst();
    const payload = {
      siteName: String(body.siteName || ''),
      siteDescription: body.siteDescription ? String(body.siteDescription) : null,
      siteKeywords: body.siteKeywords ? String(body.siteKeywords) : null,
      siteUrl: body.siteUrl ? String(body.siteUrl) : null,
      siteLogo: body.siteLogo ? String(body.siteLogo) : null,
      siteFavicon: body.siteFavicon ? String(body.siteFavicon) : null,
      googleAnalyticsId: body.googleAnalyticsId ? String(body.googleAnalyticsId) : null,
      googleTagManagerId: body.googleTagManagerId ? String(body.googleTagManagerId) : null,
      facebookPixelId: body.facebookPixelId ? String(body.facebookPixelId) : null,
      twitterHandle: body.twitterHandle ? String(body.twitterHandle) : null,
      facebookPage: body.facebookPage ? String(body.facebookPage) : null,
      instagramHandle: body.instagramHandle ? String(body.instagramHandle) : null,
      linkedinPage: body.linkedinPage ? String(body.linkedinPage) : null,
      cmsEnabled: Boolean(body.cmsEnabled),
    };
    const row = existing
      ? await prisma.siteSetting.update({
          where: { id: existing.id },
          data: { ...payload, ...touch() },
        })
      : await prisma.siteSetting.create({ data: { ...payload, ...stamp() } });
    revalidateLayout();
    return { row };
  });
}
