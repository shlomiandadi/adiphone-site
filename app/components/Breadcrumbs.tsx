'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { fallbackBreadcrumbItems } from '../../lib/cms/breadcrumbShared';
import { chatgptBusinessHubCrumbLabel, isolateLatinPhrases } from '../../lib/bidi';
import { useBreadcrumbLeafTitle } from './BreadcrumbLeaf';

function crumbLabel(url: string, title: string) {
  if (url === '/services/chatgpt-business-hub') return chatgptBusinessHubCrumbLabel();
  return isolateLatinPhrases(title);
}

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
    <nav className="min-h-[3.25rem] max-w-full min-w-0 overflow-hidden py-4" aria-label="Breadcrumb">
      <ol className="flex w-full min-w-0 items-center text-sm md:text-base">
        <li className="flex shrink-0 items-center whitespace-nowrap">
          <Link
            href="/"
            className="whitespace-nowrap text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 font-medium"
          >
            דף הבית
          </Link>
        </li>
        {rest.map((item, index) => {
          const isLast = index === rest.length - 1;
          return (
            <li
              key={item.url}
              className={
                isLast
                  ? 'flex min-w-0 flex-1 items-center overflow-hidden'
                  : 'flex shrink-0 items-center whitespace-nowrap'
              }
            >
              <span className="mx-2 shrink-0 text-gray-400 dark:text-gray-500">/</span>
              {isLast ? (
                <span
                  dir="rtl"
                  className="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap font-semibold text-blue-600 dark:text-blue-400"
                  style={{ unicodeBidi: 'isolate' }}
                >
                  {item.url === '/services/chatgpt-business-hub'
                    ? chatgptBusinessHubCrumbLabel()
                    : item.title}
                </span>
              ) : (
                <Link
                  href={item.url}
                  className="shrink-0 whitespace-nowrap font-medium text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                >
                  {crumbLabel(item.url, item.title)}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
