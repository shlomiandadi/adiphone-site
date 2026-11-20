import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, test } from 'node:test';
import { createRequire } from 'node:module';
import {
  PERMANENT_REDIRECTS,
  isRedirectedBlogSlug,
  lookupPermanentRedirect,
  normalizeRedirectPath,
} from './permanentRedirects.ts';

const require = createRequire(import.meta.url);
const nextConfig = require('../next.config.js');

describe('permanent 301 map', () => {
  test('does not redirect keepers mh-zh-seo or seo-tkny', () => {
    assert.equal(lookupPermanentRedirect('/blog/mh-zh-seo'), null);
    assert.equal(lookupPermanentRedirect('/blog/seo-tkny'), null);
    assert.equal(isRedirectedBlogSlug('mh-zh-seo'), false);
    assert.equal(isRedirectedBlogSlug('seo-tkny'), false);
  });

  test('overlap and irrelevant losers 301 to the audit keepers', () => {
    assert.equal(lookupPermanentRedirect('/blog/kydvm-atrym-bmnvay-chypvsh'), '/blog/mh-zh-kydvm-avrgny');
    assert.equal(lookupPermanentRedirect('/blog/kydvm-atrym-avrgny'), '/blog/mh-zh-kydvm-avrgny');
    assert.equal(lookupPermanentRedirect('/blog/seo-tips-google-ranking-guide'), '/blog/mh-zh-kydvm-avrgny');
    assert.equal(lookupPermanentRedirect('/blog/pytvch-aplyktsyvt-laskym'), '/blog/pytvch-aplyktsyvt-hrbh-yvtr-mkvd');
    assert.equal(lookupPermanentRedirect('/blog/shyrvty-ann-laskym'), '/blog/ptrvnvt-bann');
    assert.equal(lookupPermanentRedirect('/blog/shyvvk-dygytly-laskym'), '/blog/shyvvk-dygytly-ai');
    assert.equal(lookupPermanentRedirect('/blog/aeo'), '/blog/What-is-AEO-Answer-Engine-Optimization-and-Why-Does-It-Change');
    assert.equal(lookupPermanentRedirect('/blog/tyk-abvdvt'), '/portfolio');
    assert.equal(lookupPermanentRedirect('/blog/ptrvnvt-cloud-abtchh-v-devops'), '/services/cloud');
    assert.equal(lookupPermanentRedirect('/blog/pytvch-atrym-seo-shyvvk-dygytly'), '/services');
    assert.equal(lookupPermanentRedirect('/blog/bnyyt-atr-ayntrnt-chyph'), '/services/bniyat-atarim-haifa');
    assert.equal(lookupPermanentRedirect('/services/software'), '/services/software-development');
  });

  test('trailing slash and encoded paths still match', () => {
    assert.equal(lookupPermanentRedirect('/blog/aeo/'), '/blog/What-is-AEO-Answer-Engine-Optimization-and-Why-Does-It-Change');
    assert.equal(lookupPermanentRedirect('/services/software/'), '/services/software-development');
    assert.equal(normalizeRedirectPath('/blog/aeo/'), '/blog/aeo');
  });

  test('next.config lists every source as a permanent redirect', async () => {
    const rules = await nextConfig.redirects();
    for (const rule of PERMANENT_REDIRECTS) {
      const match = rules.find((item: { source: string }) => item.source === rule.source);
      assert.ok(match, `missing next.config redirect for ${rule.source}`);
      assert.equal(match.destination, rule.destination);
      assert.equal(match.permanent, true);
    }
  });

  test('netlify.toml force-301s every source', () => {
    const toml = readFileSync(new URL('../netlify.toml', import.meta.url), 'utf8');
    for (const rule of PERMANENT_REDIRECTS) {
      const from = `from = "${rule.source}"`;
      const to = `to = "${rule.destination}"`;
      assert.ok(toml.includes(from), `missing netlify from ${rule.source}`);
      const idx = toml.indexOf(from);
      assert.ok(toml.slice(idx, idx + 220).includes(to), `netlify ${rule.source} should go to ${rule.destination}`);
      assert.ok(toml.slice(idx, idx + 220).includes('status = 301'));
      assert.ok(toml.slice(idx, idx + 220).includes('force = true'));
    }
  });

  test('no redirect source equals its destination', () => {
    for (const rule of PERMANENT_REDIRECTS) {
      assert.notEqual(rule.source, rule.destination);
    }
  });
});
