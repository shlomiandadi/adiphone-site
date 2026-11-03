import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { ACCOUNTANTS_NICHE, CLINICS_NICHE, LAWYERS_NICHE, LEGAL_TRADE_NAME, WEB_DEV_NICHES, buildNicheJsonLd } from './web-dev-niches.ts';

describe('web development niche pages', () => {
  test('uses the exact public trade name and never an ID number', () => {
    const blob = JSON.stringify(WEB_DEV_NICHES);
    assert.match(blob, new RegExp(LEGAL_TRADE_NAME));
    assert.doesNotMatch(blob, /ת\.ז/);
    assert.doesNotMatch(blob, /תעודת זהות/);
  });

  test('each niche has unique Hebrew FAQ and schema types', () => {
    const questions = WEB_DEV_NICHES.flatMap((niche) => niche.faq.map((item) => item.question));
    assert.equal(new Set(questions).size, questions.length);
    for (const niche of WEB_DEV_NICHES) {
      assert.ok(niche.faq.length >= 6 && niche.faq.length <= 8);
      const graph = buildNicheJsonLd(niche)['@graph'];
      assert.deepEqual(graph.map((node) => node['@type']), ['Service', 'FAQPage']);
    }
  });

  test('national clinic copy is not city-specific', () => {
    const { relatedLinks: _links, ...copy } = CLINICS_NICHE;
    const blob = JSON.stringify(copy);
    assert.doesNotMatch(blob, /חיפה/);
    assert.doesNotMatch(blob, /קריות/);
    assert.equal(LAWYERS_NICHE.path, '/services/web-development/lawyers');
    assert.equal(ACCOUNTANTS_NICHE.path, '/services/web-development/accountants');
  });
});
