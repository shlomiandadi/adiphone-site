'use client';

import { usePathname } from 'next/navigation';
import { getSiteUrl } from '../../lib/seo';

/** Human-readable Hebrew labels for known path segments. */
const SEGMENT_LABELS: Record<string, string> = {
  about: 'אודות',
  services: 'שירותים',
  portfolio: 'תיק עבודות',
  blog: 'בלוג',
  pricing: 'מחירון',
  contact: 'צור קשר',
  'privacy-policy': 'מדיניות פרטיות',
  'accessibility-statement': 'הצהרת נגישות',
  'web-development': 'בניית אתרים',
  wordpress: 'וורדפרס',
  ecommerce: 'חנויות אינטרנט',
  'mobile-apps': 'פיתוח אפליקציות',
  'app-development': 'פיתוח אפליקציות',
  seo: 'קידום אורגני',
  'organic-seo': 'קידום אורגני',
  ppc: 'קידום ממומן',
  'paid-promotion': 'קידום ממומן',
  ai: 'בינה מלאכותית',
  cloud: 'שירותי ענן',
  analytics: 'אנליטיקס',
  'ui-design': 'עיצוב UI/UX',
  software: 'פתרונות תוכנה',
  'software-development': 'פיתוח תוכנה',
  'bniyat-atarim-pardes-hana': 'בניית אתרים בפרדס חנה',
  'bniyat-atarim-hadera': 'בניית אתרים בחדרה',
  'bniyat-atarim-caesarea': 'בניית אתרים בקיסריה',
  'bniyat-atarim-zichron-yaakov': 'בניית אתרים בזכרון יעקב',
  'bniyat-atarim-haifa': 'בניית אתרים בחיפה',
  'bniyat-atarim-netanya': 'בניית אתרים בנתניה',
  'bniyat-atarim-or-akiva': 'בניית אתרים באור עקיבא',
  'bniyat-atarim-binyamina': 'בניית אתרים בבנימינה',
  'bniyat-atarim-yokneam': 'בניית אתרים ביוקנעם',
  'bniyat-atarim-afula': 'בניית אתרים בעפולה',
  'kama-oleh-bniyat-atar-2026': 'כמה עולה בניית אתר ב-2026',
};

function labelFor(segment: string): string {
  if (SEGMENT_LABELS[segment]) return SEGMENT_LABELS[segment];
  try {
    return decodeURIComponent(segment).replace(/-/g, ' ');
  } catch {
    return segment.replace(/-/g, ' ');
  }
}

export default function BreadcrumbSchema() {
  const pathname = usePathname();
  const siteUrl = getSiteUrl();
  const paths = pathname.split('/').filter(Boolean);

  const breadcrumbList = paths.map((path, index) => {
    const href = '/' + paths.slice(0, index + 1).join('/');
    return {
      '@type': 'ListItem',
      position: index + 2,
      item: {
        '@id': `${siteUrl}${href}`,
        name: labelFor(path),
      },
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
          '@id': siteUrl,
          name: 'דף הבית',
        },
      },
      ...breadcrumbList,
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
