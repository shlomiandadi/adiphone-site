export const META_PIXEL_ID = '1317769456632052';
export const AHREFS_ANALYTICS_KEY = 'aB0fdPwT7Rd5S9fsBNZURA';
export const AHREFS_ANALYTICS_SRC = 'https://analytics.ahrefs.com/analytics.js';
export const META_LEAD_STATE_KEY = 'tw_meta_lead_v1';

const CONSENT_COOKIE_NAME = 'cookie_consent_v1';
const PRODUCTION_HOSTS = new Set(['adi-phone.co.il', 'www.adi-phone.co.il']);

export type ConsentFlags = {
  /** categories.analytics — Consent Mode analytics_storage */
  analytics: boolean;
  /** categories.marketing — Consent Mode ad_storage */
  marketing: boolean;
};

const DENIED: ConsentFlags = { analytics: false, marketing: false };

/**
 * cookie_consent_v1 stores categories.marketing as ad_storage and
 * categories.analytics as analytics_storage (see CookieConsent).
 * Accepts a full document.cookie string or the raw cookie value.
 */
export function readConsentFlags(cookieString: string | null | undefined): ConsentFlags {
  if (!cookieString) return DENIED;
  const pair = cookieString
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${CONSENT_COOKIE_NAME}=`));
  const raw = pair ? pair.slice(CONSENT_COOKIE_NAME.length + 1) : cookieString.trim();
  if (!raw) return DENIED;
  try {
    const parsed = JSON.parse(decodeURIComponent(raw)) as {
      categories?: { analytics?: unknown; marketing?: unknown };
    };
    const categories = parsed?.categories;
    if (!categories || typeof categories !== 'object') return DENIED;
    return {
      analytics: categories.analytics === true,
      marketing: categories.marketing === true,
    };
  } catch {
    return DENIED;
  }
}

export function isProductionHostname(hostname: string | null | undefined): boolean {
  if (!hostname) return false;
  const normalized = hostname.trim().toLowerCase().replace(/\.$/, '').split(':')[0];
  return PRODUCTION_HOSTS.has(normalized);
}

export function shouldLoadMetaPixel(hostname: string, consent: ConsentFlags): boolean {
  return consent.marketing === true && isProductionHostname(hostname);
}

export function shouldLoadAhrefs(hostname: string, consent: ConsentFlags): boolean {
  return consent.analytics === true && isProductionHostname(hostname);
}

/**
 * Empty config keeps the built-in pixel. `blocked` is an env-supplied id that
 * must not be booted (Netlify's FB_PIXEL_ID). The official pixel is never blocked.
 */
export function resolveMetaPixelId(configured?: string | null, blocked?: string | null): string {
  const trimmed = configured?.trim() || '';
  const retired = blocked?.trim() || '';
  if (!trimmed || (retired && retired !== META_PIXEL_ID && trimmed === retired)) return META_PIXEL_ID;
  return trimmed;
}

export type MetaLeadStatus = 'pending' | 'sent';

/** One successful submission. `sent` already produced its single Lead. */
export type MetaLeadRecord = {
  eventId: string;
  status: MetaLeadStatus;
};

export function createMetaEventId(): string {
  const cryptoObj = globalThis.crypto;
  if (cryptoObj && typeof cryptoObj.randomUUID === 'function') {
    return cryptoObj.randomUUID();
  }
  return `tw_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 12)}`;
}

/**
 * sessionStorage keeps one record for the latest submission in this tab.
 * A new submission replaces it, so a later visit or a later submit is not blocked.
 * Legacy "pending"/"sent" strings from the previous guard are not a live submission.
 */
export function parseMetaLeadRecord(raw: string | null | undefined): MetaLeadRecord | null {
  if (!raw || raw === 'pending' || raw === 'sent') return null;
  try {
    const parsed = JSON.parse(raw) as { eventId?: unknown; status?: unknown };
    if (!parsed || typeof parsed.eventId !== 'string' || !parsed.eventId) return null;
    if (parsed.status !== 'pending' && parsed.status !== 'sent') return null;
    return { eventId: parsed.eventId, status: parsed.status };
  } catch {
    return null;
  }
}

export function serializeMetaLeadRecord(record: MetaLeadRecord): string {
  return JSON.stringify({ eventId: record.eventId, status: record.status });
}

/** Pixel ready sends now. Otherwise the same event id waits for one flush. */
export function beginMetaLead(eventId: string, pixelReady: boolean): MetaLeadRecord {
  return { eventId, status: pixelReady ? 'sent' : 'pending' };
}

/** Thank-you and pixel-load flush. Sends only that submission's pending id, once. */
export function promotePendingMetaLead(
  record: MetaLeadRecord | null,
  pixelReady: boolean
): MetaLeadRecord | null {
  if (!record || record.status !== 'pending' || !pixelReady || !record.eventId) return null;
  return { eventId: record.eventId, status: 'sent' };
}

/** Thank-you loads the pixel immediately. PageView on this path is Meta's own. */
export function isThankYouPath(pathname: string | null | undefined): boolean {
  if (!pathname) return false;
  return pathname === '/thank-you' || pathname.startsWith('/thank-you/');
}

/**
 * One manual PageView, on init only. Later route changes are fbevents' pushState
 * hook. A second manual PageView on the same load is dropped by fbevents 2.9.419.
 */
export function metaPixelBootScript(pixelId: string): string {
  return `
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
    n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', ${JSON.stringify(pixelId)});
    fbq('track', 'PageView');
  `;
}

/** fbq('track', name, customData, {eventID}) — eventID is what Meta dedupes on. */
export function metaStandardTrackArguments(
  eventName: 'Lead' | 'Contact' | 'PageView',
  eventId?: string
): unknown[] {
  if (eventId) return ['track', eventName, {}, { eventID: eventId }];
  return ['track', eventName];
}

export function isMetaContactEvent(name: string): boolean {
  return name === 'phone_click' || name === 'whatsapp_click';
}
