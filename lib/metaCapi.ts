import { createHash } from 'node:crypto';
import { LEAD_PLACEHOLDER_EMAIL } from './lead-form.ts';
import { META_PIXEL_ID, isProductionHostname, readConsentFlags } from './thirdPartyTags.ts';

/**
 * Server Lead for the Meta Conversions API, deduped with the browser pixel
 * through the same event_id the form generated before submit.
 *
 * The request is sent only when META_CAPI_TOKEN is set, the host is production,
 * and the cookie_consent_v1 cookie grants marketing. An explicit marketing:false
 * in the posted consent state also blocks the call. META_TEST_EVENT_CODE, when
 * set, is forwarded as test_event_code.
 *
 * The pixel is fixed to META_PIXEL_ID (1317769456632052). The call is
 * fire-and-forget with a short timeout and never throws to the lead handler.
 * Failures are logged without the request body or user data.
 */

export const META_CAPI_PIXEL_ID = META_PIXEL_ID;
export const META_CAPI_GRAPH_VERSION = 'v21.0';
export const META_CAPI_EVENTS_URL =
  `https://graph.facebook.com/${META_CAPI_GRAPH_VERSION}/${META_CAPI_PIXEL_ID}/events`;
export const META_CAPI_TIMEOUT_MS = 2000;

const EVENT_ID_PATTERN = /^[A-Za-z0-9_-]{8,128}$/;

export type MetaCapiLeadResult = 'sent' | 'skipped' | 'failed';

export type MetaCapiUserData = {
  em?: string;
  ph?: string;
  fn?: string;
  fbp?: string;
  fbc?: string;
  client_ip_address?: string;
  client_user_agent?: string;
};

export type MetaCapiLeadEvent = {
  event_name: 'Lead';
  event_time: number;
  event_id: string;
  action_source: 'website';
  event_source_url?: string;
  user_data: MetaCapiUserData;
};

export type MetaCapiLeadBody = {
  data: [MetaCapiLeadEvent];
  access_token: string;
  test_event_code?: string;
};

type HeaderSource = { get(name: string): string | null };

export type MetaCapiLeadInput = {
  headers: HeaderSource;
  eventId: unknown;
  bodyConsent?: unknown;
  email?: string | null;
  phone?: string | null;
  name?: string | null;
  token?: string | null;
  testEventCode?: string | null;
  fetchImpl?: typeof fetch;
  nowMs?: number;
  timeoutMs?: number;
};

export function sha256Hex(value: string): string {
  return createHash('sha256').update(value, 'utf8').digest('hex');
}

/** Unix seconds. Millisecond timestamps (Date.now()) are converted. */
export function toMetaEventTimeSeconds(value = Date.now()): number {
  if (!Number.isFinite(value)) return Math.floor(Date.now() / 1000);
  return value > 10_000_000_000 ? Math.floor(value / 1000) : Math.floor(value);
}

/**
 * Trim and lowercase. The shared lead placeholder is not a customer address,
 * so it is omitted instead of hashed into every phoneless match.
 */
export function normalizeMetaEmail(email: string | null | undefined): string | null {
  if (!email) return null;
  const normalized = email.trim().toLowerCase();
  if (!normalized || normalized === LEAD_PLACEHOLDER_EMAIL) return null;
  if (normalized.length > 320) return null;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) return null;
  return normalized;
}

/**
 * Digits only, Israel country code 972, national trunk prefix 0 removed.
 * 050-915-9951, +972 50 915 9951, and 00972509159951 all become 972509159951.
 */
export function normalizeMetaPhone(phone: string | null | undefined): string | null {
  if (!phone) return null;
  let digits = phone.replace(/\D/g, '');
  if (!digits) return null;
  if (digits.startsWith('00')) digits = digits.slice(2);
  if (!digits) return null;
  const national = digits.startsWith('972') ? digits.slice(3) : digits;
  const withoutTrunk = national.replace(/^0+/, '');
  if (!withoutTrunk) return null;
  const normalized = `972${withoutTrunk}`;
  if (normalized.length < 11 || normalized.length > 15) return null;
  return normalized;
}

/** Trim and lowercase. Empty names are omitted. */
export function normalizeMetaName(name: string | null | undefined): string | null {
  if (!name) return null;
  const normalized = name.trim().toLowerCase();
  return normalized || null;
}

export function requestHostname(headers: HeaderSource): string {
  const raw = headers.get('x-forwarded-host') || headers.get('host') || '';
  return raw.split(',')[0]?.trim() || '';
}

/**
 * Marketing consent from cookie_consent_v1 is required. A posted consent object
 * that explicitly sets marketing to false blocks the event as well.
 */
export function marketingConsentAllows(cookieHeader: string | null | undefined, bodyConsent: unknown): boolean {
  if (!readConsentFlags(cookieHeader).marketing) return false;
  if (!bodyConsent || typeof bodyConsent !== 'object') return true;
  const marketing = (bodyConsent as { marketing?: unknown }).marketing;
  if (marketing === false) return false;
  return true;
}

export function shouldSendMetaCapiLead(input: {
  token: string | null | undefined;
  hostname: string | null | undefined;
  cookieHeader: string | null | undefined;
  bodyConsent: unknown;
  eventId: unknown;
}): boolean {
  if (!input.token?.trim()) return false;
  if (!isProductionHostname(input.hostname)) return false;
  if (!marketingConsentAllows(input.cookieHeader, input.bodyConsent)) return false;
  if (typeof input.eventId !== 'string' || !EVENT_ID_PATTERN.test(input.eventId.trim())) return false;
  return true;
}

function boundedText(value: string | null | undefined, max: number): string | undefined {
  if (!value) return undefined;
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > max) return undefined;
  if (/[\u0000-\u001F\u007F]/.test(trimmed)) return undefined;
  return trimmed;
}

export function clientIpFromHeaders(headers: HeaderSource): string | undefined {
  const netlifyIp = headers.get('x-nf-client-connection-ip')?.split(',')[0]?.trim();
  const forwarded = headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  const candidate = netlifyIp || forwarded;
  if (!candidate || !/^[0-9a-fA-F:.]+$/.test(candidate)) return undefined;
  return candidate;
}

function eventSourceUrl(value: string | null | undefined): string | undefined {
  const trimmed = value?.trim();
  if (!trimmed || trimmed.length > 2000) return undefined;
  try {
    const url = new URL(trimmed);
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return undefined;
    return url.toString();
  } catch {
    return undefined;
  }
}

function readCookie(cookieHeader: string | null | undefined, name: string): string | undefined {
  if (!cookieHeader) return undefined;
  for (const part of cookieHeader.split(';')) {
    const trimmed = part.trim();
    const eq = trimmed.indexOf('=');
    if (eq <= 0) continue;
    if (trimmed.slice(0, eq) !== name) continue;
    const raw = trimmed.slice(eq + 1);
    if (!raw) return undefined;
    try {
      return decodeURIComponent(raw);
    } catch {
      return raw;
    }
  }
  return undefined;
}

export function buildMetaLeadPayload(input: {
  eventId: string;
  eventTimeSeconds: number;
  eventSourceUrl?: string | null;
  email?: string | null;
  phone?: string | null;
  name?: string | null;
  fbp?: string | null;
  fbc?: string | null;
  clientIp?: string | null;
  clientUserAgent?: string | null;
  accessToken: string;
  testEventCode?: string | null;
}): { url: string; body: MetaCapiLeadBody } {
  const userData: MetaCapiUserData = {};
  const email = normalizeMetaEmail(input.email);
  const phone = normalizeMetaPhone(input.phone);
  const name = normalizeMetaName(input.name);
  if (email) userData.em = sha256Hex(email);
  if (phone) userData.ph = sha256Hex(phone);
  if (name) userData.fn = sha256Hex(name);

  const fbp = boundedText(input.fbp, 200);
  const fbc = boundedText(input.fbc, 200);
  const clientIp = boundedText(input.clientIp, 64);
  const clientUserAgent = boundedText(input.clientUserAgent, 512);
  if (fbp) userData.fbp = fbp;
  if (fbc) userData.fbc = fbc;
  if (clientIp) userData.client_ip_address = clientIp;
  if (clientUserAgent) userData.client_user_agent = clientUserAgent;

  const event: MetaCapiLeadEvent = {
    event_name: 'Lead',
    event_time: toMetaEventTimeSeconds(input.eventTimeSeconds),
    event_id: input.eventId.trim(),
    action_source: 'website',
    user_data: userData,
  };
  const sourceUrl = eventSourceUrl(input.eventSourceUrl);
  if (sourceUrl) event.event_source_url = sourceUrl;

  const body: MetaCapiLeadBody = {
    data: [event],
    access_token: input.accessToken.trim(),
  };
  const testEventCode = input.testEventCode?.trim();
  if (testEventCode) body.test_event_code = testEventCode;
  return { url: META_CAPI_EVENTS_URL, body };
}

function logMetaCapiFailure(error: unknown, status?: number): void {
  if (typeof status === 'number') {
    console.error('Meta CAPI Lead request failed', { status });
    return;
  }
  const name = error instanceof Error ? error.name : 'Error';
  console.error('Meta CAPI Lead request failed', { name });
}

function resolveToken(input: MetaCapiLeadInput): string {
  const fromInput = input.token !== undefined ? input.token : process.env.META_CAPI_TOKEN;
  return fromInput?.trim() || '';
}

function resolveTestEventCode(input: MetaCapiLeadInput): string {
  const fromInput = input.testEventCode !== undefined ? input.testEventCode : process.env.META_TEST_EVENT_CODE;
  return fromInput?.trim() || '';
}

async function deliverMetaCapiLead(
  payload: { url: string; body: MetaCapiLeadBody },
  fetchImpl: typeof fetch,
  timeoutMs: number
): Promise<MetaCapiLeadResult> {
  try {
    const response = await fetchImpl(payload.url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload.body),
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (!response.ok) {
      logMetaCapiFailure(undefined, response.status);
      return 'failed';
    }
    return 'sent';
  } catch (error) {
    logMetaCapiFailure(error);
    return 'failed';
  }
}

export async function postMetaCapiLead(input: MetaCapiLeadInput): Promise<MetaCapiLeadResult> {
  try {
    const token = resolveToken(input);
    const eventId = typeof input.eventId === 'string' ? input.eventId.trim() : '';
    const cookieHeader = input.headers.get('cookie');
    if (!shouldSendMetaCapiLead({
      token,
      hostname: requestHostname(input.headers),
      cookieHeader,
      bodyConsent: input.bodyConsent,
      eventId,
    })) {
      return 'skipped';
    }

    const payload = buildMetaLeadPayload({
      eventId,
      eventTimeSeconds: toMetaEventTimeSeconds(input.nowMs ?? Date.now()),
      eventSourceUrl: input.headers.get('referer'),
      email: input.email,
      phone: input.phone,
      name: input.name,
      fbp: readCookie(cookieHeader, '_fbp'),
      fbc: readCookie(cookieHeader, '_fbc'),
      clientIp: clientIpFromHeaders(input.headers),
      clientUserAgent: input.headers.get('user-agent'),
      accessToken: token,
      testEventCode: resolveTestEventCode(input),
    });
    return await deliverMetaCapiLead(payload, input.fetchImpl ?? fetch, input.timeoutMs ?? META_CAPI_TIMEOUT_MS);
  } catch (error) {
    logMetaCapiFailure(error);
    return 'failed';
  }
}

/** Starts the CAPI request and does not wait for it. Never throws. */
export function queueMetaCapiLead(input: MetaCapiLeadInput): void {
  void postMetaCapiLead(input);
}
