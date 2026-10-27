import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { relatedArticleLinks } from './related-content.ts';

describe('relatedArticleLinks', () => {
  test('SEO posts point at the two underlinked guides', () => {
    const hrefs = relatedArticleLinks('kydvm-atrym-avrgny', 'קידום אתרים').map((item) => item.href);
    assert.ok(hrefs.includes('/blog/mh-zh-seo'));
    assert.ok(hrefs.includes('/blog/ayk-lbchvr-chbrt-kydvm-atrym'));
  });

  test('AI posts point at the AI guide and AEO page', () => {
    const hrefs = relatedArticleLinks('ai-bot-for-businesses', 'AI').map((item) => item.href);
    assert.ok(hrefs.includes('/blog/ptrvnvt-bynh-mlakvtyt'));
    assert.ok(hrefs.includes('/services/aeo-geo'));
  });
});
