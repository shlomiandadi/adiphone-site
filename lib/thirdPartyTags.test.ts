import assert from 'node:assert/strict';
import test from 'node:test';
import {
  AHREFS_ANALYTICS_KEY,
  AHREFS_ANALYTICS_SRC,
  META_PIXEL_ID,
  beginMetaLead,
  createMetaEventId,
  isMetaContactEvent,
  isProductionHostname,
  isThankYouPath,
  metaStandardTrackArguments,
  parseMetaLeadRecord,
  promotePendingMetaLead,
  readConsentFlags,
  resolveMetaPixelId,
  serializeMetaLeadRecord,
  shouldLoadAhrefs,
  shouldLoadMetaPixel,
  shouldTrackMetaPageView,
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
  const eventId = '11111111-1111-4111-8111-111111111111';
  const pending = beginMetaLead(eventId, false);
  assert.equal(pending.status, 'pending');
  assert.equal(promotePendingMetaLead(pending, false), null);
  const flushed = promotePendingMetaLead(pending, true);
  assert.deepEqual(flushed, { eventId, status: 'sent' });
  assert.equal(promotePendingMetaLead(flushed, true), null);

  const immediate = beginMetaLead(eventId, true);
  assert.equal(immediate.status, 'sent');
  assert.equal(promotePendingMetaLead(immediate, true), null);
  assert.equal(
    serializeMetaLeadRecord(immediate),
    JSON.stringify({ eventId, status: 'sent' })
  );
  assert.deepEqual(parseMetaLeadRecord(serializeMetaLeadRecord(pending)), pending);
});

test('a later submission gets a new event id and the legacy sent flag does not block it', () => {
  assert.equal(parseMetaLeadRecord('sent'), null);
  assert.equal(parseMetaLeadRecord('pending'), null);
  assert.equal(parseMetaLeadRecord('{"eventId":"","status":"pending"}'), null);

  const first = beginMetaLead(createMetaEventId(), true);
  const second = beginMetaLead(createMetaEventId(), true);
  assert.equal(first.status, 'sent');
  assert.equal(second.status, 'sent');
  assert.notEqual(first.eventId, second.eventId);
  assert.equal(promotePendingMetaLead(first, true), null);
  assert.equal(promotePendingMetaLead(second, true), null);
});

test('Lead and Contact carry eventID; thank-you does not get a Meta PageView', () => {
  const eventId = createMetaEventId();
  assert.match(eventId, /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
  assert.deepEqual(metaStandardTrackArguments('Lead', eventId), [
    'track',
    'Lead',
    {},
    { eventID: eventId },
  ]);
  assert.deepEqual(metaStandardTrackArguments('Contact', eventId), [
    'track',
    'Contact',
    {},
    { eventID: eventId },
  ]);
  assert.deepEqual(metaStandardTrackArguments('PageView'), ['track', 'PageView']);
  assert.equal(isThankYouPath('/thank-you'), true);
  assert.equal(isThankYouPath('/thank-you/'), true);
  assert.equal(shouldTrackMetaPageView('/thank-you'), false);
  assert.equal(shouldTrackMetaPageView('/contact'), true);
  assert.equal(shouldTrackMetaPageView('/'), true);
  assert.equal(shouldTrackMetaPageView(null), false);
});

test('contact events are phone and whatsapp clicks only', () => {
  assert.equal(isMetaContactEvent('phone_click'), true);
  assert.equal(isMetaContactEvent('whatsapp_click'), true);
  assert.equal(isMetaContactEvent('email_click'), false);
  assert.equal(isMetaContactEvent('generate_lead'), false);
  assert.equal(isMetaContactEvent('thank_you'), false);
});
