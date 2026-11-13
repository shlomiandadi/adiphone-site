export type CmsBreadcrumbItem = {
  url: string;
  title: string;
  isActive?: boolean;
};

/**
 * Hebrew names for known routes. The visible trail and the single
 * BreadcrumbList both use this map so they cannot drift apart.
 */
const SEGMENT_TITLES: Record<string, string> = {
  about: 'אודות',
  services: 'שירותים',
  portfolio: 'תיק עבודות',
  blog: 'בלוג',
  category: 'קטגוריה',
  tag: 'תגית',
  pricing: 'מחירון',
  contact: 'צור קשר',
  'privacy-policy': 'מדיניות פרטיות',
  'accessibility-statement': 'הצהרת נגישות',
  terms: 'תנאי שימוש',
  'data-deletion': 'מחיקת נתוני משתמש',
  'web-development': 'בניית אתרים',
  lawyers: 'עורכי דין',
  clinics: 'קליניקות',
  accountants: 'רואי חשבון',
  wordpress: 'וורדפרס',
  ecommerce: 'חנויות אינטרנט',
  'mobile-apps': 'פיתוח אפליקציות',
  'app-development': 'פיתוח אפליקציות',
  seo: 'קידום אורגני',
  'organic-seo': 'קידום אורגני',
  ppc: 'קידום ממומן',
  'paid-promotion': 'קידום ממומן',
  ai: 'בינה מלאכותית',
  cloud: 'שירותי ענן',
  analytics: 'אנליטיקס',
  'ui-design': 'עיצוב UI/UX',
  software: 'פתרונות תוכנה',
  'software-development': 'פיתוח תוכנה',
  'aeo-geo': 'קידום במנועי AI (AEO/GEO)',
  'chatgpt-business-hub': 'עסק ב-ChatGPT Business Hub',
  'chatgpt-ads': 'פרסום ממומן ב-ChatGPT',
  'bniyat-atarim-pardes-hana': 'בניית אתרים בפרדס חנה',
  'bniyat-atarim-hadera': 'בניית אתרים בחדרה',
  'bniyat-atarim-caesarea': 'בניית אתרים בקיסריה',
  'bniyat-atarim-zichron-yaakov': 'בניית אתרים בזכרון יעקב',
  'bniyat-atarim-haifa': 'בניית אתרים בחיפה',
  'bniyat-atarim-netanya': 'בניית אתרים בנתניה',
  'bniyat-atarim-or-akiva': 'בניית אתרים באור עקיבא',
  'bniyat-atarim-binyamina': 'בניית אתרים בבנימינה',
  'bniyat-atarim-yokneam': 'בניית אתרים ביוקנעם',
  'bniyat-atarim-afula': 'בניית אתרים בעפולה',
  'kama-oleh-bniyat-atar-2026': 'כמה עולה בניית אתר ב-2026',
  project1: 'פרויקט 1',
  project2: 'פרויקט 2',
  project3: 'פרויקט 3',
};

/** Hebrew label for one URL segment. Unknown segments keep a readable slug. */
export function breadcrumbSegmentTitle(segment: string): string {
  if (SEGMENT_TITLES[segment]) return SEGMENT_TITLES[segment];
  try {
    return decodeURIComponent(segment).replace(/-/g, ' ');
  } catch {
    return segment.replace(/-/g, ' ');
  }
}

function isBreadcrumbList(node: unknown): boolean {
  if (!node || typeof node !== 'object') return false;
  const type = (node as { '@type'?: unknown })['@type'];
  return type === 'BreadcrumbList' || (Array.isArray(type) && type.includes('BreadcrumbList'));
}

/**
 * Drop a stored BreadcrumbList. The layout already emits one Hebrew list,
 * so an override must not add a second trail (often English, from slugs).
 */
export function omitBreadcrumbList(schema: unknown): unknown | null {
  if (Array.isArray(schema)) {
    const items = schema.filter((node) => !isBreadcrumbList(node));
    return items.length ? items : null;
  }
  if (!schema || typeof schema !== 'object') return schema;
  if (isBreadcrumbList(schema)) return null;
  const record = schema as { '@graph'?: unknown };
  if (!Array.isArray(record['@graph'])) return schema;
  const graph = record['@graph'].filter((node) => !isBreadcrumbList(node));
  if (graph.length === 0) return null;
  return { ...record, '@graph': graph };
}

/** Visible breadcrumb items for a pathname. Home is rendered separately. */
/** True when the page (not the root layout) owns the single BreadcrumbList. */
export function pageOwnsBreadcrumbJsonLd(pathname: string): boolean {
  const parts = pathname.split('/').filter(Boolean);
  if (parts[0] === 'blog' && parts[1] === 'category' && parts[2]) return true;
  if (parts[0] === 'blog' && parts[1] === 'tag' && parts[2]) return true;
  if (parts[0] === 'blog' && parts.length === 2) return true;
  if (parts[0] === 'portfolio' && parts.length === 2) return true;
  return false;
}

export function lookupBreadcrumbLeaf(
  leaves: Record<string, string> | undefined,
  pathname: string
): string | undefined {
  if (!leaves) return undefined;
  if (leaves[pathname]) return leaves[pathname];
  try {
    const decoded = decodeURIComponent(pathname);
    if (decoded !== pathname && leaves[decoded]) return leaves[decoded];
  } catch {
    // ignore malformed percent-encoding
  }
  return undefined;
}

export function fallbackBreadcrumbItems(pathname: string, leafTitle?: string): CmsBreadcrumbItem[] {
  const paths = pathname.split('/').filter(Boolean);
  const items: CmsBreadcrumbItem[] = [];
  let current = '';
  paths.forEach((path, index) => {
    current += `/${path}`;
    items.push({
      url: current,
      title: breadcrumbSegmentTitle(path),
      isActive: index === paths.length - 1,
    });
  });
  const title = leafTitle?.trim();
  if (title && items.length > 0) {
    const last = items[items.length - 1];
    items[items.length - 1] = { ...last, title };
  }
  return items;
}
