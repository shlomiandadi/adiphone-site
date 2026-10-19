import assert from 'node:assert/strict';
import test from 'node:test';
import { LEAD_PLACEHOLDER_EMAIL } from './lead-form.ts';
import {
  META_CAPI_EVENTS_URL,
  META_CAPI_PIXEL_ID,
  buildMetaLeadPayload,
  clientIpFromHeaders,
  marketingConsentAllows,
  normalizeMetaEmail,
  normalizeMetaName,
  normalizeMetaPhone,
  postMetaCapiLead,
  queueMetaCapiLead,
  requestHostname,
  sha256Hex,
  shouldSendMetaCapiLead,
  toMetaEventTimeSeconds,
  type MetaCapiLeadBody,
} from './metaCapi.ts';

const EVENT_ID = '11111111-1111-4111-8111-111111111111';
const EMAIL_HASH = '973dfe463ec85785f5f95af5ba3906eedb2d931c24e69824a89ea65dba4e813b';
const PHONE_HASH = 'ca65e2d4e9424f3e83d4f2bb5da5060fe78ea1a3813d613d29df131ee2dad066';
const NAME_HASH = '4ffe91842477f3a0621f8a0ccf32d36ec642f455666ecaedc181a0c7383faa5a';
const HEBREW_NAME_HASH = '97dcf6c170eaa93668b89387d5d7ad95b6c25dee860be4aa2f6fc91fb0009623';
const RETIRED_PIXEL_ID = '1243736846887573';

function consentCookie(marketing: boolean) {
  const value = encodeURIComponent(
    JSON.stringify({
      categories: { necessary: true, analytics: false, marketing, functional: false },
      timestamp: 1,
      version: 1,
    })
  );
  return `cookie_consent_v1=${value}`;
}

function prodHeaders(extra?: Record<string, string>) {
  return new Headers({
    host: 'adi-phone.co.il',
    cookie: consentCookie(true),
    ...extra,
  });
}

test('email, phone, and name normalization', () => {
  assert.equal(normalizeMetaEmail(' Test@Example.COM '), 'test@example.com');
  assert.equal(normalizeMetaEmail(LEAD_PLACEHOLDER_EMAIL), null);
  assert.equal(normalizeMetaEmail(` ${LEAD_PLACEHOLDER_EMAIL.toUpperCase()} `), null);
  assert.equal(normalizeMetaEmail(''), null);
  assert.equal(normalizeMetaEmail('not-an-email'), null);
  assert.equal(normalizeMetaEmail(null), null);

  const phoneCases: Array<[string, string | null]> = [
    ['0509159951', '972509159951'],
    ['050-915-9951', '972509159951'],
    ['+972 50 915 9951', '972509159951'],
    ['+972 (0)50-915-9951', '972509159951'],
    ['972509159951', '972509159951'],
    ['00972-50-9159951', '972509159951'],
    ['972-050-9159951', '972509159951'],
    ['  050 915 9951  ', '972509159951'],
    ['04-1234567', '97241234567'],
    ['', null],
    ['---', null],
    ['abc', null],
    ['0', null],
    ['123', null],
    ['0509159951123456789', null],
  ];
  for (const [input, expected] of phoneCases) {
    assert.equal(normalizeMetaPhone(input), expected, input);
  }
  assert.equal(normalizeMetaPhone(null), null);

  assert.equal(normalizeMetaName(' Shlomi '), 'shlomi');
  assert.equal(normalizeMetaName('Shlomi Malfuf'), 'shlomi malfuf');
  assert.equal(normalizeMetaName('עדי'), 'עדי');
  assert.equal(normalizeMetaName('   '), null);
  assert.equal(normalizeMetaName(null), null);
});

test('sha256 hex matches the normalized values', () => {
  assert.equal(sha256Hex('test@example.com'), EMAIL_HASH);
  assert.equal(sha256Hex(normalizeMetaEmail(' Test@Example.COM ')!), EMAIL_HASH);
  assert.equal(sha256Hex('972509159951'), PHONE_HASH);
  assert.equal(sha256Hex(normalizeMetaPhone('050-915-9951')!), PHONE_HASH);
  assert.equal(sha256Hex('shlomi'), NAME_HASH);
  assert.equal(sha256Hex(normalizeMetaName(' Shlomi ')!), NAME_HASH);
  assert.equal(sha256Hex('עדי'), HEBREW_NAME_HASH);
  assert.match(EMAIL_HASH, /^[0-9a-f]{64}$/);
  assert.notEqual(sha256Hex(' Test@Example.COM '), EMAIL_HASH);
  assert.notEqual(sha256Hex('050-915-9951'), PHONE_HASH);
});

test('event time is unix seconds', () => {
  assert.equal(toMetaEventTimeSeconds(1_700_000_000_000), 1_700_000_000);
  assert.equal(toMetaEventTimeSeconds(1_700_000_000), 1_700_000_000);
});

test('Lead payload hashes user data and pins the pixel', () => {
  const payload = buildMetaLeadPayload({
    eventId: EVENT_ID,
    eventTimeSeconds: 1_700_000_000,
    eventSourceUrl: 'https://adi-phone.co.il/contact?utm_source=google',
    email: ' Test@Example.COM ',
    phone: '050-915-9951',
    name: ' Shlomi ',
    fbp: 'fb.1.1700000000.123456',
    fbc: 'fb.1.1700000000.AbC',
    clientIp: '203.0.113.8',
    clientUserAgent: 'Mozilla/5.0',
    accessToken: 'test-token',
    testEventCode: ' TEST123 ',
  });

  assert.equal(META_CAPI_PIXEL_ID, '1317769456632052');
  assert.equal(payload.url, 'https://graph.facebook.com/v21.0/1317769456632052/events');
  assert.equal(payload.url, META_CAPI_EVENTS_URL);
  assert.equal(payload.url.includes(RETIRED_PIXEL_ID), false);
  assert.equal(new URL(payload.url).search, '');

  const body = payload.body;
  assert.equal(body.access_token, 'test-token');
  assert.equal(body.test_event_code, 'TEST123');
  assert.equal(body.data.length, 1);
  const event = body.data[0];
  assert.deepEqual(event, {
    event_name: 'Lead',
    event_time: 1_700_000_000,
    event_id: EVENT_ID,
    action_source: 'website',
    user_data: {
      em: EMAIL_HASH,
      ph: PHONE_HASH,
      fn: NAME_HASH,
      fbp: 'fb.1.1700000000.123456',
      fbc: 'fb.1.1700000000.AbC',
      client_ip_address: '203.0.113.8',
      client_user_agent: 'Mozilla/5.0',
    },
    event_source_url: 'https://adi-phone.co.il/contact?utm_source=google',
  });

  const serialized = JSON.stringify(body);
  assert.equal(serialized.includes('Test@Example'), false);
  assert.equal(serialized.includes('test@example.com'), false);
  assert.equal(serialized.includes('050-915-9951'), false);
  assert.equal(serialized.includes('0509159951'), false);
  assert.equal(serialized.includes('Shlomi'), false);
  assert.equal(serialized.includes(RETIRED_PIXEL_ID), false);
  assert.equal(serialized.includes('"Contact"'), false);
  assert.equal(serialized.includes('eventID'), false);
});

test('optional user fields and test event code are omitted when absent', () => {
  const payload = buildMetaLeadPayload({
    eventId: EVENT_ID,
    eventTimeSeconds: 1_700_000_000_000,
    eventSourceUrl: 'javascript:alert(1)',
    email: LEAD_PLACEHOLDER_EMAIL,
    phone: 'abc',
    name: '   ',
    accessToken: ' token ',
    testEventCode: '   ',
  });
  assert.equal(payload.body.test_event_code, undefined);
  assert.equal(payload.body.access_token, 'token');
  assert.deepEqual(payload.body.data[0].user_data, {});
  assert.equal(payload.body.data[0].event_source_url, undefined);
  assert.equal(payload.body.data[0].event_time, 1_700_000_000);
  assert.equal(payload.body.data[0].event_name, 'Lead');
});

test('hebrew names are hashed after lowercase trim', () => {
  const payload = buildMetaLeadPayload({
    eventId: EVENT_ID,
    eventTimeSeconds: 1_700_000_000,
    name: ' עדי ',
    accessToken: 'token',
  });
  assert.equal(payload.body.data[0].user_data.fn, HEBREW_NAME_HASH);
  assert.equal(JSON.stringify(payload.body).includes('עדי'), false);
});

test('request host, ip, and marketing consent', () => {
  const headers = new Headers({
    'x-forwarded-host': 'www.adi-phone.co.il, proxy.internal',
    host: 'localhost',
    'x-nf-client-connection-ip': '203.0.113.9',
    'x-forwarded-for': '198.51.100.4, 10.0.0.1',
  });
  assert.equal(requestHostname(headers), 'www.adi-phone.co.il');
  assert.equal(clientIpFromHeaders(headers), '203.0.113.9');
  assert.equal(
    clientIpFromHeaders(new Headers({ 'x-forwarded-for': '198.51.100.4, 10.0.0.1' })),
    '198.51.100.4'
  );
  assert.equal(clientIpFromHeaders(new Headers({ 'x-forwarded-for': 'not-an-ip' })), undefined);

  const cookie = `${consentCookie(true)}; _fbp=fb.1.1.1`;
  assert.equal(marketingConsentAllows(cookie, { marketing: true, analytics: false }), true);
  assert.equal(marketingConsentAllows(cookie, undefined), true);
  assert.equal(marketingConsentAllows(cookie, { marketing: false }), false);
  assert.equal(marketingConsentAllows(consentCookie(false), { marketing: true }), false);
  assert.equal(marketingConsentAllows('', { marketing: true }), false);

  assert.equal(shouldSendMetaCapiLead({
    token: 'token',
    hostname: 'www.adi-phone.co.il',
    cookieHeader: cookie,
    bodyConsent: { marketing: true },
    eventId: EVENT_ID,
  }), true);
  assert.equal(shouldSendMetaCapiLead({
    token: '   ',
    hostname: 'adi-phone.co.il',
    cookieHeader: cookie,
    bodyConsent: { marketing: true },
    eventId: EVENT_ID,
  }), false);
  assert.equal(shouldSendMetaCapiLead({
    token: 'token',
    hostname: 'deploy-preview-12--adi-phone.netlify.app',
    cookieHeader: cookie,
    bodyConsent: { marketing: true },
    eventId: EVENT_ID,
  }), false);
  assert.equal(shouldSendMetaCapiLead({
    token: 'token',
    hostname: 'adi-phone.co.il',
    cookieHeader: consentCookie(false),
    bodyConsent: { marketing: true },
    eventId: EVENT_ID,
  }), false);
  assert.equal(shouldSendMetaCapiLead({
    token: 'token',
    hostname: 'adi-phone.co.il',
    cookieHeader: cookie,
    bodyConsent: { marketing: false },
    eventId: EVENT_ID,
  }), false);
  assert.equal(shouldSendMetaCapiLead({
    token: 'token',
    hostname: 'adi-phone.co.il',
    cookieHeader: cookie,
    bodyConsent: { marketing: true },
    eventId: 'short',
  }), false);
});

test('post reads cookies and headers into one Lead and skips closed gates', async () => {
  const calls: Array<{ url: string; body: MetaCapiLeadBody; signal: AbortSignal | null }> = [];
  const cookie = `${consentCookie(true)}; _fbp=fb.1.1700000000.123456; _fbc=fb.1.1700000000.AbC`;
  const headers = new Headers({
    'x-forwarded-host': 'adi-phone.co.il',
    cookie,
    referer: 'https://adi-phone.co.il/contact',
    'user-agent': 'Mozilla/5.0 Test',
    'x-nf-client-connection-ip': '203.0.113.8',
    'x-forwarded-for': '198.51.100.4',
  });

  const sent = await postMetaCapiLead({
    headers,
    eventId: ` ${EVENT_ID} `,
    bodyConsent: { marketing: true, analytics: false },
    email: 'lead@adi-phone.co.il',
    phone: '0509159951',
    name: 'עדי',
    token: 'server-token',
    testEventCode: 'TEST999',
    nowMs: 1_700_000_000_000,
    fetchImpl: async (url, init) => {
      calls.push({
        url: String(url),
        body: JSON.parse(String(init?.body)) as MetaCapiLeadBody,
        signal: init?.signal ?? null,
      });
      return new Response('{}', { status: 200 });
    },
  });

  assert.equal(sent, 'sent');
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, META_CAPI_EVENTS_URL);
  assert.ok(calls[0].signal);
  assert.equal(calls[0].body.access_token, 'server-token');
  assert.equal(calls[0].body.test_event_code, 'TEST999');
  assert.equal(calls[0].body.data[0].event_id, EVENT_ID);
  assert.equal(calls[0].body.data[0].event_time, 1_700_000_000);
  assert.equal(calls[0].body.data[0].user_data.em, undefined);
  assert.equal(calls[0].body.data[0].user_data.ph, PHONE_HASH);
  assert.equal(calls[0].body.data[0].user_data.fn, HEBREW_NAME_HASH);
  assert.equal(calls[0].body.data[0].user_data.fbp, 'fb.1.1700000000.123456');
  assert.equal(calls[0].body.data[0].user_data.fbc, 'fb.1.1700000000.AbC');
  assert.equal(calls[0].body.data[0].user_data.client_ip_address, '203.0.113.8');
  assert.equal(calls[0].body.data[0].user_data.client_user_agent, 'Mozilla/5.0 Test');
  assert.equal(calls[0].body.data[0].event_source_url, 'https://adi-phone.co.il/contact');
  assert.equal(JSON.stringify(calls[0].body).includes(RETIRED_PIXEL_ID), false);

  let called = false;
  const skipped = await postMetaCapiLead({
    headers: new Headers({ host: 'localhost', cookie: consentCookie(true) }),
    eventId: EVENT_ID,
    email: 'a@b.co',
    phone: '0509159951',
    name: 'עדי',
    token: 'server-token',
    fetchImpl: async () => {
      called = true;
      return new Response('{}', { status: 200 });
    },
  });
  assert.equal(skipped, 'skipped');
  assert.equal(called, false);
});

test('missing token is a no-op even on production', async () => {
  const previousToken = process.env.META_CAPI_TOKEN;
  const previousTestCode = process.env.META_TEST_EVENT_CODE;
  delete process.env.META_CAPI_TOKEN;
  delete process.env.META_TEST_EVENT_CODE;
  try {
    let called = false;
    const status = await postMetaCapiLead({
      headers: prodHeaders(),
      eventId: EVENT_ID,
      email: 'a@b.co',
      phone: '0509159951',
      name: 'עדי',
      fetchImpl: async () => {
        called = true;
        return new Response('{}', { status: 200 });
      },
    });
    assert.equal(status, 'skipped');
    assert.equal(called, false);
  } finally {
    if (previousToken === undefined) delete process.env.META_CAPI_TOKEN;
    else process.env.META_CAPI_TOKEN = previousToken;
    if (previousTestCode === undefined) delete process.env.META_TEST_EVENT_CODE;
    else process.env.META_TEST_EVENT_CODE = previousTestCode;
  }
});

test('META_TEST_EVENT_CODE from the environment is forwarded', async () => {
  const previous = process.env.META_TEST_EVENT_CODE;
  process.env.META_TEST_EVENT_CODE = 'FROM_ENV';
  try {
    let testCode = '';
    await postMetaCapiLead({
      headers: prodHeaders(),
      eventId: EVENT_ID,
      phone: '0509159951',
      token: 'server-token',
      fetchImpl: async (_url, init) => {
        testCode = (JSON.parse(String(init?.body)) as MetaCapiLeadBody).test_event_code || '';
        return new Response('{}', { status: 200 });
      },
    });
    assert.equal(testCode, 'FROM_ENV');
  } finally {
    if (previous === undefined) delete process.env.META_TEST_EVENT_CODE;
    else process.env.META_TEST_EVENT_CODE = previous;
  }
});

test('http failures and timeouts do not throw and logs omit pii', async () => {
  const original = console.error;
  const lines: string[] = [];
  console.error = (...args: unknown[]) => {
    lines.push(args.map((part) => (typeof part === 'string' ? part : JSON.stringify(part))).join(' '));
  };
  try {
    const failed = await postMetaCapiLead({
      headers: prodHeaders(),
      eventId: EVENT_ID,
      email: 'secret.user@example.com',
      phone: '0509159951',
      name: 'Secret Name',
      token: 'super-secret-token',
      fetchImpl: async () => new Response('{"error":"secret.user@example.com"}', { status: 400 }),
    });
    assert.equal(failed, 'failed');

    const thrown = await postMetaCapiLead({
      headers: prodHeaders(),
      eventId: EVENT_ID,
      email: 'secret.user@example.com',
      phone: '0509159951',
      token: 'super-secret-token',
      fetchImpl: async () => {
        throw new Error('secret.user@example.com super-secret-token');
      },
    });
    assert.equal(thrown, 'failed');

    const timedOut = await postMetaCapiLead({
      headers: prodHeaders(),
      eventId: EVENT_ID,
      phone: '0509159951',
      token: 'super-secret-token',
      timeoutMs: 30,
      fetchImpl: (_url, init) => new Promise((_resolve, reject) => {
        const timer = setTimeout(() => reject(new Error('timeout did not abort')), 200);
        init?.signal?.addEventListener('abort', () => {
          clearTimeout(timer);
          const error = new Error('secret.user@example.com');
          error.name = 'TimeoutError';
          reject(error);
        });
      }),
    });
    assert.equal(timedOut, 'failed');
  } finally {
    console.error = original;
  }

  const logged = lines.join('\n');
  assert.match(logged, /Meta CAPI Lead request failed/);
  assert.match(logged, /"status":400/);
  assert.match(logged, /TimeoutError/);
  assert.equal(logged.includes('secret.user@example.com'), false);
  assert.equal(logged.includes('super-secret-token'), false);
  assert.equal(logged.includes('0509159951'), false);
  assert.equal(logged.includes('Secret Name'), false);
});

test('queueMetaCapiLead does not wait for the network', async () => {
  let started = false;
  let release: (() => void) | undefined;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  const queued = queueMetaCapiLead({
    headers: prodHeaders(),
    eventId: EVENT_ID,
    phone: '0509159951',
    token: 'server-token',
    fetchImpl: async () => {
      started = true;
      await gate;
      return new Response('{}', { status: 200 });
    },
  });
  assert.equal(queued, undefined);
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(started, true);
  release?.();
});
