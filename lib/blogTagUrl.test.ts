import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import {
  blogTagCanonicalPath,
  blogTagSpaceRedirectPath,
  hyphenatedTagSlug,
  isBlogTagPath,
} from './blogTagUrl.ts';

describe('blog tag URLs', () => {
  test('hyphenates spaces and %20 to a single slug', () => {
    assert.equal(
      hyphenatedTagSlug('בנייה וקידום אתרים מקצועיים'),
      'בנייה-וקידום-אתרים-מקצועיים'
    );
    assert.equal(
      hyphenatedTagSlug(encodeURIComponent('בנייה וקידום אתרים מקצועיים')),
      'בנייה-וקידום-אתרים-מקצועיים'
    );
    assert.equal(hyphenatedTagSlug('organic-seo'), 'organic-seo');
  });

  test('canonical path is the hyphen version', () => {
    assert.equal(
      blogTagCanonicalPath('בנייה וקידום אתרים מקצועיים'),
      '/blog/tag/בנייה-וקידום-אתרים-מקצועיים'
    );
  });

  test('space URL redirects once to hyphen URL; hyphen does not redirect', () => {
    const hebrew = 'בנייה וקידום אתרים מקצועיים';
    const hyphen = `/blog/tag/${hebrew.replace(/\s+/g, '-')}`;
    assert.equal(blogTagSpaceRedirectPath(`/blog/tag/${hebrew}`), hyphen);
    assert.equal(
      blogTagSpaceRedirectPath(`/blog/tag/${encodeURIComponent(hebrew)}`),
      hyphen
    );
    assert.equal(blogTagSpaceRedirectPath(`${hyphen}/`), null);
    assert.equal(blogTagSpaceRedirectPath(hyphen), null);
    assert.equal(blogTagSpaceRedirectPath('/blog/tag/organic-seo'), null);
    assert.equal(blogTagSpaceRedirectPath('/blog'), null);
  });

  test('identifies tag paths for sitemap exclusion', () => {
    assert.equal(isBlogTagPath('/blog/tag/organic-seo'), true);
    assert.equal(isBlogTagPath('/blog/tag/'), true);
    assert.equal(isBlogTagPath('/blog/organic-seo'), false);
    assert.equal(isBlogTagPath('/blog'), false);
  });
});
