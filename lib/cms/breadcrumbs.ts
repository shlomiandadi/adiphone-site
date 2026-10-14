import prisma from '../prisma';
import { getSiteUrl } from '../seo';
import { cmsRead, isCmsEnabled } from './enabled';

export type CmsBreadcrumbItem = {
  url: string;
  title: string;
  isActive?: boolean;
};

/** Matches the current client Breadcrumbs.tsx labels (capitalized slug). */
export function fallbackBreadcrumbItems(pathname: string): CmsBreadcrumbItem[] {
  const paths = pathname.split('/').filter(Boolean);
  const items: CmsBreadcrumbItem[] = [];
  let current = '';
  paths.forEach((path, index) => {
    current += `/${path}`;
    items.push({
      url: current,
      title: path.charAt(0).toUpperCase() + path.slice(1),
      isActive: index === paths.length - 1,
    });
  });
  return items;
}

export async function getCmsBreadcrumbs(pathname: string): Promise<CmsBreadcrumbItem[] | null> {
  return cmsRead(async () => {
    const override = await prisma.breadcrumb.findFirst({
      where: { pageSlug: pathname, isActive: true },
    });
    if (override && isCmsEnabled(override) && Array.isArray(override.breadcrumbData)) {
      return override.breadcrumbData as CmsBreadcrumbItem[];
    }

    const nodes = await prisma.pageHierarchy.findMany({
      where: { isActive: true, showInBreadcrumb: true },
      orderBy: [{ level: 'asc' }, { order: 'asc' }],
    });
    const current = nodes.find((node) => node.pageSlug === pathname);
    if (!current || !isCmsEnabled(current)) return null;

    const byId = new Map(nodes.map((node) => [node.id, node]));
    const chain = [current];
    let parentId = current.parentId;
    while (parentId && byId.has(parentId)) {
      const parent = byId.get(parentId)!;
      chain.unshift(parent);
      parentId = parent.parentId;
    }

    return chain.map((node, index) => ({
      url: node.pageSlug,
      title: node.breadcrumbTitle || node.pageTitle,
      isActive: index === chain.length - 1,
    }));
  });
}

export function breadcrumbJsonLd(items: CmsBreadcrumbItem[]) {
  const siteUrl = getSiteUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@id': item.url === '/' ? siteUrl : `${siteUrl}${item.url}`,
        name: item.title,
      },
    })),
  };
}
