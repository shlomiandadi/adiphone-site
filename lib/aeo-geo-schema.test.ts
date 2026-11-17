import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, test } from 'node:test';
import { FAQ } from '../app/services/aeo-geo/content.ts';

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const pageSource = readFileSync(join(repoRoot, 'app/services/aeo-geo/page.tsx'), 'utf8');
const contentSource = readFileSync(join(repoRoot, 'app/services/aeo-geo/content.ts'), 'utf8');

describe('aeo-geo service page content', () => {
  test('FAQPage JSON-LD is built from the visible FAQ array', () => {
    assert.match(pageSource, /'@type': 'FAQPage'/);
    assert.match(pageSource, /FAQ\.map\(\(item\) =>/);
    assert.ok(FAQ.length >= 5 && FAQ.length <= 7);
    for (const item of FAQ) {
      assert.ok(item.question.trim().length > 0);
      assert.ok(item.answer.trim().length > 40);
    }
  });

  test('links to SEO service and AEO blog, with no pricing copy', () => {
    assert.match(pageSource, /href="\/services\/seo"/);
    assert.match(contentSource, /AEO_BLOG_HREF = '\/blog\/aeo'/);
    assert.doesNotMatch(pageSource + contentSource, /מחיר|₪|\bpricing\b|\bprice\b/i);
    assert.doesNotMatch(contentSource, /לקוח בשם|עלייה של \d|%\s*גידול/);
  });
});
