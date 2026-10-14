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
