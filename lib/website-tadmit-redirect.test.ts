import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, test } from 'node:test';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const nextConfig = require('../next.config.js');

describe('website-tadmit consolidation redirects', () => {
  test('next.config permanent redirects to web-development', async () => {
    const rules = await nextConfig.redirects();
    const matches = rules.filter(
      (rule: { source: string; destination: string; permanent?: boolean }) =>
        rule.source === '/services/website-tadmit' || rule.source === '/services/website-tadmit/'
    );
    assert.equal(matches.length, 2);
    for (const rule of matches) {
      assert.equal(rule.destination, '/services/web-development');
      assert.equal(rule.permanent, true);
    }
  });

  test('netlify.toml mirrors the same 301 rules', () => {
    const toml = readFileSync(new URL('../netlify.toml', import.meta.url), 'utf8');
    assert.match(toml, /from = "\/services\/website-tadmit"\s+to = "\/services\/web-development"/);
    assert.match(toml, /from = "\/services\/website-tadmit\/"\s+to = "\/services\/web-development"/);
  });
});
