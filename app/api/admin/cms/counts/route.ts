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
    hierarchy: await count(() => prisma.pageHierarchy.count()),
    breadcrumbs: await count(() => prisma.breadcrumb.count()),
    canonicals: await count(() => prisma.canonicalTag.count()),
    seo: await count(() => prisma.seoPage.count()),
    menus: await count(() => prisma.menuItem.count()),
    footerLinks: await count(() => prisma.footerLink.count()),
    templates: await count(() => prisma.template.count()),
    sections: await count(() => prisma.section.count()),
    pages: await count(() => prisma.cmsPage.count()),
    topStrip: await count(() => prisma.topStrip.count()),
  }));
}
