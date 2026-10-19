'use client';

import { usePathname } from 'next/navigation';
import { breadcrumbJsonLd, fallbackBreadcrumbItems } from '../../lib/cms/breadcrumbShared';

/**
 * The only BreadcrumbList on the page. Names come from the same Hebrew
 * map as the visible trail in Breadcrumbs.
 */
export default function BreadcrumbSchema() {
  const pathname = usePathname() || '/';
  const trail = fallbackBreadcrumbItems(pathname);
  const items = trail[0]?.url === '/' ? trail : [{ url: '/', title: 'דף הבית' }, ...trail];
  const schema = breadcrumbJsonLd(items);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
