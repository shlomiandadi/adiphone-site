import { getSiteUrl } from '../seo';
import {
  breadcrumbListElements,
  breadcrumbSegmentTitle,
  fallbackBreadcrumbItems,
  lookupBreadcrumbLeaf,
  omitBreadcrumbList,
  pageOwnsBreadcrumbJsonLd,
  type CmsBreadcrumbItem,
} from './breadcrumbFallback';

export type { CmsBreadcrumbItem };
export {
  breadcrumbSegmentTitle,
  fallbackBreadcrumbItems,
  lookupBreadcrumbLeaf,
  omitBreadcrumbList,
  pageOwnsBreadcrumbJsonLd,
};

export function breadcrumbJsonLd(items: CmsBreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbListElements(items, getSiteUrl()),
  };
}

