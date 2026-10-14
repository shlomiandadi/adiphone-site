import prisma from '../prisma';
import { stamp, touch } from './admin';
import { LIVE_SEO } from './liveSeo';

export async function importLiveSeoAndCanonicals() {
  let seoCount = 0;
  let canonicalCount = 0;

  for (const live of Object.values(LIVE_SEO)) {
    const existingSeo = await prisma.seoPage.findFirst({ where: { page: live.page } });
    const seoPayload = {
      page: live.page,
      title: live.title,
      description: live.description,
      keywords: live.keywords,
      ogTitle: live.ogTitle || null,
      ogDescription: live.ogDescription || null,
      ogImage: live.ogImage || null,
      canonicalUrl: live.canonicalUrl || null,
      robots: live.robots || 'index, follow',
    };
    if (existingSeo) {
      await prisma.seoPage.update({
        where: { id: existingSeo.id },
        data: { ...seoPayload, ...touch() },
      });
    } else {
      await prisma.seoPage.create({
        data: { ...seoPayload, cmsEnabled: false, ...stamp() },
      });
    }
    seoCount += 1;

    const existingCanon = await prisma.canonicalTag.findFirst({ where: { pageSlug: live.path } });
    const canonPayload = {
      pageSlug: live.path,
      canonicalUrl: live.canonicalUrl,
      isActive: true,
    };
    if (existingCanon) {
      await prisma.canonicalTag.update({
        where: { id: existingCanon.id },
        data: { ...canonPayload, ...touch() },
      });
    } else {
      await prisma.canonicalTag.create({
        data: { ...canonPayload, cmsEnabled: false, ...stamp() },
      });
    }
    canonicalCount += 1;
  }

  return { seoCount, canonicalCount };
}
