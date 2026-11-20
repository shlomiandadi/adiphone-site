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

  test('next.config legacy redirects stay permanent and do not fight the map', async () => {
    const rules = await nextConfig.redirects();
    const bySource = new Map(PERMANENT_REDIRECTS.map((rule) => [rule.source, rule.destination]));
    for (const rule of rules) {
      const mapped = bySource.get(rule.source);
      if (!mapped) continue;
      assert.equal(rule.destination, mapped, rule.source);
      assert.equal(rule.permanent, true);
    }
  });

  test('netlify.toml still force-301s the software alias', () => {
    const toml = readFileSync(new URL('../netlify.toml', import.meta.url), 'utf8');
    assert.match(toml, /from = "\/services\/software"\s+to = "\/services\/software-development"/);
    assert.match(toml, /from = "\/services\/website-tadmit"\s+to = "\/services\/web-development"/);
  });

  test('no redirect source equals its destination', () => {
    for (const rule of PERMANENT_REDIRECTS) {
      assert.notEqual(rule.source, rule.destination);
    }
  });
});
