import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import type { MetadataRoute } from 'next';
import { mergeRequiredSitemapUrls, REQUIRED_SITEMAP_PATHS } from './sitemapRequired.ts';

describe('mergeRequiredSitemapUrls', () => {
  test('adds only the missing required paths with blog/service lastmod fallbacks', () => {
    const entries: MetadataRoute.Sitemap = [
      { url: 'https://adi-phone.co.il/services/web-development', changeFrequency: 'weekly', priority: 0.8 },
    ];
    const merged = mergeRequiredSitemapUrls(
      entries,
      'https://adi-phone.co.il',
      {
        routes: {
          '/blog': '2026-10-27T12:28:21.000Z',
          '/services': '2026-10-27T11:55:14.000Z',
        },
      },
      'weekly'
    );
    const paths = merged.map((entry) => new URL(entry.url).pathname);
    for (const path of REQUIRED_SITEMAP_PATHS) {
      assert.ok(paths.includes(path), path);
    }
    assert.equal(paths.filter((path) => path === '/services/web-development').length, 1);
    const aeo = merged.find((entry) => entry.url.endsWith('/services/aeo-geo'));
    assert.equal(aeo?.lastModified?.toISOString(), '2026-10-27T11:55:14.000Z');
    const seo = merged.find((entry) => entry.url.endsWith('/blog/mh-zh-seo'));
    assert.equal(seo?.lastModified?.toISOString(), '2026-10-27T12:28:21.000Z');
  });
});
