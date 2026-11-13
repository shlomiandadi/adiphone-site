'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { fallbackBreadcrumbItems } from '../../lib/cms/breadcrumbShared';
import { chatgptBusinessHubCrumbLabel, isolateLatinPhrases } from '../../lib/bidi';
import { useBreadcrumbLeafTitle } from './BreadcrumbLeaf';

export default function Breadcrumbs() {
  const pathname = usePathname() || '/';
  const leafTitle = useBreadcrumbLeafTitle();
  const trail = useMemo(
    () => fallbackBreadcrumbItems(pathname, leafTitle),
    [pathname, leafTitle]
  );

  if (trail.length === 0) return null;

  const homeIsFirst = trail[0]?.url === '/';
  const rest = homeIsFirst ? trail.slice(1) : trail;

  return (
    <nav className="min-h-[3.25rem] py-4" aria-label="Breadcrumb">
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
                <span className="inline-block max-w-[min(70vw,28rem)] truncate align-bottom font-semibold text-blue-600 dark:text-blue-400">
                  {item.url === '/services/chatgpt-business-hub'
                    ? chatgptBusinessHubCrumbLabel()
                    : isolateLatinPhrases(item.title)}
                </span>
              ) : (
                <Link
                  href={item.url}
                  className="font-medium text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                >
                  {item.url === '/services/chatgpt-business-hub'
                    ? chatgptBusinessHubCrumbLabel()
                    : isolateLatinPhrases(item.title)}
                </Link>
              )}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
}
