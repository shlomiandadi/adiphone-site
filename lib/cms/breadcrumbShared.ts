import { getSiteUrl } from '../seo';

export type CmsBreadcrumbItem = {
  url: string;
  title: string;
  isActive?: boolean;
};

/** Matches the original client Breadcrumbs.tsx labels (capitalized slug). */
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

export function lookupCmsBreadcrumbs(
  pathname: string,
  cmsByPath: Record<string, CmsBreadcrumbItem[]> | null | undefined
): CmsBreadcrumbItem[] | null {
  if (!cmsByPath) return null;
  const variants = [pathname];
  if (pathname !== '/' && pathname.endsWith('/')) {
    variants.push(pathname.replace(/\/+$/, '') || '/');
  } else if (pathname !== '/') {
    variants.push(`${pathname}/`);
  }
  for (const key of variants) {
    const items = cmsByPath[key];
    if (Array.isArray(items) && items.length > 0) return items;
  }
  return null;
}
