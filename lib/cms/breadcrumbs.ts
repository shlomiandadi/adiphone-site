import prisma from '../prisma';
import { cmsCache } from './cache';
import { cmsRead, isCmsEnabled } from './enabled';
import type { CmsBreadcrumbItem } from './breadcrumbShared';

export type { CmsBreadcrumbItem } from './breadcrumbShared';
export { fallbackBreadcrumbItems, breadcrumbJsonLd, lookupCmsBreadcrumbs } from './breadcrumbShared';

export const getBreadcrumbMap = cmsCache(
  'cms-breadcrumb-map',
  async (): Promise<Record<string, CmsBreadcrumbItem[]>> => {
    const map = await cmsRead(async () => {
      const next: Record<string, CmsBreadcrumbItem[]> = {};

      const overrides = await prisma.breadcrumb.findMany({
        where: { isActive: true },
      });
      for (const row of overrides) {
        if (!isCmsEnabled(row) || !Array.isArray(row.breadcrumbData)) continue;
        next[row.pageSlug] = row.breadcrumbData as CmsBreadcrumbItem[];
      }

      const nodes = await prisma.pageHierarchy.findMany({
        where: { isActive: true, showInBreadcrumb: true },
        orderBy: [{ level: 'asc' }, { order: 'asc' }],
      });
      const enabled = nodes.filter((node) => isCmsEnabled(node));
      const byId = new Map(enabled.map((node) => [node.id, node]));

      for (const current of enabled) {
        if (next[current.pageSlug]) continue;
        const chain = [current];
        let parentId = current.parentId;
        while (parentId && byId.has(parentId)) {
          const parent = byId.get(parentId)!;
          chain.unshift(parent);
          parentId = parent.parentId;
        }
        next[current.pageSlug] = chain.map((node, index) => ({
          url: node.pageSlug,
          title: node.breadcrumbTitle || node.pageTitle,
          isActive: index === chain.length - 1,
        }));
      }

      return next;
    });
    return map || {};
  }
);

export async function getCmsBreadcrumbs(pathname: string): Promise<CmsBreadcrumbItem[] | null> {
  const map = await getBreadcrumbMap();
  return map[pathname] || null;
}
