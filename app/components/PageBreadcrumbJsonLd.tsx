import { breadcrumbJsonLd, fallbackBreadcrumbItems } from '../../lib/cms/breadcrumbShared';

/** Server-rendered BreadcrumbList for pages that already loaded a real title. */
export default function PageBreadcrumbJsonLd({
  pathname,
  leafTitle,
}: {
  pathname: string;
  leafTitle: string;
}) {
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
