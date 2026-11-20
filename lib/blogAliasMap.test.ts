import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import {
  isRedirectedBlogSlug,
  lookupAliasDestination,
  normalizeAliasPath,
} from './blogAliasMap.ts';

describe('blog alias 301 map', () => {
  test('does not alias keepers mh-zh-seo or seo-tkny', () => {
    assert.equal(lookupAliasDestination('/blog/mh-zh-seo'), null);
    assert.equal(lookupAliasDestination('/blog/seo-tkny'), null);
    assert.equal(isRedirectedBlogSlug('mh-zh-seo'), false);
    assert.equal(isRedirectedBlogSlug('seo-tkny'), false);
  });

  test('overlap and irrelevant losers go to audit keepers', () => {
    assert.equal(lookupAliasDestination('/blog/kydvm-atrym-bmnvay-chypvsh'), '/blog/mh-zh-kydvm-avrgny');
    assert.equal(lookupAliasDestination('/blog/kydvm-atrym-avrgny'), '/blog/mh-zh-kydvm-avrgny');
    assert.equal(lookupAliasDestination('/blog/seo-tips-google-ranking-guide'), '/blog/mh-zh-kydvm-avrgny');
    assert.equal(lookupAliasDestination('/blog/pytvch-aplyktsyvt-laskym'), '/blog/pytvch-aplyktsyvt-hrbh-yvtr-mkvd');
    assert.equal(lookupAliasDestination('/blog/shyrvty-ann-laskym'), '/blog/ptrvnvt-bann');
    assert.equal(lookupAliasDestination('/blog/shyvvk-dygytly-laskym'), '/blog/shyvvk-dygytly-ai');
    assert.equal(lookupAliasDestination('/blog/aeo'), '/blog/What-is-AEO-Answer-Engine-Optimization-and-Why-Does-It-Change');
    assert.equal(lookupAliasDestination('/blog/tyk-abvdvt'), '/portfolio');
    assert.equal(lookupAliasDestination('/blog/ptrvnvt-cloud-abtchh-v-devops'), '/services/cloud');
    assert.equal(lookupAliasDestination('/blog/pytvch-atrym-seo-shyvvk-dygytly'), '/services');
    assert.equal(lookupAliasDestination('/blog/bnyyt-atr-ayntrnt-chyph'), '/services/bniyat-atarim-haifa');
    assert.equal(lookupAliasDestination('/services/software'), '/services/software-development');
  });

  test('trailing slash still matches', () => {
    assert.equal(lookupAliasDestination('/blog/aeo/'), '/blog/What-is-AEO-Answer-Engine-Optimization-and-Why-Does-It-Change');
    assert.equal(normalizeAliasPath('/blog/aeo/'), '/blog/aeo');
  });
});
