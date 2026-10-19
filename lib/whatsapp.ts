export const WHATSAPP_BASE = 'https://wa.me/972509159951';

export function whatsappUrl(text: string): string {
  return `${WHATSAPP_BASE}?text=${encodeURIComponent(text)}`;
}

/** Static pricing guide. The floating WhatsApp button prefills this message there. */
export const PRICING_ARTICLE_PATH = '/blog/kama-oleh-bniyat-atar-2026';
export const PRICING_ARTICLE_WHATSAPP_TEXT =
  'היי, ראיתי את המחירון באתר ואשמח לקבל הצעת מחיר לבניית אתר.';

/**
 * Page-specific WhatsApp href. Other pages keep the bare wa.me link so
 * tracking (Contact + eventID) and attribution stay on the same click path.
 */
export function whatsappHrefForPath(pathname: string): string {
  const path = (pathname || '/').replace(/\/$/, '') || '/';
  if (path === PRICING_ARTICLE_PATH) return whatsappUrl(PRICING_ARTICLE_WHATSAPP_TEXT);
  return WHATSAPP_BASE;
}
