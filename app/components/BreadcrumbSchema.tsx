'use client';

import { usePathname } from 'next/navigation';
import {
  breadcrumbJsonLd,
  fallbackBreadcrumbItems,
  pageOwnsBreadcrumbJsonLd,
} from '../../lib/cms/breadcrumbShared';
import { useBreadcrumbLeafTitle } from './BreadcrumbLeaf';

/**
 * Layout BreadcrumbList for routes that do not render their own.
 * Blog posts, category/tag archives, and portfolio pages emit one on the page.
 */
export default function BreadcrumbSchema() {
  const pathname = usePathname() || '/';
  if (pageOwnsBreadcrumbJsonLd(pathname)) return null;

  const leafTitle = useBreadcrumbLeafTitle();
  const trail = fallbackBreadcrumbItems(pathname, leafTitle);
  const items = trail[0]?.url === '/' ? trail : [{ url: '/', title: 'דף הבית' }, ...trail];
  const schema = breadcrumbJsonLd(items);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
