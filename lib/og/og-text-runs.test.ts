import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { displayRuns } from './og-text-runs.ts';

function runText(runs: ReturnType<typeof displayRuns>) {
  return runs.map((run) => run.text).join(' ');
}

describe('displayRuns', () => {
  test('keeps Latin words and letter order for ChatGPT Business Hub', () => {
    const runs = displayRuns('פרופיל עסקי ב-ChatGPT Business Hub');
    const latin = runs.filter((run) => run.latin).map((run) => run.text);
    assert.deepEqual(latin, ['Hub', 'Business', 'ChatGPT']);
    assert.ok(!latin.join('').includes('TPGtahC'));
  });

  test('handles AEO/GEO and AI in Hebrew titles', () => {
    const runs = displayRuns('קידום במנועי AI (AEO/GEO)');
    const latin = runs.filter((run) => run.latin).map((run) => run.text);
    assert.deepEqual(latin, ['(AEO/GEO)', 'AI']);
  });

  test('pure Hebrew still produces only Hebrew runs', () => {
    const runs = displayRuns('קידום אתרים');
    assert.equal(runs.every((run) => !run.latin), true);
    assert.equal(runs.length, 2);
  });
});
