import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import {
  CONTENT_REVALIDATE_SECONDS,
  POST_LIST_SELECT,
  PUBLIC_CACHE_CONTROL,
  reviveDates,
} from './contentCachePolicy.ts';

describe('content cache policy', () => {
  test('ISR window is at least one hour', () => {
    assert.ok(CONTENT_REVALIDATE_SECONDS >= 3600);
  });

  test('list selects omit article HTML and extra image blobs', () => {
    const keys = Object.keys(POST_LIST_SELECT);
    assert.equal(keys.includes('content'), false);
    assert.equal(keys.includes('images'), false);
    assert.equal(keys.includes('articleStyles'), false);
    assert.equal(keys.includes('schemaMarkup'), false);
    assert.ok(keys.includes('title'));
    assert.ok(keys.includes('slug'));
    assert.ok(keys.includes('excerpt'));
  });

  test('public cache-control is CDN-cacheable for at least an hour', () => {
    assert.match(PUBLIC_CACHE_CONTROL, /s-maxage=3600/);
    assert.doesNotMatch(PUBLIC_CACHE_CONTROL, /no-store/);
  });

  test('reviveDates restores ISO strings after unstable_cache JSON round-trip', () => {
    const revived = reviveDates({
      createdAt: '2026-01-02T03:04:05.000Z',
      updatedAt: '2026-01-03T03:04:05.000Z',
    });
    assert.ok(revived.createdAt instanceof Date);
    assert.ok(revived.updatedAt instanceof Date);
    assert.equal((revived.createdAt as Date).toISOString(), '2026-01-02T03:04:05.000Z');
  });
});
