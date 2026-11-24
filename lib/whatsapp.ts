export const WHATSAPP_BASE = 'https://wa.me/972509159951';

export function whatsappUrl(text: string): string {
  return `${WHATSAPP_BASE}?text=${encodeURIComponent(text)}`;
}

/** Static pricing guide. The floating WhatsApp button prefills this message there. */
export const PRICING_ARTICLE_PATH = '/blog/kama-oleh-bniyat-atar-2026';
export const PRICING_ARTICLE_WHATSAPP_TEXT =
  'היי, ראיתי את המחירון באתר ואשמח לקבל הצעת מחיר לבניית אתר.';

export const DEFAULT_WHATSAPP_TEXT =
  'שלום שלומי, אשמח לשיחת ייעוץ והצעת מחיר לבניית אתר';

const PATH_WHATSAPP_TEXT: Record<string, string> = {
  '/pricing': 'שלום שלומי, ראיתי את המחירון באתר ואשמח להצעת מחיר',
  '/services/web-development': 'שלום שלומי, אשמח לקבל הצעת מחיר לבניית אתר',
  '/services/bniyat-atarim-pardes-hana':
    'שלום שלומי, מחפש בניית אתר באזור פרדס חנה ואשמח לשיחת ייעוץ',
  '/services/seo': 'שלום שלומי, אשמח לשמוע על קידום אתרים אורגני',
  '/services/ecommerce': 'שלום שלומי, אשמח להצעת מחיר לחנות אינטרנטית',
  '/services/ppc': 'שלום שלומי, אשמח לשמוע על קידום ממומן בגוגל',
};

/**
 * Page-specific WhatsApp href for the floating button / sticky bar.
 * The pricing-guide article keeps its existing prefilled copy.
 */
export function whatsappHrefForPath(pathname: string): string {
  const path = (pathname || '/').replace(/\/$/, '') || '/';
  if (path === PRICING_ARTICLE_PATH) return whatsappUrl(PRICING_ARTICLE_WHATSAPP_TEXT);
  return whatsappUrl(PATH_WHATSAPP_TEXT[path] || DEFAULT_WHATSAPP_TEXT);
}
