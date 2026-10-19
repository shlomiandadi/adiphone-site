import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { fallbackBreadcrumbItems, omitBreadcrumbList } from './breadcrumbFallback.ts';

describe('fallbackBreadcrumbItems', () => {
  test('home has no trail items (URL-only crumbs stay empty)', () => {
    assert.deepEqual(fallbackBreadcrumbItems('/'), []);
  });

  test('single segment uses the Hebrew page name', () => {
    assert.deepEqual(fallbackBreadcrumbItems('/about'), [
      { url: '/about', title: 'אודות', isActive: true },
    ]);
  });

  test('nested service path uses Hebrew names, not capitalized slugs', () => {
    assert.deepEqual(fallbackBreadcrumbItems('/services/seo'), [
      { url: '/services', title: 'שירותים', isActive: false },
      { url: '/services/seo', title: 'קידום אורגני', isActive: true },
    ]);
  });

  test('website-tadmit uses the Hebrew service name', () => {
    assert.deepEqual(fallbackBreadcrumbItems('/services/website-tadmit'), [
      { url: '/services', title: 'שירותים', isActive: false },
      { url: '/services/website-tadmit', title: 'אתרי תדמית לעסקים', isActive: true },
    ]);
  });

  test('aeo-geo uses the Hebrew service name', () => {
    assert.deepEqual(fallbackBreadcrumbItems('/services/aeo-geo'), [
      { url: '/services', title: 'שירותים', isActive: false },
      { url: '/services/aeo-geo', title: 'קידום במנועי AI (AEO/GEO)', isActive: true },
    ]);
  });

  test('pricing article uses the Hebrew title', () => {
    assert.deepEqual(fallbackBreadcrumbItems('/blog/kama-oleh-bniyat-atar-2026'), [
      { url: '/blog', title: 'בלוג', isActive: false },
      {
        url: '/blog/kama-oleh-bniyat-atar-2026',
        title: 'כמה עולה בניית אתר ב-2026',
        isActive: true,
      },
    ]);
  });
});

describe('visible trail matches the Hebrew names', () => {
  test('services/seo is שירותים then קידום אורגני', () => {
    const names = ['דף הבית', ...fallbackBreadcrumbItems('/services/seo').map((item) => item.title)];
    assert.deepEqual(names, ['דף הבית', 'שירותים', 'קידום אורגני']);
  });
});

describe('omitBreadcrumbList', () => {
  test('drops a stored BreadcrumbList and keeps the rest of a graph', () => {
    const kept = omitBreadcrumbList({
      '@context': 'https://schema.org',
      '@graph': [
        { '@type': 'BreadcrumbList', itemListElement: [] },
        { '@type': 'FAQPage', mainEntity: [] },
      ],
    }) as { '@graph': Array<{ '@type': string }> };
    assert.deepEqual(kept['@graph'].map((node) => node['@type']), ['FAQPage']);
  });

  test('returns null when the override is only a breadcrumb', () => {
    assert.equal(omitBreadcrumbList({ '@type': 'BreadcrumbList' }), null);
  });
});
