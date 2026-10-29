import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  STATIC_ROUTES,
  resolveStaticLastModified,
  type StaticLastmodMap,
} from './staticLastmod.ts';

const lastmodFile = JSON.parse(
  readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'static-lastmod.json'), 'utf8')
) as StaticLastmodMap;

describe('static sitemap lastmod', () => {
  test('covers the 33 indexable static routes', () => {
    assert.equal(STATIC_ROUTES.length, 33);
  });

  test('uses the per-route git map and never a single CMS date', () => {
    const data: StaticLastmodMap = {
      routes: {
        '/about': '2024-03-01T12:00:00.000Z',
        '/pricing': '2025-06-15T08:30:00.000Z',
      },
    };
    const cmsOverride = new Date('2026-10-14T00:00:00.000Z');

    const about = resolveStaticLastModified('/about', data);
    const pricing = resolveStaticLastModified('/pricing', data);
    const missing = resolveStaticLastModified('/contact', data);

    assert.equal(about?.toISOString(), '2024-03-01T12:00:00.000Z');
    assert.equal(pricing?.toISOString(), '2025-06-15T08:30:00.000Z');
    assert.equal(missing, undefined);
    assert.notEqual(about?.toISOString(), cmsOverride.toISOString());
    assert.notEqual(pricing?.toISOString(), cmsOverride.toISOString());
  });

  test('omits invalid dates instead of fabricating lastmod', () => {
    const data: StaticLastmodMap = {
      routes: {
        '/about': 'not-a-date',
        '/blog': '',
      },
    };
    assert.equal(resolveStaticLastModified('/about', data), undefined);
    assert.equal(resolveStaticLastModified('/blog', data), undefined);
    assert.equal(resolveStaticLastModified('/services', data), undefined);
  });

  test('committed map has a real ISO date per static route', () => {
    const routes = (lastmodFile as StaticLastmodMap).routes || {};
    for (const route of STATIC_ROUTES) {
      const iso = routes[route];
      assert.equal(typeof iso, 'string', `missing lastmod for ${route || '/'}`);
      const date = new Date(iso);
      assert.equal(Number.isNaN(date.getTime()), false, `invalid lastmod for ${route || '/'}`);
    }
    const unique = new Set(Object.values(routes));
    assert.ok(unique.size > 1, 'static lastmod values should vary by route');
  });
});
