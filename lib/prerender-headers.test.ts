import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { createRequire } from 'node:module';
import {
  isHtmlContentType,
  isImagePath,
  isOgImagePath,
  prerenderOutboundHeaders,
} from './prerender-headers.ts';

const require = createRequire(import.meta.url);
const nextConfig = require('../next.config.js');

describe('prerender path classification', () => {
  test('opengraph-image routes are image paths', () => {
    assert.equal(isOgImagePath('/opengraph-image'), true);
    assert.equal(isOgImagePath('/services/seo/opengraph-image'), true);
    assert.equal(isOgImagePath('/contact'), false);
    assert.equal(isImagePath('/images/og-default.png'), true);
    assert.equal(isImagePath('/blog?utm=1'), false);
  });
});

describe('prerenderOutboundHeaders', () => {
  test('HTML keeps text/html and never inherits immutable cache', () => {
    const headers = prerenderOutboundHeaders({
      contentType: 'text/html; charset=utf-8',
      robotsTag: 'index, follow',
    });

    assert.equal(headers.get('content-type'), 'text/html; charset=utf-8');
    assert.equal(headers.get('x-robots-tag'), 'index, follow');
    assert.equal(headers.get('cache-control'), 'public, max-age=0, must-revalidate');
    assert.equal(headers.get('netlify-cdn-cache-control'), 'public, max-age=0, must-revalidate');
    assert.doesNotMatch(headers.get('cache-control') || '', /immutable/i);
    assert.doesNotMatch(headers.get('netlify-cdn-cache-control') || '', /immutable/i);
    assert.equal(headers.get('netlify-vary'), 'query=url');
  });

  test('an upstream OG PNG cannot poison the shared crawler cache', () => {
    const headers = prerenderOutboundHeaders({
      contentType: 'image/png',
    });

    assert.equal(headers.get('content-type'), 'image/png');
    assert.equal(headers.get('cache-control'), 'private, no-store');
    assert.equal(headers.get('netlify-cdn-cache-control'), 'private, no-store');
    assert.doesNotMatch(headers.get('cache-control') || '', /immutable|max-age=31536000/);
    assert.equal(headers.get('netlify-vary'), 'query=url');
  });

  test('isHtmlContentType only matches HTML', () => {
    assert.equal(isHtmlContentType('text/html; charset=utf-8'), true);
    assert.equal(isHtmlContentType('image/png'), false);
    assert.equal(isHtmlContentType('text/plain'), false);
    assert.equal(isHtmlContentType(null), false);
  });
});

describe('next.config header scoping', () => {
  test('immutable cache is limited to opengraph-image; prerender varies by url', async () => {
    const rules = await nextConfig.headers();
    const bySource = new Map(rules.map((rule) => [rule.source, rule.headers]));

    const pageLike = rules.filter(
      (rule) => rule.source === '/:path*' || rule.source === '/:path+'
    );
    assert.equal(pageLike.length, 0);

    const home = bySource.get('/') || [];
    assert.match(
      home.find((header) => header.key === 'Netlify-CDN-Cache-Control')?.value || '',
      /durable/
    );
    assert.doesNotMatch(
      home.find((header) => header.key === 'Netlify-CDN-Cache-Control')?.value || '',
      /immutable/
    );
    assert.equal(home.find((header) => header.key === 'Cache-Control'), undefined);

    const brand = bySource.get('/brand/:path*') || [];
    assert.match(
      brand.find((header) => header.key === 'Cache-Control')?.value || '',
      /max-age=31536000/
    );
    assert.doesNotMatch(
      brand.find((header) => header.key === 'Cache-Control')?.value || '',
      /immutable/
    );

    const og = bySource.get('/opengraph-image') || [];
    assert.equal(
      og.find((header) => header.key === 'Cache-Control')?.value,
      'public, max-age=31536000, immutable'
    );
    assert.equal(og.find((header) => header.key === 'Netlify-Vary')?.value, 'query');

    const prerender = bySource.get('/netlify-prerender-function') || [];
    assert.doesNotMatch(
      prerender.find((header) => header.key === 'Cache-Control')?.value || '',
      /immutable/
    );
    assert.doesNotMatch(
      prerender.find((header) => header.key === 'Netlify-CDN-Cache-Control')?.value || '',
      /s-maxage=31536000|immutable/
    );
    assert.equal(prerender.find((header) => header.key === 'Netlify-Vary')?.value, 'query=url');
  });
});
