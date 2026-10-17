import { PrismaClient, Post } from '@prisma/client';
import type { BlogNavPost } from './blogNav';

const prisma = new PrismaClient();

type Category = 'SEO' | 'WEB_DEVELOPMENT' | 'APP_DEVELOPMENT' | 'DIGITAL_MARKETING' | 'UI_UX' | 'ECOMMERCE';

export const BLOG_POSTS_PER_PAGE = 6;

export async function getPublishedPosts({ limit }: { limit?: number } = {}): Promise<Post[]> {
  return prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
}

const NAV_POST_LIMIT = 100;

function navCategoryName(category: unknown) {
  if (typeof category === 'string') return category;
  if (category && typeof category === 'object' && 'name' in category) {
    const name = (category as { name?: unknown }).name;
    if (typeof name === 'string' && name) return name;
  }
  return '';
}

async function fallbackNavPosts(): Promise<BlogNavPost[]> {
  const data = await fetchFallbackJson(`/api/posts?limit=${NAV_POST_LIMIT}&fields=nav`);
  const rows = Array.isArray(data?.posts) ? data.posts : [];
  return rows.map((post: { title?: string; slug?: string; category?: unknown }) => ({
    title: String(post.title || ''),
    slug: String(post.slug || ''),
    category: navCategoryName(post.category) || 'כללי',
  }));
}

/** Titles and slugs only, same 100-post window the nav used to fetch in the browser. */
export async function getPublishedNavPosts(): Promise<BlogNavPost[]> {
  if (!process.env.DATABASE_URL && contentFallbackOrigin) {
    return fallbackNavPosts();
  }
  try {
    const posts = await prisma.post.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      take: NAV_POST_LIMIT,
      select: {
        title: true,
        slug: true,
        category: { select: { name: true } },
      },
    });
    return posts.map((post) => ({
      title: post.title,
      slug: post.slug,
      category: post.category?.name || 'כללי',
    }));
  } catch (error) {
    if (!contentFallbackOrigin) throw error;
    console.warn('Nav posts DB read failed, using content fallback:', error);
    return fallbackNavPosts();
  }
}

const contentFallbackOrigin = (process.env.CONTENT_FALLBACK_ORIGIN || '').replace(/\/$/, '');

function asDate(value: string | Date) {
  return value instanceof Date ? value : new Date(value);
}

async function fetchFallbackJson(path: string) {
  if (!contentFallbackOrigin) return null;
  // revalidate matches the blog ISR window. no-store would force a static
  // page to become dynamic and fail the request.
  const response = await fetch(`${contentFallbackOrigin}${path}`, { next: { revalidate: 300 } });
  if (!response.ok) return null;
  return response.json();
}

async function fallbackPublishedPostsPage(page: number, limit: number) {
  const data = await fetchFallbackJson(`/api/posts?page=${page}&limit=${limit}`);
  const rows = Array.isArray(data?.posts) ? data.posts : [];
  return {
    posts: rows.map((post: Record<string, unknown>) => ({
      ...post,
      category: {
        name: typeof post.category === 'string' ? post.category : 'כללי',
        slug: typeof post.categorySlug === 'string' ? post.categorySlug : '',
        color: typeof post.categoryColor === 'string' ? post.categoryColor : null,
        description: null,
      },
      createdAt: asDate(String(post.createdAt || Date.now())),
      updatedAt: asDate(String(post.updatedAt || Date.now())),
    })),
    pagination: data?.pagination || {
      page,
      limit,
      total: rows.length,
      pages: 1,
    },
  };
}

async function fallbackPostBySlug(slug: string) {
  const post = await fetchFallbackJson(`/api/posts/${encodeURIComponent(slug)}`);
  if (!post || post.error) return null;
  return {
    ...post,
    createdAt: asDate(post.createdAt),
    updatedAt: asDate(post.updatedAt),
  };
}

export async function getPublishedPostsPage(page = 1, limit = BLOG_POSTS_PER_PAGE) {
  const safePage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
  if (!process.env.DATABASE_URL && contentFallbackOrigin) {
    return fallbackPublishedPostsPage(safePage, limit);
  }
  try {
  const where = { published: true as const };
  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (safePage - 1) * limit,
      take: limit,
      include: {
        category: { select: { name: true, slug: true, color: true, description: true } },
      },
    }),
    prisma.post.count({ where }),
  ]);

  return {
    posts,
    pagination: {
      page: safePage,
      limit,
      total,
      pages: Math.max(1, Math.ceil(total / limit) || 1),
    },
  };
  } catch (error) {
    if (!contentFallbackOrigin) throw error;
    console.warn('Published posts DB read failed, using content fallback:', error);
    return fallbackPublishedPostsPage(safePage, limit);
  }
}

export async function getPostBySlug(slug: string) {
  if (!process.env.DATABASE_URL && contentFallbackOrigin) {
    return fallbackPostBySlug(slug);
  }
  try {
    return await prisma.post.findUnique({
      where: { slug },
      include: {
        category: { select: { name: true, slug: true, color: true } },
        postTags: { include: { tag: true } },
      },
    });
  } catch (error) {
    if (!contentFallbackOrigin) throw error;
    console.warn('Blog post DB read failed, using content fallback:', error);
    return fallbackPostBySlug(slug);
  }
}

export async function getPostsByCategory(categorySlug: string): Promise<Post[]> {
  const category = await prisma.category.findUnique({
    where: { slug: categorySlug }
  });

  if (!category) {
    return [];
  }

  return prisma.post.findMany({
    where: { 
      categoryId: category.id,
      published: true 
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getRelatedPosts(currentPostId: string, categorySlug: string): Promise<Post[]> {
  const category = await prisma.category.findUnique({
    where: { slug: categorySlug }
  });

  if (!category) {
    return [];
  }

  return prisma.post.findMany({
    where: {
      categoryId: category.id,
      published: true,
      id: { not: currentPostId },
    },
    orderBy: { createdAt: 'desc' },
    take: 3,
  });
}

export async function searchPosts(tag: string): Promise<Post[]> {
  return prisma.post.findMany({
    where: {
      tags: { has: tag },
      published: true,
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function createPost(data: {
  title: string;
  content: string;
  excerpt: string;
  mainImage: string;
  images?: string[];
  categorySlug: string;
  tags: string[];
  authorName: string;
  authorEmail: string;
  metaTitle: string;
  metaDesc: string;
}) {
  const slug = data.title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-');

  const category = await prisma.category.findUnique({
    where: { slug: data.categorySlug }
  });

  return prisma.post.create({
    data: {
      title: data.title,
      content: data.content,
      excerpt: data.excerpt,
      mainImage: data.mainImage,
      images: data.images || [],
      categoryId: category?.id || null,
      tags: data.tags,
      authorName: data.authorName,
      authorEmail: data.authorEmail,
      metaTitle: data.metaTitle,
      metaDesc: data.metaDesc,
      slug,
      published: false,
    },
  });
}