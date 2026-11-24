export const WEBSITE_CHECK_PATH = '/check';
export const WEBSITE_CHECK_SERVICE = 'בדיקת אתר חינם';
export const WEBSITE_CHECK_FORM_NAME = 'website_check';

export function normalizeWebsiteUrl(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  const candidate = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  try {
    const url = new URL(candidate);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return null;
    if (!url.hostname || !url.hostname.includes('.')) return null;
    if (url.hostname === 'localhost' || url.hostname.endsWith('.local')) return null;
    url.hash = '';
    return url.toString();
  } catch {
    return null;
  }
}

/** Israeli mobile/landline, with or without country code. */
export function isValidPhone(raw: string): boolean {
  const digits = raw.replace(/[^\d]/g, '');
  if (!digits) return false;

  if (digits.startsWith('972')) {
    return digits.length >= 11 && digits.length <= 12;
  }
  if (digits.startsWith('0')) {
    return digits.length === 9 || digits.length === 10;
  }
  return digits.length >= 9 && digits.length <= 10;
}

export function websiteCheckLeadPayload(websiteUrl: string, phone: string) {
  let host = websiteUrl;
  try {
    host = new URL(websiteUrl).hostname.replace(/^www\./, '');
  } catch {
    // keep the full URL as the contact name
  }

  return {
    name: host,
    phone,
    service: WEBSITE_CHECK_SERVICE,
    service_key: 'web-development',
    message: `פנייה חדשה בנושא: ${WEBSITE_CHECK_SERVICE}\nמקור: ${WEBSITE_CHECK_PATH}\nכתובת האתר: ${websiteUrl}`,
    form_name: WEBSITE_CHECK_FORM_NAME,
  };
}
