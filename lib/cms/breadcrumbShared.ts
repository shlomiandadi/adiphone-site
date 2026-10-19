import { getSiteUrl } from '../seo';
import {
  breadcrumbSegmentTitle,
  fallbackBreadcrumbItems,
  omitBreadcrumbList,
  type CmsBreadcrumbItem,
} from './breadcrumbFallback';

export type { CmsBreadcrumbItem };
export { breadcrumbSegmentTitle, fallbackBreadcrumbItems, omitBreadcrumbList };

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

