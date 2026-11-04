import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { ACCOUNTANTS_NICHE, CLINICS_NICHE, LAWYERS_NICHE } from './web-dev-niches.ts';
import { WEB_DEV_NICHE_HUB_CARDS, WEB_DEV_NICHE_HUB_HEADING } from './web-dev-niche-hub.ts';

describe('web-dev niche hub cards', () => {
  test('links the three national profession pages with page-owned benefits', () => {
    assert.equal(WEB_DEV_NICHE_HUB_HEADING, 'אתרים לפי תחום');
    assert.deepEqual(
      WEB_DEV_NICHE_HUB_CARDS.map((card) => card.href),
      [LAWYERS_NICHE.path, CLINICS_NICHE.path, ACCOUNTANTS_NICHE.path],
    );
    assert.equal(WEB_DEV_NICHE_HUB_CARDS[0].benefit, LAWYERS_NICHE.subtitle);
    assert.equal(WEB_DEV_NICHE_HUB_CARDS[1].benefit, CLINICS_NICHE.subtitle);
    assert.equal(WEB_DEV_NICHE_HUB_CARDS[2].benefit, ACCOUNTANTS_NICHE.subtitle);
    assert.deepEqual(
      WEB_DEV_NICHE_HUB_CARDS.map((card) => card.name),
      ['עורכי דין', 'קליניקות ומטפלים', 'רואי חשבון'],
    );
  });
});
