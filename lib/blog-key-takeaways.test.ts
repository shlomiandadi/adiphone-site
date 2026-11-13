import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, test } from 'node:test';
import { extractAndStripAioSummary } from './blog-content-cleanup.ts';

const takeawaysSrc = readFileSync(new URL('../app/components/BlogKeyTakeaways.tsx', import.meta.url), 'utf8');
const tocSrc = readFileSync(new URL('../app/components/BlogPostToc.tsx', import.meta.url), 'utf8');
const pageSrc = readFileSync(new URL('../app/blog/[slug]/page.tsx', import.meta.url), 'utf8');

describe('BlogKeyTakeaways wiring', () => {
  test('box takes answer sentences and hides when empty', () => {
    assert.match(takeawaysSrc, /items:\s*string\[\]/);
    assert.match(takeawaysSrc, /if\s*\(!items\.length\)\s*return null/);
    assert.equal(takeawaysSrc.includes('href={`#${heading.id}`}'), false);
    assert.equal(takeawaysSrc.includes('headings:'), false);
    assert.match(takeawaysSrc, /aria-label="נקודות עיקריות"/);
  });

  test('blog article page passes extracted takeaways, not H2 copies', () => {
    assert.match(pageSrc, /extractAndStripAioSummary/);
    assert.match(pageSrc, /<BlogKeyTakeaways items=\{takeaways\} \/>/);
    assert.equal(pageSrc.includes('<BlogKeyTakeaways headings={prepared.takeawayHeadings} />'), false);
    assert.match(pageSrc, /variant="desktop"/);
    assert.match(pageSrc, /variant="mobile"/);
  });

  test('TOC still has one mobile and one desktop variant', () => {
    assert.match(tocSrc, /blog-toc-mobile/);
    assert.match(tocSrc, /blog-toc-desktop/);
    assert.match(tocSrc, /lg:hidden/);
    assert.match(tocSrc, /hidden lg:block/);
  });

  test('empty summary never falls back to H2 copy', () => {
    const { takeaways } = extractAndStripAioSummary('<h2>סיכום</h2><p>גוף.</p>');
    assert.deepEqual(takeaways, []);
    assert.equal(takeawaysSrc.includes('takeawayHeadings'), false);
  });
});
