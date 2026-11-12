import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { displayRuns, ogLineUsesLatinPhraseFlip } from './og-text-runs.ts';

describe('displayRuns', () => {
  test('keeps multi-word Latin as one LTR phrase for ChatGPT Business Hub', () => {
    const runs = displayRuns('פרופיל עסקי ב-ChatGPT Business Hub');
    const latin = runs.filter((run) => run.latin).map((run) => run.text);
    assert.deepEqual(latin, ['ChatGPT Business Hub']);
    assert.ok(!latin.join('').includes('TPGtahC'));
  });

  test('orders ב hyphen and Latin phrase for RTL reading', () => {
    const runs = displayRuns('ב-ChatGPT Business Hub');
    assert.deepEqual(
      runs.map((run) => run.text),
      ['ChatGPT Business Hub', 'ב-'],
    );
  });

  test('handles AEO/GEO and AI in Hebrew titles', () => {
    const runs = displayRuns('קידום במנועי AI (AEO/GEO)');
    const latin = runs.filter((run) => run.latin).map((run) => run.text);
    assert.deepEqual(latin, ['AI (AEO/GEO)']);
  });

  test('detects multi-word Latin lines for Satori paint flip', () => {
    assert.equal(ogLineUsesLatinPhraseFlip('ב-ChatGPT Business Hub'), true);
    assert.equal(ogLineUsesLatinPhraseFlip('פרופיל עסקי'), false);
  });

  test('pure Hebrew still produces only Hebrew runs', () => {
    const runs = displayRuns('קידום אתרים');
    assert.equal(runs.every((run) => !run.latin), true);
    assert.equal(runs.length, 2);
  });
});
