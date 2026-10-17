export const GA4_CONFIG = {
  send_page_view: true,
  anonymize_ip: true,
  allow_google_signals: true,
  allow_ad_personalization_signals: false,
} as const;

type Gtag = (...args: unknown[]) => void;

function commandOf(entry: unknown): unknown {
  if (!entry || typeof entry !== 'object') return undefined;
  return (entry as { 0?: unknown })[0];
}

/**
 * Queue GA4 config before any events that were pushed while gtag.js was deferred.
 * Consent commands stay first so Consent Mode default/update still applies.
 */
export function ensureGa4Config(
  dataLayer: unknown[],
  gtag: Gtag,
  gaId: string,
  alreadyConfigured: boolean
): boolean {
  if (alreadyConfigured) return true;

  const events: unknown[] = [];
  const rest: unknown[] = [];
  for (const entry of dataLayer) {
    if (commandOf(entry) === 'event') events.push(entry);
    else rest.push(entry);
  }

  dataLayer.length = 0;
  for (const entry of rest) dataLayer.push(entry);
  gtag('js', new Date());
  gtag('config', gaId, { ...GA4_CONFIG });
  for (const entry of events) dataLayer.push(entry);
  return true;
}
