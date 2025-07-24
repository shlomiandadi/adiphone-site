'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface BreadcrumbItem {
  name: string;
  href: string;
}

export default function Breadcrumbs() {
  const pathname = usePathname();
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);
  const [schemaJson, setSchemaJson] = useState<string>('');

  useEffect(() => {
    // Generate breadcrumbs based on pathname
    const paths = pathname.split('/').filter(Boolean);
    const items: BreadcrumbItem[] = [];
    let currentPath = '';

    paths.forEach((path, index) => {
      currentPath += `/${path}`;
      items.push({
        name: path.charAt(0).toUpperCase() + path.slice(1),
        href: currentPath,
      });
    });

    setBreadcrumbs(items);

    // Generate schema JSON
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@id': `${window.location.origin}${item.href}`,
          name: item.name,
        },
      })),
    };

    setSchemaJson(JSON.stringify(schema));
  }, [pathname]);

  if (breadcrumbs.length === 0) return null;

  return (
    <nav className="py-4" aria-label="Breadcrumb">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: schemaJson }}
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
        {breadcrumbs.map((item, index) => (
          <li key={item.href}>
            <div className="flex items-center">
              <span className="mx-2 text-gray-400 dark:text-gray-500">/</span>
              {index === breadcrumbs.length - 1 ? (
                <span className="text-blue-600 dark:text-blue-400 font-semibold">
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 font-medium"
                >
                  {item.name}
                </Link>
              )}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
} 