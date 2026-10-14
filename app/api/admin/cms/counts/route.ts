import prisma from '../../../../../lib/prisma';
import { cmsGet } from '../../../../../lib/cms/adminHandler';

async function count(fn: () => Promise<number>) {
  try {
    return await fn();
  } catch {
    return 0;
  }
}

export const dynamic = 'force-dynamic';

export async function GET() {
  return cmsGet(async () => ({
    canonicals: await count(() => prisma.canonicalTag.count()),
    seo: await count(() => prisma.seoPage.count()),
    menus: await count(() => prisma.menuItem.count()),
    footerLinks: await count(() => prisma.footerLink.count()),
    topStrip: await count(() => prisma.topStrip.count()),
  }));
}
