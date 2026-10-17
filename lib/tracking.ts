import {
  META_LEAD_STATE_KEY,
  isMetaContactEvent,
  nextMetaLeadState,
  readConsentFlags,
  shouldFlushMetaLead,
  shouldLoadMetaPixel,
} from './thirdPartyTags';

export const GA4_MEASUREMENT_ID = 'G-QMC63HG6SD';

const FIRST_TOUCH_KEY = 'tw_first_touch_v1';
const LAST_TOUCH_KEY = 'tw_last_touch_v1';

const UTM_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
] as const;

const CLICK_IDS = ['gclid', 'gbraid', 'wbraid'] as const;

export type Attribution = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  gclid?: string;
  gbraid?: string;
  wbraid?: string;
  referrer?: string;
  landing_page?: string;
  first_touch_at?: string;
};

export type CtaLocation =
  | 'header'
  | 'hero'
  | 'footer'
  | 'floating'
  | 'service-page'
  | 'pricing'
  | 'contact'
  | 'about'
  | 'blog'
  | 'other';

export type TrackingParams = Record<string, string | number | boolean | undefined>;

const SERVICE_NAMES: Record<string, string> = {
  '/services/seo': 'קידום אתרים',
  '/services/organic-seo': 'קידום אורגני',
  '/services/aeo-geo': 'קידום במנועי AI (AEO/GEO)',
  '/services/web-development': 'בניית אתרים',
  '/services/wordpress': 'אתרי וורדפרס',
  '/services/ecommerce': 'חנויות אונליין',
  '/services/mobile-apps': 'פיתוח אפליקציות',
  '/services/app-development': 'פיתוח אפליקציות',
  '/services/ui-design': 'עיצוב UI/UX',
  '/services/ppc': 'קידום ממומן PPC',
  '/services/paid-promotion': 'קידום ממומן',
  '/services/analytics': 'אנליטיקס',
  '/services/software-development': 'פיתוח תוכנה',
  '/services/software': 'פיתוח תוכנה',
  '/services/ai': 'פתרונות AI',
  '/services/cloud': 'שירותי ענן',
  '/services/bniyat-atarim-pardes-hana': 'בניית אתרים בפרדס חנה',
  '/services/bniyat-atarim-hadera': 'בניית אתרים בחדרה',
  '/services/bniyat-atarim-caesarea': 'בניית אתרים בקיסריה',
  '/services/bniyat-atarim-zichron-yaakov': 'בניית אתרים בזכרון יעקב',
  '/services/bniyat-atarim-haifa': 'בניית אתרים בחיפה',
  '/services/bniyat-atarim-netanya': 'בניית אתרים בנתניה',
  '/services/bniyat-atarim-or-akiva': 'בניית אתרים באור עקיבא',
  '/services/bniyat-atarim-binyamina': 'בניית אתרים בבנימינה',
  '/services/bniyat-atarim-yokneam': 'בניית אתרים ביוקנעם',
  '/services/bniyat-atarim-afula': 'בניית אתרים בעפולה',
  '/blog/kama-oleh-bniyat-atar-2026': 'כמה עולה בניית אתר ב-2026',
};

const CTA_LABELS = [
  'ייעוץ חינם',
  'השאירו פרטים',
  'לקבלת הצעת מחיר',
  'לייעוץ והצעת מחיר',
  'לייעוץ ראשוני',
  'דברו איתנו',
  'חייגו עכשיו',
  'הצעת מחיר',
  'התקשרו',
  'קבעו שיחת ייעוץ',
  'וואטסאפ עכשיו',
  'שלחו ואחזור',
];

function isBrowser() {
  return typeof window !== 'undefined';
}

function readJson<T>(storage: Storage, key: string): T | null {
  try {
    const raw = storage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function writeJson(storage: Storage, key: string, value: unknown) {
  try {
    storage.setItem(key, JSON.stringify(value));
  } catch {
    // private mode / quota
  }
}

function pickDefined(source: Record<string, string | undefined>): Attribution {
  const next: Attribution = {};
  for (const [key, value] of Object.entries(source)) {
    if (value) {
      (next as Record<string, string>)[key] = value;
    }
  }
  return next;
}

function captureFromLocation(): Attribution {
  if (!isBrowser()) return {};
  const params = new URLSearchParams(window.location.search);
  const values: Record<string, string | undefined> = {};
  for (const key of [...UTM_KEYS, ...CLICK_IDS]) {
    const value = params.get(key)?.trim();
    if (value) values[key] = value;
  }
  const referrer = document.referrer || undefined;
  const sameHost =
    referrer &&
    (() => {
      try {
        return new URL(referrer).host === window.location.host;
      } catch {
        return false;
      }
    })();
  return pickDefined({
    ...values,
    referrer: sameHost ? undefined : referrer,
    landing_page: `${window.location.pathname}${window.location.search}`,
  });
}

function hasCampaignSignal(attr: Attribution) {
  return Boolean(
    attr.utm_source ||
      attr.utm_medium ||
      attr.utm_campaign ||
      attr.gclid ||
      attr.gbraid ||
      attr.wbraid
  );
}

export function applyStoredConsent() {
  if (!isBrowser()) return false;
  try {
    const raw = document.cookie
      .split('; ')
      .find((row) => row.startsWith('cookie_consent_v1='));
    if (!raw) return false;
    const parsed = JSON.parse(decodeURIComponent(raw.slice('cookie_consent_v1='.length)));
    const cats = parsed?.categories;
    if (!cats) return false;
    const analytics = cats.analytics ? 'granted' : 'denied';
    const ad = cats.marketing ? 'granted' : 'denied';
    window.gtag?.('consent', 'update', {
      ad_storage: ad,
      ad_user_data: ad,
      ad_personalization: ad,
      analytics_storage: analytics,
      functionality_storage: cats.functional ? 'granted' : 'denied',
      security_storage: 'granted',
    });
    return Boolean(cats.analytics);
  } catch {
    return false;
  }
}

export function persistAttribution(): Attribution {
  if (!isBrowser()) return {};
  const incoming = captureFromLocation();
  const existing =
    readJson<Attribution>(window.localStorage, FIRST_TOUCH_KEY) ||
    readJson<Attribution>(window.sessionStorage, FIRST_TOUCH_KEY);

  let firstTouch = existing;
  if (!firstTouch) {
    firstTouch = {
      ...incoming,
      referrer: incoming.referrer || document.referrer || undefined,
      landing_page: incoming.landing_page || window.location.pathname,
      first_touch_at: new Date().toISOString(),
    };
    writeJson(window.localStorage, FIRST_TOUCH_KEY, firstTouch);
    writeJson(window.sessionStorage, FIRST_TOUCH_KEY, firstTouch);
  } else if (hasCampaignSignal(incoming) && !hasCampaignSignal(firstTouch)) {
    firstTouch = {
      ...firstTouch,
      ...incoming,
      first_touch_at: firstTouch.first_touch_at || new Date().toISOString(),
    };
    writeJson(window.localStorage, FIRST_TOUCH_KEY, firstTouch);
    writeJson(window.sessionStorage, FIRST_TOUCH_KEY, firstTouch);
  }

  const lastTouch = {
    ...firstTouch,
    ...incoming,
    landing_page: incoming.landing_page || firstTouch.landing_page,
  };
  writeJson(window.sessionStorage, LAST_TOUCH_KEY, lastTouch);
  return firstTouch;
}

export function getAttribution(): Attribution {
  if (!isBrowser()) return {};
  return (
    readJson<Attribution>(window.localStorage, FIRST_TOUCH_KEY) ||
    readJson<Attribution>(window.sessionStorage, FIRST_TOUCH_KEY) ||
    persistAttribution()
  );
}

export function attachAttribution<T extends Record<string, unknown>>(payload: T) {
  const attribution = persistAttribution();
  return {
    ...payload,
    ...attribution,
    attribution,
  };
}

export function inferServiceName(pathname = isBrowser() ? window.location.pathname : ''): string | undefined {
  if (SERVICE_NAMES[pathname]) return SERVICE_NAMES[pathname];
  if (pathname.startsWith('/services/')) {
    const match = Object.entries(SERVICE_NAMES).find(([path]) => pathname.startsWith(path));
    return match?.[1];
  }
  if (pathname === '/pricing') return 'מחירון בניית אתרים';
  return undefined;
}

export function inferCtaLocation(el?: Element | null, pathname = isBrowser() ? window.location.pathname : ''): CtaLocation {
  const marked = el?.closest('[data-cta-location]')?.getAttribute('data-cta-location');
  if (marked) return marked as CtaLocation;
  if (el?.closest('header, .site-header')) return 'header';
  if (el?.closest('footer')) return 'footer';
  if (el?.closest('.hero-stage')) return 'hero';
  if (pathname.startsWith('/services/')) return 'service-page';
  if (pathname.startsWith('/pricing')) return 'pricing';
  if (pathname.startsWith('/contact')) return 'contact';
  if (pathname.startsWith('/about')) return 'about';
  if (pathname.startsWith('/blog')) return 'blog';
  return 'other';
}

export function commonEventParams(extra: TrackingParams = {}): TrackingParams {
  if (!isBrowser()) return extra;
  const attribution = getAttribution();
  return {
    page_location: window.location.href,
    page_title: document.title,
    page_path: window.location.pathname,
    service_name: inferServiceName(),
    utm_source: attribution.utm_source,
    utm_medium: attribution.utm_medium,
    utm_campaign: attribution.utm_campaign,
    gclid: attribution.gclid,
    gbraid: attribution.gbraid,
    wbraid: attribution.wbraid,
    ...extra,
  };
}

function isMetaPixelReady() {
  if (!isBrowser()) return false;
  if (!window.__TW_PIXEL_LOADED || typeof window.fbq !== 'function') return false;
  return shouldLoadMetaPixel(window.location.hostname, readConsentFlags(document.cookie));
}

export function trackMetaContact() {
  if (!isMetaPixelReady()) return;
  try {
    window.fbq?.('track', 'Contact');
  } catch {
    // pixel not available
  }
}

export function trackMetaLead() {
  if (!isBrowser()) return;
  const next = nextMetaLeadState(isMetaPixelReady());
  try {
    window.sessionStorage.setItem(META_LEAD_STATE_KEY, next);
  } catch {
    if (next !== 'sent') return;
  }
  if (next !== 'sent') return;
  try {
    window.fbq?.('track', 'Lead');
  } catch {
    // pixel not available
  }
}

export function flushMetaLead() {
  if (!isBrowser()) return;
  const ready = isMetaPixelReady();
  let state: string | null = null;
  try {
    state = window.sessionStorage.getItem(META_LEAD_STATE_KEY);
  } catch {
    return;
  }
  if (!shouldFlushMetaLead(state, ready)) return;
  try {
    window.sessionStorage.setItem(META_LEAD_STATE_KEY, 'sent');
  } catch {
    return;
  }
  try {
    window.fbq?.('track', 'Lead');
  } catch {
    // pixel not available
  }
}

export function trackEvent(name: string, params: TrackingParams = {}) {
  if (!isBrowser()) return;
  persistAttribution();
  const payload = commonEventParams({
    send_to: GA4_MEASUREMENT_ID,
    transport_type: 'beacon',
    ...params,
  });
  const send = () => {
    try {
      window.gtag?.('event', name, payload);
    } catch {
      // gtag not ready
    }
  };
  send();
  if (isMetaContactEvent(name)) trackMetaContact();
}

export function trackGenerateLead(formName: string, extra: TrackingParams = {}) {
  trackEvent('generate_lead', { form_name: formName, ...extra });
  trackMetaLead();
}

export function trackPageView() {
  if (!isBrowser()) return;
  trackEvent('page_view', {
    page_location: window.location.href,
    page_title: document.title,
  });
}

export function isWhatsAppHref(href: string) {
  return /wa\.me|api\.whatsapp\.com|web\.whatsapp\.com|whatsapp\.com\/send/i.test(href);
}

export function isTelHref(href: string) {
  return href.toLowerCase().startsWith('tel:');
}

export function isMailtoHref(href: string) {
  return href.toLowerCase().startsWith('mailto:');
}

export function isMainCta(el: Element, label: string) {
  if (el.closest('[data-cta="true"], [data-cta="cta"]')) return true;
  const normalized = label.replace(/\s+/g, ' ').trim();
  return CTA_LABELS.some((cta) => normalized.includes(cta));
}

export const ATTRIBUTION_FIELD_LABELS: Record<keyof Attribution, string> = {
  utm_source: 'utm_source',
  utm_medium: 'utm_medium',
  utm_campaign: 'utm_campaign',
  utm_term: 'utm_term',
  utm_content: 'utm_content',
  gclid: 'gclid',
  gbraid: 'gbraid',
  wbraid: 'wbraid',
  referrer: 'Referrer',
  landing_page: 'עמוד נחיתה',
  first_touch_at: 'זמן מגע ראשון',
};

export function normalizeAttribution(raw: unknown): Attribution | null {
  if (!raw || typeof raw !== 'object') return null;
  const source = raw as Record<string, unknown>;
  const nested =
    source.attribution && typeof source.attribution === 'object'
      ? (source.attribution as Record<string, unknown>)
      : source;
  const next: Attribution = {};
  for (const key of Object.keys(ATTRIBUTION_FIELD_LABELS) as (keyof Attribution)[]) {
    const value = nested[key] ?? source[key];
    if (typeof value === 'string' && value.trim()) {
      next[key] = value.trim().slice(0, 500);
    }
  }
  return Object.keys(next).length ? next : null;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function formatAttributionEmailHtml(attribution: Attribution | null | undefined) {
  if (!attribution || !Object.keys(attribution).length) {
    return `
      <div style="background-color: #eef4ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #333; margin-bottom: 15px;">מקור הפנייה</h3>
        <p style="color: #666;">לא נשמר מקור הגעה (כניסה ישירה / ללא UTM או gclid).</p>
      </div>
    `;
  }
  const rows = (Object.keys(ATTRIBUTION_FIELD_LABELS) as (keyof Attribution)[])
    .filter((key) => attribution[key])
    .map(
      (key) =>
        `<li><strong>${ATTRIBUTION_FIELD_LABELS[key]}:</strong> ${escapeHtml(String(attribution[key]))}</li>`
    )
    .join('');
  return `
    <div style="background-color: #eef4ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="color: #333; margin-bottom: 15px;">מקור הפנייה</h3>
      <ul style="color: #666; line-height: 1.8;">${rows}</ul>
    </div>
  `;
}

export function injectAttributionFields(form: HTMLFormElement, attribution = getAttribution()) {
  const fields: (keyof Attribution)[] = [
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_term',
    'utm_content',
    'gclid',
    'gbraid',
    'wbraid',
    'referrer',
    'landing_page',
    'first_touch_at',
  ];
  for (const name of fields) {
    const value = attribution[name] || '';
    let input = form.querySelector<HTMLInputElement>(`input[name="${name}"][data-tracking-field="true"]`);
    if (!input) {
      input = document.createElement('input');
      input.type = 'hidden';
      input.name = name;
      input.dataset.trackingField = 'true';
      form.appendChild(input);
    }
    input.value = value;
  }
  const formName = form.getAttribute('data-form-name');
  if (formName) {
    let input = form.querySelector<HTMLInputElement>('input[name="form_name"][data-tracking-field="true"]');
    if (!input) {
      input = document.createElement('input');
      input.type = 'hidden';
      input.name = 'form_name';
      input.dataset.trackingField = 'true';
      form.appendChild(input);
    }
    input.value = formName;
  }
}
