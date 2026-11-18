import { readFileSync } from 'node:fs';
import { join } from 'node:path';

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
  items: FaqItem[];
};

export type FaqRelatedLink = {
  href: string;
  label: string;
  external?: boolean;
};

type FaqIndexFile = {
  topics: FaqIndexTopic[];
  total: number;
};

const faqDir = join(process.cwd(), 'data/faq');

function readFaqJson<T>(fileName: string): T {
  return JSON.parse(readFileSync(join(faqDir, fileName), 'utf8')) as T;
}

const indexData = readFaqJson<FaqIndexFile>('index.json');

export const FAQ_TOPICS: FaqIndexTopic[] = indexData.topics;
export const FAQ_TOTAL = indexData.total;
export const FAQ_TOPIC_SLUGS = FAQ_TOPICS.map((topic) => topic.topic);

const topicSet = new Set(FAQ_TOPIC_SLUGS);

export function isFaqTopic(slug: string): boolean {
  return topicSet.has(slug);
}

export function getFaqIndexTopics(): FaqIndexTopic[] {
  return FAQ_TOPICS;
}

export function getFaqTopicTitle(slug: string): string | undefined {
  return FAQ_TOPICS.find((topic) => topic.topic === slug)?.titleHe;
}

export function getFaqTopic(slug: string): FaqTopicFile | null {
  if (!isFaqTopic(slug)) return null;
  const data = readFaqJson<FaqTopicFile>(`${slug}.json`);
  if (!data || data.topic !== slug || !Array.isArray(data.items)) return null;
  return data;
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
