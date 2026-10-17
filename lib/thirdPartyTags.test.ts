import assert from 'node:assert/strict';
import test from 'node:test';
import {
  AHREFS_ANALYTICS_KEY,
  AHREFS_ANALYTICS_SRC,
  META_PIXEL_ID,
  isProductionHostname,
  nextMetaLeadState,
  readConsentFlags,
  resolveMetaPixelId,
  shouldFlushMetaLead,
  shouldLoadAhrefs,
  shouldLoadMetaPixel,
  isMetaContactEvent,
} from './thirdPartyTags.ts';

const PROD = 'adi-phone.co.il';
const WWW = 'www.adi-phone.co.il';

function consentCookie(categories: { analytics?: boolean; marketing?: boolean; functional?: boolean }) {
  const value = encodeURIComponent(
    JSON.stringify({
      categories: {
        necessary: true,
        analytics: false,
        marketing: false,
        functional: false,
        ...categories,
      },
      timestamp: 1,
      version: 1,
    })
  );
  return `cookie_consent_v1=${value}`;
}

test('default pixel and Ahrefs snippet values', () => {
  assert.equal(META_PIXEL_ID, '1317769456632052');
  assert.equal(resolveMetaPixelId(''), META_PIXEL_ID);
  assert.equal(resolveMetaPixelId('   '), META_PIXEL_ID);
  assert.equal(resolveMetaPixelId(undefined), META_PIXEL_ID);
  assert.equal(resolveMetaPixelId('555'), '555');
  assert.equal(AHREFS_ANALYTICS_KEY, 'aB0fdPwT7Rd5S9fsBNZURA');
  assert.equal(AHREFS_ANALYTICS_SRC, 'https://analytics.ahrefs.com/analytics.js');
});

test('production host allowlist', () => {
  assert.equal(isProductionHostname(PROD), true);
  assert.equal(isProductionHostname(WWW), true);
  assert.equal(isProductionHostname('ADI-PHONE.CO.IL'), true);
  assert.equal(isProductionHostname('www.adi-phone.co.il.'), true);
  assert.equal(isProductionHostname('localhost'), false);
  assert.equal(isProductionHostname('127.0.0.1'), false);
  assert.equal(isProductionHostname('adi-phone.netlify.app'), false);
  assert.equal(isProductionHostname('deploy-preview-55--site.netlify.app'), false);
  assert.equal(isProductionHostname('adi-phone.co.il.evil.com'), false);
  assert.equal(isProductionHostname('not-adi-phone.co.il'), false);
  assert.equal(isProductionHostname(''), false);
});

test('consent x hostname gating', () => {
  const cases: Array<{
    name: string;
    cookie: string;
    host: string;
    pixel: boolean;
    ahrefs: boolean;
  }> = [
    { name: 'no cookie on production', cookie: '', host: PROD, pixel: false, ahrefs: false },
    { name: 'rejected non-essential on production', cookie: consentCookie({}), host: PROD, pixel: false, ahrefs: false },
    { name: 'marketing only on production', cookie: consentCookie({ marketing: true }), host: PROD, pixel: true, ahrefs: false },
    { name: 'analytics only on production', cookie: consentCookie({ analytics: true }), host: PROD, pixel: false, ahrefs: true },
    { name: 'accept all on production', cookie: consentCookie({ analytics: true, marketing: true, functional: true }), host: PROD, pixel: true, ahrefs: true },
    { name: 'accept all on www', cookie: consentCookie({ analytics: true, marketing: true }), host: WWW, pixel: true, ahrefs: true },
    { name: 'accept all on localhost', cookie: consentCookie({ analytics: true, marketing: true }), host: 'localhost', pixel: false, ahrefs: false },
    { name: 'accept all on 127.0.0.1', cookie: consentCookie({ analytics: true, marketing: true }), host: '127.0.0.1', pixel: false, ahrefs: false },
    { name: 'accept all on netlify', cookie: consentCookie({ analytics: true, marketing: true }), host: 'adi-phone.netlify.app', pixel: false, ahrefs: false },
    { name: 'marketing only on netlify preview', cookie: consentCookie({ marketing: true, analytics: true }), host: 'deploy-preview-12--adi-phone.netlify.app', pixel: false, ahrefs: false },
  ];

  for (const entry of cases) {
    const consent = readConsentFlags(entry.cookie);
    assert.equal(shouldLoadMetaPixel(entry.host, consent), entry.pixel, `${entry.name} pixel`);
    assert.equal(shouldLoadAhrefs(entry.host, consent), entry.ahrefs, `${entry.name} ahrefs`);
  }
});

test('malformed consent does not grant storage', () => {
  assert.deepEqual(readConsentFlags('cookie_consent_v1=not-json'), { analytics: false, marketing: false });
  assert.deepEqual(readConsentFlags('other=1'), { analytics: false, marketing: false });
  const flags = readConsentFlags(consentCookie({ marketing: true }));
  assert.equal(flags.marketing, true);
  assert.equal(flags.analytics, false);
});

test('one lead submission is one Lead, including a later thank-you flush', () => {
  let state: string | null = null;
  state = nextMetaLeadState(false);
  assert.equal(state, 'pending');
  assert.equal(shouldFlushMetaLead(state, false), false);
  assert.equal(shouldFlushMetaLead(state, true), true);
  state = 'sent';
  assert.equal(shouldFlushMetaLead(state, true), false);

  state = nextMetaLeadState(true);
  assert.equal(state, 'sent');
  assert.equal(shouldFlushMetaLead(state, true), false);
});

test('contact events are phone and whatsapp clicks only', () => {
  assert.equal(isMetaContactEvent('phone_click'), true);
  assert.equal(isMetaContactEvent('whatsapp_click'), true);
  assert.equal(isMetaContactEvent('email_click'), false);
  assert.equal(isMetaContactEvent('generate_lead'), false);
  assert.equal(isMetaContactEvent('thank_you'), false);
});
