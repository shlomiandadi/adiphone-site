import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, test } from 'node:test';

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const pageSource = readFileSync(join(repoRoot, 'app/services/chatgpt-ads/page.tsx'), 'utf8');

describe('chatgpt-ads JSON-LD', () => {
  test('Service and FAQPage only — no Offer or rating in embedded schema', () => {
    assert.ok(!pageSource.includes("'@type': 'Offer'"));
    assert.ok(!pageSource.includes("'@type': \"Offer\""));
    assert.ok(!pageSource.includes('AggregateRating'));
    assert.ok(!pageSource.includes("'@type': 'Review'"));
    assert.match(pageSource, /'@type': 'Service'/);
    assert.match(pageSource, /'@type': 'FAQPage'/);
  });
});
