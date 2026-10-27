export type RelatedLink = { href: string; label: string };

const SEO_GUIDES: RelatedLink[] = [
  { href: '/blog/mh-zh-seo', label: 'מדריך SEO למתחילים' },
  { href: '/blog/ayk-lbchvr-chbrt-kydvm-atrym', label: 'איך לבחור חברת קידום אתרים' },
];

const AI_GUIDES: RelatedLink[] = [
  { href: '/blog/ptrvnvt-bynh-mlakvtyt', label: 'מדריך בינה מלאכותית לעסקים' },
  { href: '/services/aeo-geo', label: 'קידום במנועי AI' },
];

const SEO_SLUGS = new Set([
  'mh-zh-seo',
  'ayk-lbchvr-chbrt-kydvm-atrym',
  'kydvm-atrym-avrgny',
  'pytvch-tvknh',
  'pytvch-atrym-seo-shyvvk-dygytly',
  'seo-tips-google-ranking-guide',
]);

const AI_SLUGS = new Set([
  'ptrvnvt-bynh-mlakvtyt',
  'ai-bot-for-businesses',
  'ptrvnvt-cloud-abtchh-v-devops',
]);

const WEBSITE_SLUGS = new Set([
  'kama-oleh-bniyat-atar-2026',
  'mvmchh-vvrdprs',
]);

function looksSeo(category: string) {
  return /seo|קידום/i.test(category);
}

function looksAi(category: string) {
  return /\bai\b|בינה|מלאכות/i.test(category);
}

function looksWebsite(category: string) {
  return /אתר|וורדפרס|wordpress|בניית/i.test(category);
}

export function relatedArticleLinks(slug: string, category = ''): RelatedLink[] {
  const links: RelatedLink[] = [];
  const pushAll = (items: RelatedLink[]) => {
    for (const item of items) {
      if (item.href !== `/blog/${slug}` && !links.some((row) => row.href === item.href)) {
        links.push(item);
      }
    }
  };

  if (SEO_SLUGS.has(slug) || looksSeo(category)) pushAll(SEO_GUIDES);
  if (AI_SLUGS.has(slug) || looksAi(category)) pushAll(AI_GUIDES);
  if (WEBSITE_SLUGS.has(slug) || looksWebsite(category)) {
    pushAll([
      { href: '/services/website-tadmit', label: 'אתרי תדמית לעסקים' },
      { href: '/services/web-development', label: 'בניית אתרים' },
    ]);
  }

  return links.slice(0, 4);
}

export const FEATURED_HOME_POSTS: RelatedLink[] = [
  { href: '/blog/ayk-lbchvr-chbrt-kydvm-atrym', label: 'איך לבחור חברת קידום אתרים' },
  { href: '/blog/mh-zh-seo', label: 'מה זה SEO – מדריך למתחילים' },
  { href: '/blog/ptrvnvt-bynh-mlakvtyt', label: 'מדריך בינה מלאכותית לעסקים' },
];

export type PortfolioRelated = {
  serviceHref: string;
  serviceLabel: string;
};

/** Service mapping from published project type — no city claims. */
export const PORTFOLIO_RELATED_SERVICE: Record<string, PortfolioRelated> = {
  'oil-cbd': { serviceHref: '/services/ecommerce', serviceLabel: 'חנות אונליין' },
  'avora-home': { serviceHref: '/services/website-tadmit', serviceLabel: 'אתר תדמית' },
  'top-aventa': { serviceHref: '/services/website-tadmit', serviceLabel: 'אתר תדמית' },
  'lev-bagan': { serviceHref: '/services/website-tadmit', serviceLabel: 'אתר תדמית' },
  'meditation-day': { serviceHref: '/services/website-tadmit', serviceLabel: 'אתר תדמית' },
  'shaer-finance': { serviceHref: '/services/website-tadmit', serviceLabel: 'אתר תדמית' },
  'work-accidents': { serviceHref: '/services/website-tadmit', serviceLabel: 'אתר תדמית' },
  'topwebstack-landing': { serviceHref: '/services/web-development', serviceLabel: 'דף נחיתה' },
};

export const FEATURED_HOME_PORTFOLIO: RelatedLink[] = [
  { href: '/portfolio/oil-cbd', label: 'חנות אונליין לשמני CBD' },
  { href: '/portfolio/avora-home', label: 'אתר שיווק פרויקטים ל-AVORA' },
  { href: '/portfolio/top-aventa', label: 'אתר השכרת ציוד לאירועים' },
];
