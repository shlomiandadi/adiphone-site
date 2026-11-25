import faqIndex from '../data/faq/index.json' with { type: 'json' };
import aeoGeo from '../data/faq/aeo-geo.json' with { type: 'json' };
import aiBots from '../data/faq/ai-bots.json' with { type: 'json' };
import chatgptAds from '../data/faq/chatgpt-ads.json' with { type: 'json' };
import chatgptBusinessHub from '../data/faq/chatgpt-business-hub.json' with { type: 'json' };
import ecommerce from '../data/faq/ecommerce.json' with { type: 'json' };
import general from '../data/faq/general.json' with { type: 'json' };
import glossary from '../data/faq/glossary.json' with { type: 'json' };
import landingPage from '../data/faq/landing-page.json' with { type: 'json' };
import localAreas from '../data/faq/local-areas.json' with { type: 'json' };
import localSeo from '../data/faq/local-seo.json' with { type: 'json' };
import mobileApps from '../data/faq/mobile-apps.json' with { type: 'json' };
import objections from '../data/faq/objections.json' with { type: 'json' };
import ownershipHostingSecurity from '../data/faq/ownership-hosting-security.json' with { type: 'json' };
import ppc from '../data/faq/ppc.json' with { type: 'json' };
import pricing from '../data/faq/pricing.json' with { type: 'json' };
import sentryGuard from '../data/faq/sentry-guard.json' with { type: 'json' };
import seo from '../data/faq/seo.json' with { type: 'json' };
import social from '../data/faq/social.json' with { type: 'json' };
import uiSoftwareAnalyticsCloud from '../data/faq/ui-software-analytics-cloud.json' with { type: 'json' };
import verticals from '../data/faq/verticals.json' with { type: 'json' };
import webDevelopment from '../data/faq/web-development.json' with { type: 'json' };

export type FaqIndexTopic = {
  topic: string;
  titleHe: string;
  count: number;
};

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export type FaqTopicFile = {
  topic: string;
  titleHe: string;
  descriptionHe: string;
  /** Optional unique meta description; falls back to descriptionHe. */
  metaDescriptionHe?: string;
  items: FaqItem[];
};

export function faqMetaDescription(data: Pick<FaqTopicFile, 'descriptionHe' | 'metaDescriptionHe'>): string {
  const meta = data.metaDescriptionHe?.trim();
  return meta || data.descriptionHe;
}

export type FaqRelatedLink = {
  href: string;
  label: string;
  external?: boolean;
};

type FaqIndexFile = {
  topics: FaqIndexTopic[];
  total: number;
};

function unwrapJsonModule<T extends object>(mod: T | { default: T } | null | undefined): T | null {
  let current: unknown = mod;
  for (let i = 0; i < 3; i += 1) {
    if (!current || typeof current !== 'object') return null;
    const record = current as Record<string, unknown>;
    const looksLikeTopic = 'topic' in record && 'items' in record;
    const looksLikeIndex = 'topics' in record;
    if ('default' in record && !looksLikeTopic && !looksLikeIndex) {
      current = record.default;
      continue;
    }
    break;
  }
  if (!current || typeof current !== 'object') return null;
  return current as T;
}

/**
 * Static JSON imports so Netlify/Next traces the files into the server bundle.
 * process.cwd() + readFileSync fails at runtime on Netlify (data/faq is not in
 * the function bundle), which 404s /faq/[topic] when dynamicParams is false.
 */
const TOPIC_FILES: Record<string, FaqTopicFile> = {
  'aeo-geo': unwrapJsonModule(aeoGeo as FaqTopicFile)!,
  'ai-bots': unwrapJsonModule(aiBots as FaqTopicFile)!,
  'chatgpt-ads': unwrapJsonModule(chatgptAds as FaqTopicFile)!,
  'chatgpt-business-hub': unwrapJsonModule(chatgptBusinessHub as FaqTopicFile)!,
  ecommerce: unwrapJsonModule(ecommerce as FaqTopicFile)!,
  general: unwrapJsonModule(general as FaqTopicFile)!,
  glossary: unwrapJsonModule(glossary as FaqTopicFile)!,
  'landing-page': unwrapJsonModule(landingPage as FaqTopicFile)!,
  'local-areas': unwrapJsonModule(localAreas as FaqTopicFile)!,
  'local-seo': unwrapJsonModule(localSeo as FaqTopicFile)!,
  'mobile-apps': unwrapJsonModule(mobileApps as FaqTopicFile)!,
  objections: unwrapJsonModule(objections as FaqTopicFile)!,
  'ownership-hosting-security': unwrapJsonModule(ownershipHostingSecurity as FaqTopicFile)!,
  ppc: unwrapJsonModule(ppc as FaqTopicFile)!,
  pricing: unwrapJsonModule(pricing as FaqTopicFile)!,
  'sentry-guard': unwrapJsonModule(sentryGuard as FaqTopicFile)!,
  seo: unwrapJsonModule(seo as FaqTopicFile)!,
  social: unwrapJsonModule(social as FaqTopicFile)!,
  'ui-software-analytics-cloud': unwrapJsonModule(uiSoftwareAnalyticsCloud as FaqTopicFile)!,
  verticals: unwrapJsonModule(verticals as FaqTopicFile)!,
  'web-development': unwrapJsonModule(webDevelopment as FaqTopicFile)!,
};

const indexData = unwrapJsonModule(faqIndex as FaqIndexFile)!;

export const FAQ_TOPICS: FaqIndexTopic[] = indexData.topics;
export const FAQ_TOTAL = indexData.total;
/** Slugs from bundled topic JSON files — used by generateStaticParams. */
export const FAQ_FILE_SLUGS = Object.keys(TOPIC_FILES);
export const FAQ_TOPIC_SLUGS = FAQ_TOPICS.map((topic) => topic.topic);
/** Index JSON + bundled files — used so a runtime-empty Object.keys map cannot 404 known URLs. */
export const KNOWN_FAQ_SLUGS = Array.from(new Set([...FAQ_FILE_SLUGS, ...FAQ_TOPIC_SLUGS]));

const topicSet = new Set(KNOWN_FAQ_SLUGS);

export function isFaqTopic(slug: string): boolean {
  return topicSet.has(slug);
}

/** Netlify/OpenNext may pass [topic] as a one-item array. */
export function normalizeFaqTopicParam(topic: unknown): string {
  if (typeof topic === 'string') return topic;
  if (Array.isArray(topic) && typeof topic[0] === 'string') return topic[0];
  return '';
}

export function getFaqIndexTopics(): FaqIndexTopic[] {
  return FAQ_TOPICS;
}

export function getFaqTopicTitle(slug: string): string | undefined {
  return FAQ_TOPICS.find((topic) => topic.topic === slug)?.titleHe;
}

export function getFaqTopic(slug: string): FaqTopicFile | null {
  if (typeof slug !== 'string' || !slug) return null;
  const data = TOPIC_FILES[slug];
  if (!data || data.topic !== slug || !Array.isArray(data.items)) return null;
  return data;
}

/**
 * Known topic slugs must never become a 404: Netlify Durable caches that
 * notFound() and the live /faq/[topic] pages stay broken after ISR.
 * Unknown slugs still return null so the page can call notFound().
 */
export function requireFaqTopic(slug: string): FaqTopicFile {
  const data = getFaqTopic(slug);
  if (data) return data;
  if (topicSet.has(slug) || FAQ_FILE_SLUGS.includes(slug)) {
    throw new Error(`FAQ topic bundle missing for known slug "${slug}"`);
  }
  throw new Error(`Unknown FAQ topic slug "${slug}"`);
}

const FEATURED_FAQ_IDS = [
  'q-000',
  'q-001',
  'q-034',
  'q-035',
  'q-061',
  'q-063',
  'q-257',
  'q-258',
] as const;

/** Visible featured Q&As for the /faq hub (and matching FAQPage JSON-LD). */
export function featuredFaqItems(): FaqItem[] {
  const byId = new Map<string, FaqItem>();
  for (const slug of FAQ_FILE_SLUGS) {
    const topic = getFaqTopic(slug);
    if (!topic) continue;
    for (const item of topic.items) {
      byId.set(item.id, item);
    }
  }
  return FEATURED_FAQ_IDS.map((id) => {
    const item = byId.get(id);
    if (!item) throw new Error(`Featured FAQ item missing: ${id}`);
    return item;
  });
}

const RELATED_BY_TOPIC: Record<string, FaqRelatedLink[]> = {
  'aeo-geo': [
    { href: '/services/aeo-geo', label: 'קידום במנועי AI (AEO/GEO)' },
    { href: '/services/seo', label: 'קידום אתרים SEO' },
    { href: '/pricing', label: 'מחירון' },
    { href: '/contact', label: 'צור קשר' },
  ],
  'ai-bots': [
    { href: '/services/ai', label: 'פתרונות AI' },
    { href: '/services/chatgpt-business-hub', label: 'עסק ב-ChatGPT' },
    { href: '/pricing', label: 'מחירון' },
    { href: '/contact', label: 'צור קשר' },
  ],
  'chatgpt-ads': [
    { href: '/services/chatgpt-ads', label: 'פרסום ממומן ב-ChatGPT' },
    { href: '/services/ppc', label: 'קמפיינים ממומנים' },
    { href: '/pricing', label: 'מחירון' },
    { href: '/contact', label: 'צור קשר' },
  ],
  'chatgpt-business-hub': [
    { href: '/services/chatgpt-business-hub', label: 'פרופיל עסקי ב-ChatGPT' },
    { href: '/services/aeo-geo', label: 'קידום במנועי AI' },
    { href: '/pricing', label: 'מחירון' },
    { href: '/contact', label: 'צור קשר' },
  ],
  ecommerce: [
    { href: '/services/ecommerce', label: 'חנויות אינטרנט' },
    { href: '/services/web-development', label: 'בניית אתרים' },
    { href: '/pricing', label: 'מחירון' },
    { href: '/contact', label: 'צור קשר' },
  ],
  general: [
    { href: '/about', label: 'אודות' },
    { href: '/contact', label: 'צור קשר' },
    { href: '/pricing', label: 'מחירון' },
  ],
  glossary: [
    { href: '/blog', label: 'הבלוג' },
    { href: '/services/seo', label: 'קידום אתרים SEO' },
    { href: '/pricing', label: 'מחירון' },
    { href: '/contact', label: 'צור קשר' },
  ],
  'landing-page': [
    { href: '/services/web-development', label: 'בניית אתרים' },
    { href: '/pricing', label: 'מחירון' },
    { href: '/contact', label: 'צור קשר' },
  ],
  'local-areas': [
    { href: '/services/bniyat-atarim-pardes-hana', label: 'בניית אתרים בפרדס חנה' },
    { href: '/services/web-development', label: 'בניית אתרים' },
    { href: '/pricing', label: 'מחירון' },
    { href: '/contact', label: 'צור קשר' },
  ],
  'local-seo': [
    { href: '/services/seo', label: 'קידום אתרים SEO' },
    { href: '/services/bniyat-atarim-pardes-hana', label: 'בניית אתרים בפרדס חנה' },
    { href: '/pricing', label: 'מחירון' },
    { href: '/contact', label: 'צור קשר' },
  ],
  'mobile-apps': [
    { href: '/services/mobile-apps', label: 'פיתוח אפליקציות' },
    { href: '/pricing', label: 'מחירון' },
    { href: '/contact', label: 'צור קשר' },
  ],
  objections: [
    { href: '/about', label: 'אודות' },
    { href: '/pricing', label: 'מחירון' },
    { href: '/contact', label: 'צור קשר' },
  ],
  'ownership-hosting-security': [
    { href: '/privacy-policy', label: 'מדיניות פרטיות' },
    { href: '/accessibility-statement', label: 'הצהרת נגישות' },
    { href: '/pricing', label: 'מחירון' },
    { href: '/contact', label: 'צור קשר' },
  ],
  ppc: [
    { href: '/services/ppc', label: 'קמפיינים ממומנים' },
    { href: '/services/seo', label: 'קידום אתרים SEO' },
    { href: '/pricing', label: 'מחירון' },
    { href: '/contact', label: 'צור קשר' },
  ],
  pricing: [
    { href: '/pricing', label: 'מחירון בניית אתרים' },
    { href: '/services/web-development', label: 'בניית אתרים' },
    { href: '/contact', label: 'צור קשר' },
  ],
  'sentry-guard': [
    { href: '/services/mobile-apps', label: 'פיתוח אפליקציות' },
    { href: '/portfolio', label: 'תיק עבודות' },
    { href: '/pricing', label: 'מחירון' },
    { href: '/contact', label: 'צור קשר' },
  ],
  seo: [
    { href: '/services/seo', label: 'קידום אתרים SEO' },
    { href: '/services/aeo-geo', label: 'קידום במנועי AI' },
    { href: '/pricing', label: 'מחירון' },
    { href: '/contact', label: 'צור קשר' },
  ],
  social: [
    { href: '/services/ppc', label: 'קמפיינים ממומנים' },
    { href: '/pricing', label: 'מחירון' },
    { href: '/contact', label: 'צור קשר' },
  ],
  'ui-software-analytics-cloud': [
    { href: '/services/ui-design', label: 'עיצוב UI/UX' },
    { href: '/services/software-development', label: 'פיתוח תוכנה' },
    { href: '/services/analytics', label: 'אנליטיקס' },
    { href: '/services/cloud', label: 'שירותי ענן' },
    { href: '/pricing', label: 'מחירון' },
    { href: '/contact', label: 'צור קשר' },
  ],
  verticals: [
    { href: '/services/web-development', label: 'בניית אתרים' },
    { href: '/services/web-development/lawyers', label: 'אתרים לעורכי דין' },
    { href: '/services/web-development/clinics', label: 'אתרים לקליניקות' },
    { href: '/pricing', label: 'מחירון' },
    { href: '/contact', label: 'צור קשר' },
  ],
  'web-development': [
    { href: '/services/web-development', label: 'בניית אתרים' },
    { href: '/services/wordpress', label: 'אתרי וורדפרס' },
    { href: '/pricing', label: 'מחירון' },
    { href: '/contact', label: 'צור קשר' },
  ],
};

const FALLBACK_RELATED: FaqRelatedLink[] = [
  { href: '/services', label: 'השירותים שלנו' },
  { href: '/pricing', label: 'מחירון' },
  { href: '/contact', label: 'צור קשר' },
];

export function relatedPagesForTopic(slug: string): FaqRelatedLink[] {
  return RELATED_BY_TOPIC[slug] ?? FALLBACK_RELATED;
}

export function siblingTopics(slug: string, count = 3): FaqIndexTopic[] {
  const index = FAQ_TOPICS.findIndex((topic) => topic.topic === slug);
  if (index < 0) return FAQ_TOPICS.filter((topic) => topic.topic !== slug).slice(0, count);
  const siblings: FaqIndexTopic[] = [];
  for (let offset = 1; siblings.length < count && offset < FAQ_TOPICS.length; offset += 1) {
    siblings.push(FAQ_TOPICS[(index + offset) % FAQ_TOPICS.length]);
  }
  return siblings;
}

export function faqPageJsonLd(items: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: 'he-IL',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

export function faqSitemapPaths(): string[] {
  return ['/faq', ...FAQ_TOPIC_SLUGS.map((slug) => `/faq/${slug}`)];
}

export function loadFaqIndexWithDescriptions(): Array<FaqIndexTopic & { descriptionHe: string }> {
  return FAQ_TOPICS.map((topic) => {
    const file = getFaqTopic(topic.topic);
    return {
      ...topic,
      descriptionHe: file?.descriptionHe ?? '',
    };
  });
}
