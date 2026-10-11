const DEFAULT_SITE_URL = 'https://adi-phone.co.il';

/** Primary service URLs that own money keywords (avoid blog cannibalization). */
export const SERVICE_CANONICALS = {
  wordpress: '/services/wordpress',
  ppc: '/services/ppc',
  seo: '/services/seo',
  webDevelopment: '/services/web-development',
  mobileApps: '/services/mobile-apps',
  software: '/services/software',
  softwareDevelopment: '/services/software-development',
} as const;

/**
 * Blog posts that currently compete with service pages for the same head terms.
 * Soft fix: differentiate meta titles toward informational intent.
 */
export const BLOG_META_OVERRIDES: Record<
  string,
  { metaTitle: string; metaDesc: string; relatedService: string; relatedLabel: string }
> = {
  'mvmchh-vvrdprs': {
    metaTitle: 'איך בוחרים מומחה לבניית אתר וורדפרס? מדריך השוואה 2026',
    metaDesc:
      'מדריך מעשי לבחירת מומחה וורדפרס: מה לבדוק לפני פיתוח, איך להשוות הצעות, ומתי כדאי לפנות לצוות מקצועי. מאת Top Webstak.',
    relatedService: SERVICE_CANONICALS.wordpress,
    relatedLabel: 'שירות בניית אתרי וורדפרס',
  },
  'nyhvl-kmpyyn-mmvmn': {
    metaTitle: 'איך לנהל קמפיין ממומן נכון: שלבים, תקציב ומדידה לעסקים',
    metaDesc:
      'מדריך שלב-אחר-שלב לניהול קמפיין ממומן: הגדרת יעדים, בחירת פלטפורמה, מעקב המרות ואופטימיזציה יומית. מאת Top Webstak.',
    relatedService: SERVICE_CANONICALS.ppc,
    relatedLabel: 'שירות ניהול קמפיינים ממומנים',
  },
  'nyhvl-kmpyynym-mmvmnym': {
    metaTitle: 'ניהול קמפיינים ממומנים ב-2026: אסטרטגיה, KPI ואופטימיזציה',
    metaDesc:
      'סקירה מקצועית לניהול קמפיינים ממומנים ב-2026: מבנה חשבון, מדדי הצלחה ושיפור ROI לאורך זמן. מאת Top Webstak.',
    relatedService: SERVICE_CANONICALS.ppc,
    relatedLabel: 'שירות קידום ממומן PPC',
  },
  'kydvm-mmvmn-ppc': {
    metaTitle: 'מדריך קידום ממומן PPC למתחילים: מושגים, תקציב ותוצאות',
    metaDesc:
      'הסבר ברור על קידום ממומן PPC: איך זה עובד, מה ההבדל מ-SEO, ואיך מתחילים נכון עם תקציב מדיד. מאת Top Webstak.',
    relatedService: SERVICE_CANONICALS.ppc,
    relatedLabel: 'שירות קידום ממומן PPC',
  },
  'kmpyynym-mmvmnym': {
    metaTitle: 'קמפיינים ממומנים לעסקים: מדריך תכנון והרצה נכונה',
    metaDesc:
      'מדריך תכנון לקמפיינים ממומנים: מחקר קהל, מסרים, מדידה ושיפור מתמשך. מאת Top Webstak.',
    relatedService: SERVICE_CANONICALS.ppc,
    relatedLabel: 'שירות קמפיינים ממומנים',
  },
  'bnyyt-atry-vvrdprs': {
    metaTitle: 'בניית אתרי וורדפרס: מדריך תהליך מלא לעסקים',
    metaDesc:
      'מדריך תהליך לבניית אתר וורדפרס לעסק: אפיון, עיצוב, פיתוח, אבטחה וקידום. מאת Top Webstak.',
    relatedService: SERVICE_CANONICALS.wordpress,
    relatedLabel: 'שירות פיתוח אתרי וורדפרס',
  },
  // Quick win: #2.3 for "בניית אתרים פרדס חנה" with 0 clicks — stronger title + CTA/phone.
  'bnyyt-atrym-prds-chnh': {
    metaTitle: 'בניית אתרים בפרדס חנה לעסקים | Top Webstak – 050-9159951',
    metaDesc:
      'בניית אתרים בפרדס חנה והסביבה: אתרי תדמית וחנויות מהירים, מותאמים לנייד וידידותיים לגוגל, מצוות מקומי. קבלו הצעת מחיר ללא התחייבות – חייגו 050-9159951.',
    relatedService: SERVICE_CANONICALS.webDevelopment,
    relatedLabel: 'שירות בניית אתרים',
  },
};

export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_API_URL || DEFAULT_SITE_URL;
  return raw.replace(/\/$/, '').replace(/^http:\/\//i, 'https://');
}

/**
 * Force a safe self-referencing HTTPS canonical.
 * Fixes Ahrefs "Non-canonical in Sitemap" + "Canonical to Redirect" when DB stores http://.
 */
export function normalizeCanonicalUrl(
  input: string | null | undefined,
  fallbackPath: string
): string {
  const siteUrl = getSiteUrl();
  const fallback = fallbackPath.startsWith('http')
    ? fallbackPath.replace(/^http:\/\//i, 'https://')
    : `${siteUrl}${fallbackPath.startsWith('/') ? fallbackPath : `/${fallbackPath}`}`;

  if (!input || !input.trim()) return fallback.replace(/\/$/, '') || siteUrl;

  try {
    const url = new URL(input.trim(), siteUrl);
    url.protocol = 'https:';
    url.hash = '';
    if (
      url.hostname === 'adi-phone.co.il' ||
      url.hostname === 'www.adi-phone.co.il' ||
      url.hostname === 'localhost'
    ) {
      url.hostname = new URL(siteUrl).hostname;
    }
    const normalized = url.toString().replace(/\/$/, '');
    return normalized || fallback;
  } catch {
    return fallback.replace(/\/$/, '') || siteUrl;
  }
}

export function absoluteUrl(path: string): string {
  const siteUrl = getSiteUrl();
  if (path.startsWith('http')) return normalizeCanonicalUrl(path, path);
  return `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`;
}
