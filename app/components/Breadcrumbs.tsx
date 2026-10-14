import Link from 'next/link';
import { headers } from 'next/headers';
import {
  breadcrumbJsonLd,
  fallbackBreadcrumbItems,
  getCmsBreadcrumbs,
  type CmsBreadcrumbItem,
} from '../../lib/cms/breadcrumbs';
import { getSiteUrl } from '../../lib/seo';

function fallbackJsonLd(items: CmsBreadcrumbItem[]) {
  const siteUrl = getSiteUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@id': `${siteUrl}${item.url}`,
        name: item.title,
      },
    })),
  };
}

export default async function Breadcrumbs() {
  const headerList = await headers();
  const pathname = headerList.get('x-pathname') || '/';
  const cmsItems = await getCmsBreadcrumbs(pathname);
  const usingCms = Array.isArray(cmsItems) && cmsItems.length > 0;
  const trail = usingCms ? cmsItems : fallbackBreadcrumbItems(pathname);

  if (trail.length === 0) return null;

  const homeIsFirst = trail[0]?.url === '/';
  const rest = homeIsFirst ? trail.slice(1) : trail;
  const schema = usingCms ? breadcrumbJsonLd(trail) : fallbackJsonLd(trail);

  return (
    <nav className="py-4" aria-label="Breadcrumb">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <ol className="inline-flex items-center space-x-2 rtl:space-x-reverse text-sm md:text-base">
        <li>
          <Link
            href="/"
            className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 font-medium"
          >
            דף הבית
          </Link>
        </li>
        {rest.map((item, index) => (
          <li key={item.url}>
            <div className="flex items-center">
              <span className="mx-2 text-gray-400 dark:text-gray-500">/</span>
              {index === rest.length - 1 ? (
                <span className="text-blue-600 dark:text-blue-400 font-semibold">
                  {item.title}
                </span>
              ) : (
                <Link
                  href={item.url}
                  className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 font-medium"
                >
                  {item.title}
                </Link>
              )}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
}
