'use client';

import { usePathname } from 'next/navigation';

export default function BreadcrumbSchema() {
  const pathname = usePathname();
  const paths = pathname.split('/').filter(Boolean);
  
  const breadcrumbList = paths.map((path, index) => {
    const href = '/' + paths.slice(0, index + 1).join('/');
    const name = path.charAt(0).toUpperCase() + path.slice(1);
    return {
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@id': `https://shlomiandadi.com${href}`,
        name: name
      }
    };
  });

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        item: {
          '@id': 'https://shlomiandadi.com',
          name: 'דף הבית'
        }
      },
      ...breadcrumbList
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
} 