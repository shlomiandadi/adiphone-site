'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { breadcrumbJsonLd, fallbackBreadcrumbItems } from '../../lib/cms/breadcrumbShared';

export default function Breadcrumbs() {
  const pathname = usePathname() || '/';
  const trail = useMemo(() => fallbackBreadcrumbItems(pathname), [pathname]);

  if (trail.length === 0) return null;

  const homeIsFirst = trail[0]?.url === '/';
  const rest = homeIsFirst ? trail.slice(1) : trail;
  const schema = breadcrumbJsonLd(homeIsFirst ? trail : [{ url: '/', title: 'דף הבית' }, ...trail]);
  // /contact already publishes a Hebrew BreadcrumbList ("צור קשר"). Skip the English "Contact" one.
  const skipJsonLd = pathname === '/contact';

  return (
    <nav className="py-4" aria-label="Breadcrumb">
      {skipJsonLd ? null : (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
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
