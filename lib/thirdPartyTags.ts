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

export function resolveMetaPixelId(configured?: string | null): string {
  const trimmed = configured?.trim() || '';
  return trimmed || META_PIXEL_ID;
}

/** A new lead submission. Pixel not ready defers the Lead; ready sends it now. */
export function nextMetaLeadState(pixelReady: boolean): 'pending' | 'sent' {
  return pixelReady ? 'sent' : 'pending';
}

/** Thank-you and pixel-load flush. Sends only a deferred lead, once. */
export function shouldFlushMetaLead(state: string | null, pixelReady: boolean): boolean {
  return state === 'pending' && pixelReady;
}

export function isMetaContactEvent(name: string): boolean {
  return name === 'phone_click' || name === 'whatsapp_click';
}
