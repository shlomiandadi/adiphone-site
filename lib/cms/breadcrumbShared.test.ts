import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { fallbackBreadcrumbItems } from './breadcrumbFallback.ts';

describe('fallbackBreadcrumbItems', () => {
  test('home has no trail items (URL-only crumbs stay empty)', () => {
    assert.deepEqual(fallbackBreadcrumbItems('/'), []);
  });

  test('single segment capitalizes the slug', () => {
    assert.deepEqual(fallbackBreadcrumbItems('/about'), [
      { url: '/about', title: 'About', isActive: true },
    ]);
  });

  test('nested service path matches the live URL trail', () => {
    assert.deepEqual(fallbackBreadcrumbItems('/services/web-development'), [
      { url: '/services', title: 'Services', isActive: false },
      { url: '/services/web-development', title: 'Web-development', isActive: true },
    ]);
  });

  test('website-tadmit uses the Hebrew service name', () => {
    assert.deepEqual(fallbackBreadcrumbItems('/services/website-tadmit'), [
      { url: '/services', title: 'Services', isActive: false },
      { url: '/services/website-tadmit', title: 'בניית אתר תדמית', isActive: true },
    ]);
  });

  test('aeo-geo path is unchanged from URL fallback', () => {
    assert.deepEqual(fallbackBreadcrumbItems('/services/aeo-geo'), [
      { url: '/services', title: 'Services', isActive: false },
      { url: '/services/aeo-geo', title: 'Aeo-geo', isActive: true },
    ]);
  });
});
