/** Shared ISR / data-cache window for blog, portfolio, and llms.txt. */
export const CONTENT_REVALIDATE_SECONDS = 3600;

export const BLOG_CACHE_TAG = 'blog';
export const PORTFOLIO_CACHE_TAG = 'portfolio';
export const LLMS_CACHE_TAG = 'llms';
export const PRERENDER_CACHE_TAG = 'prerender-html';
export const SEO_AGENT_CACHE_TAG = 'seo-agent-apply';

export const PUBLIC_CACHE_CONTROL =
  'public, s-maxage=3600, stale-while-revalidate=86400';

export const PRIVATE_NO_STORE = 'private, no-store';

export const POST_LIST_SELECT = {
  id: true,
  title: true,
  slug: true,
  excerpt: true,
  mainImage: true,
  tags: true,
  published: true,
  createdAt: true,
  updatedAt: true,
  authorName: true,
  authorEmail: true,
  authorId: true,
  views: true,
  likes: true,
  metaTitle: true,
  metaDesc: true,
  canonicalUrl: true,
  ogImage: true,
  robots: true,
  category: {
    select: {
      id: true,
      name: true,
      slug: true,
      color: true,
      description: true,
    },
  },
  postTags: {
    include: { tag: true },
  },
} as const;

export function reviveDates<T extends { createdAt?: unknown; updatedAt?: unknown; date?: unknown }>(
  row: T
): T {
  const next = { ...row };
  if (typeof next.createdAt === 'string') next.createdAt = new Date(next.createdAt);
  if (typeof next.updatedAt === 'string') next.updatedAt = new Date(next.updatedAt);
  if (typeof next.date === 'string') next.date = new Date(next.date);
  return next;
}
