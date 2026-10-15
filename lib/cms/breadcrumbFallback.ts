export type CmsBreadcrumbItem = {
  url: string;
  title: string;
  isActive?: boolean;
};

/** Hebrew labels for segments added after the capitalized-slug fallback. */
const SEGMENT_TITLES: Record<string, string> = {
  'website-tadmit': 'בניית אתר תדמית',
};

function segmentTitle(path: string): string {
  return SEGMENT_TITLES[path] || path.charAt(0).toUpperCase() + path.slice(1);
}

/** Matches the original client Breadcrumbs.tsx labels (capitalized slug). */
export function fallbackBreadcrumbItems(pathname: string): CmsBreadcrumbItem[] {
  const paths = pathname.split('/').filter(Boolean);
  const items: CmsBreadcrumbItem[] = [];
  let current = '';
  paths.forEach((path, index) => {
    current += `/${path}`;
    items.push({
      url: current,
      title: segmentTitle(path),
      isActive: index === paths.length - 1,
    });
  });
  return items;
}
