import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import {
  fallbackBreadcrumbItems,
  lookupBreadcrumbLeaf,
  omitBreadcrumbList,
  pageOwnsBreadcrumbJsonLd,
} from './breadcrumbFallback.ts';

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

  test('aeo-geo uses the Hebrew service name', () => {
    assert.deepEqual(fallbackBreadcrumbItems('/services/aeo-geo'), [
      { url: '/services', title: 'שירותים', isActive: false },
      { url: '/services/aeo-geo', title: 'קידום במנועי AI (AEO/GEO)', isActive: true },
    ]);
  });

  test('chatgpt-business-hub uses the Hebrew service name', () => {
    assert.deepEqual(fallbackBreadcrumbItems('/services/chatgpt-business-hub'), [
      { url: '/services', title: 'שירותים', isActive: false },
      {
        url: '/services/chatgpt-business-hub',
        title: 'עסק ב-ChatGPT Business Hub',
        isActive: true,
      },
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

  test('unknown blog slug stays readable until a leaf title is supplied', () => {
    assert.deepEqual(fallbackBreadcrumbItems('/blog/mh-zh-kydvm-avrgny'), [
      { url: '/blog', title: 'בלוג', isActive: false },
      {
        url: '/blog/mh-zh-kydvm-avrgny',
        title: 'mh zh kydvm avrgny',
        isActive: true,
      },
    ]);
  });

  test('blog article leaf title replaces the dashed slug', () => {
    assert.deepEqual(
      fallbackBreadcrumbItems('/blog/mh-zh-kydvm-avrgny', 'מה זה קידום אורגני?'),
      [
        { url: '/blog', title: 'בלוג', isActive: false },
        {
          url: '/blog/mh-zh-kydvm-avrgny',
          title: 'מה זה קידום אורגני?',
          isActive: true,
        },
      ]
    );
  });

  test('category and tag leaf titles replace the last slug', () => {
    const categoryTrail = fallbackBreadcrumbItems('/blog/category/seo', 'קידום אתרים');
    assert.equal(categoryTrail[categoryTrail.length - 1]?.title, 'קידום אתרים');
    const tagTrail = fallbackBreadcrumbItems('/blog/tag/organic-seo', 'קידום אורגני');
    assert.equal(tagTrail[tagTrail.length - 1]?.title, 'קידום אורגני');
  });

  test('portfolio leaf title replaces the project slug', () => {
    const trail = fallbackBreadcrumbItems('/portfolio/some-client-site', 'אתר לקוח');
    assert.equal(trail[trail.length - 1]?.title, 'אתר לקוח');
  });

  test('services path is unchanged when no leaf title is passed', () => {
    assert.deepEqual(fallbackBreadcrumbItems('/services/seo'), [
      { url: '/services', title: 'שירותים', isActive: false },
      { url: '/services/seo', title: 'קידום אורגני', isActive: true },
    ]);
  });
});

describe('BreadcrumbList names follow the visible trail', () => {
  test('last item name is the article title when a leaf title is supplied', () => {
    const trail = fallbackBreadcrumbItems('/blog/mh-zh-kydvm-avrgny', 'מה זה קידום אורגני?');
    const names = ['דף הבית', ...trail.map((item) => item.title)];
    assert.deepEqual(names, ['דף הבית', 'בלוג', 'מה זה קידום אורגני?']);
  });
});

describe('visible trail matches the Hebrew names', () => {
  test('services/seo is שירותים then קידום אורגני', () => {
    const names = ['דף הבית', ...fallbackBreadcrumbItems('/services/seo').map((item) => item.title)];
    assert.deepEqual(names, ['דף הבית', 'שירותים', 'קידום אורגני']);
  });
});

describe('pageOwnsBreadcrumbJsonLd', () => {
  test('blog posts, category, tag, and portfolio pages own the list', () => {
    assert.equal(pageOwnsBreadcrumbJsonLd('/blog/mh-zh-kydvm-avrgny'), true);
    assert.equal(pageOwnsBreadcrumbJsonLd('/blog/category/seo'), true);
    assert.equal(pageOwnsBreadcrumbJsonLd('/blog/tag/organic'), true);
    assert.equal(pageOwnsBreadcrumbJsonLd('/portfolio/some-client'), true);
    assert.equal(pageOwnsBreadcrumbJsonLd('/blog'), false);
    assert.equal(pageOwnsBreadcrumbJsonLd('/services/seo'), false);
  });
});

describe('lookupBreadcrumbLeaf', () => {
  test('returns the title for a blog path', () => {
    assert.equal(
      lookupBreadcrumbLeaf(
        { '/blog/mh-zh-kydvm-avrgny': 'מה זה קידום אורגני (SEO) ולמה הוא קריטי לעסק שלכם?' },
        '/blog/mh-zh-kydvm-avrgny'
      ),
      'מה זה קידום אורגני (SEO) ולמה הוא קריטי לעסק שלכם?'
    );
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
