import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { displayRuns, ltrPaintRuns, ltrVisualSegments, splitOgTitleLines } from './og-text-runs.ts';

describe('displayRuns', () => {
  test('keeps multi-word Latin as one LTR phrase for ChatGPT Business Hub', () => {
    const runs = displayRuns('פרופיל עסקי ב-ChatGPT Business Hub');
    const latin = runs.filter((run) => run.latin).map((run) => run.text);
    assert.deepEqual(latin, ['ChatGPT Business Hub']);
    assert.ok(!latin.join('').includes('TPGtahC'));
  });

  test('orders ב hyphen and Latin phrase for RTL reading', () => {
    const runs = displayRuns('ב-ChatGPT Business Hub');
    assert.deepEqual(runs.map((run) => run.text), ['ChatGPT Business Hub']);
    assert.equal(runs[0]?.gluePrefix, 'ב-');
    assert.equal(runs.length, 1);
    assert.deepEqual(ltrPaintRuns('ב-ChatGPT Business Hub').map((r) => r.text), [
      'ChatGPT Business Hub',
    ]);
  });

  test('LTR pixel order for Ads OG line 2', () => {
    const lines = splitOgTitleLines('פרסום ממומן ב-ChatGPT לעסקים בישראל');
    assert.deepEqual(ltrVisualSegments(lines[1]), [
      'בישראל',
      'לעסקים',
      'ChatGPT',
      '-',
      'ב',
    ]);
  });

  test('LTR pixel order for Hub OG line 2', () => {
    assert.deepEqual(ltrVisualSegments('ב-ChatGPT Business Hub'), [
      'ChatGPT',
      'Business',
      'Hub',
      '-',
      'ב',
    ]);
  });

  test('handles AEO/GEO and AI in Hebrew titles', () => {
    const runs = displayRuns('קידום במנועי AI (AEO/GEO)');
    const latin = runs.filter((run) => run.latin).map((run) => run.text);
    assert.deepEqual(latin, ['AI (AEO/GEO)']);
  });

  test('second OG line for ads keeps ב-ChatGPT glued to Latin', () => {
    const lines = splitOgTitleLines('פרסום ממומן ב-ChatGPT לעסקים בישראל');
    assert.equal(lines.length, 2);
    const runs = displayRuns(lines[1]);
    const glued = runs[0];
    assert.equal(glued?.gluePrefix, 'ב-');
    assert.equal(glued?.text, 'ChatGPT');
    assert.equal(ltrPaintRuns(lines[1])[0]?.text, 'לארשיב');
  });

  test('pure Hebrew still produces only Hebrew runs', () => {
    const runs = displayRuns('קידום אתרים');
    assert.equal(runs.every((run) => !run.latin), true);
    assert.equal(runs.length, 2);
    assert.deepEqual(ltrPaintRuns('קידום אתרים').map((run) => run.text), ['םירתא', 'םודיק']);
  });
});
