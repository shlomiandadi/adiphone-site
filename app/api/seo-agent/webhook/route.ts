import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { revalidateBlogPaths } from '../../../../lib/revalidateContent';
import { syncPostTags } from '../../../../lib/postTags';
import { getSiteUrl, normalizeCanonicalUrl } from '../../../../lib/seo';
import {
  applySeoAgentPayload,
  isSeoAgentApplyPayload,
  isSeoAgentArticlePayload,
  probeSeoAgentBlobs,
  revalidateSeoAgentPaths,
  syncSeoAgentStore,
  verifySeoAgentSignature,
} from '../../../../seo-agent-apply';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

type WebhookImage = {
  url?: string;
  alt?: string;
  caption?: string;
  base64?: string;
};

type SeoAgentArticle = {
  id?: string;
  title?: string;
  slug?: string;
  content?: string;
  contentHtml?: string;
  articleStyles?: string;
  status?: 'draft' | 'publish';
  seoTitle?: string;
  metaDescription?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonical?: string;
  schemaMarkup?: string;
  categories?: string[];
  tags?: string[];
  primaryCategory?: string;
  images?: WebhookImage[];
  publishedAt?: string;
  renderMode?: 'full';
  authorName?: string;
  byline?: string;
};

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function toSlug(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\u0590-\u05FFa-z0-9\s-]/g, '')
    .replace(/\s+/g, '-');
}

function resolveImageSource(image: WebhookImage): string | null {
  if (image.url?.trim()) return image.url.trim();

  const base64 = image.base64?.trim();
  if (!base64) return null;
  if (base64.startsWith('data:')) return base64;

  return `data:image/jpeg;base64,${base64}`;
}

function collectImages(article: SeoAgentArticle): string[] {
  const urls = (article.images || [])
    .map(resolveImageSource)
    .filter((url): url is string => Boolean(url));

  return Array.from(new Set(urls));
}

function getArticleContent(article: SeoAgentArticle): string {
  return (article.contentHtml || article.content || '').trim();
}

function resolveAuthorName(article: SeoAgentArticle): string {
  const fromName = article.authorName?.trim();
  if (fromName) return fromName;

  const byline = article.byline?.trim();
  if (byline) {
    return byline.replace(/^מאת\s+/i, '').trim() || byline;
  }

  return 'Top Webstak';
}

async function getDefaultCategoryId(): Promise<string | null> {
  const category = await prisma.category.findFirst({
    where: { slug: 'seo' },
    select: { id: true },
  });
  return category?.id ?? null;
}

async function resolveCategoryId(article: SeoAgentArticle): Promise<string | null> {
  const categoryName = article.primaryCategory?.trim() || article.categories?.[0]?.trim();
  if (!categoryName) return getDefaultCategoryId();

  const slug = toSlug(categoryName);
  const existing = await prisma.category.findFirst({
    where: {
      OR: [{ slug }, { name: categoryName }],
    },
    select: { id: true },
  });

  if (existing) return existing.id;

  const created = await prisma.category.create({
    data: {
      name: categoryName,
      slug: slug || toSlug('general'),
    },
    select: { id: true },
  });

  return created.id;
}

async function saveArticle(article: SeoAgentArticle) {
  const title = article.title?.trim();
  const slug = article.slug?.trim();
  const content = getArticleContent(article);

  if (!title || !slug || !content) {
    throw new Error('Invalid payload: title, slug, and contentHtml are required');
  }

  const imageUrls = collectImages(article);
  const mainImage = article.ogImage?.trim() || imageUrls[0] || '';
  const excerpt = article.metaDescription?.trim() || stripHtml(content).slice(0, 300);
  const published = article.status === 'publish';
  const categoryId = await resolveCategoryId(article);
  const tags = Array.isArray(article.tags)
    ? article.tags.map((tag) => tag.trim()).filter(Boolean)
    : [];

  const postData = {
    title,
    slug,
    content,
    excerpt,
    mainImage,
    images: imageUrls,
    tags,
    metaTitle: article.seoTitle?.trim() || title,
    metaDesc: article.metaDescription?.trim() || excerpt,
    articleStyles: article.articleStyles?.trim() || null,
    schemaMarkup: article.schemaMarkup?.trim() || null,
    canonicalUrl: normalizeCanonicalUrl(
      article.canonical?.trim(),
      `${getSiteUrl()}/blog/${slug}`
    ),
    ogImage: article.ogImage?.trim() || null,
    published,
    authorName: resolveAuthorName(article),
    authorEmail: 'info@adi-phone.co.il',
    categoryId,
  };

  const post = await prisma.post.upsert({
    where: { slug },
    update: postData,
    create: postData,
  });

  await syncPostTags(prisma, post.id, tags);
  return post;
}

export async function POST(request: NextRequest) {
  const secret = process.env.SEO_AGENT_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: 'Server misconfiguration: missing SEO_AGENT_WEBHOOK_SECRET' },
      { status: 500 }
    );
  }

  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-seo-agent-signature') || '';

    if (!verifySeoAgentSignature(rawBody, signature, secret)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    let payload: unknown;
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    if (isSeoAgentArticlePayload(payload)) {
      const article = payload as SeoAgentArticle;
      const post = await saveArticle(article);
      const url = `${getSiteUrl()}/blog/${post.slug}`;
      const category = post.categoryId
        ? await prisma.category.findUnique({ where: { id: post.categoryId }, select: { slug: true } })
        : null;
      revalidateBlogPaths(post.slug, null, {
        categorySlugs: [category?.slug],
        tags: Array.isArray(article.tags) ? article.tags : [],
      });

      return NextResponse.json({
        success: true,
        url,
        id: article.id || post.id,
        postId: post.id,
      });
    }

    if (isSeoAgentApplyPayload(payload)) {
      const result = await applySeoAgentPayload(payload);
      return NextResponse.json(result);
    }

    return NextResponse.json(
      { error: 'Unrecognized payload. Send an apply override or an article (title, slug, contentHtml).' },
      { status: 400 }
    );
  } catch (error) {
    console.error('SEO Agent webhook error:', error);
    const message = error instanceof Error ? error.message : 'Failed to process webhook';
    const status = message.startsWith('Invalid payload') ? 400 : 500;
    return NextResponse.json({ error: message }, { status });
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET() {
  const blobs = await probeSeoAgentBlobs();
  let storage: { provider: 'neon'; imported: boolean; paths: number; error?: string } = {
    provider: 'neon',
    imported: false,
    paths: 0,
  };
  try {
    const synced = await syncSeoAgentStore();
    storage = { provider: 'neon', imported: synced.imported, paths: synced.paths.length };
    if (synced.imported) revalidateSeoAgentPaths(synced.paths);
  } catch (error) {
    console.error('SEO Agent store sync failed:', error);
    storage = { provider: 'neon', imported: false, paths: 0, error: 'Neon store unavailable' };
  }
  return NextResponse.json({
    ok: true,
    message: 'SEO Agent webhook is live. Send POST with X-SEO-Agent-Signature (HMAC-SHA256).',
    urlPattern: `${getSiteUrl()}/blog/{slug}`,
    apply: 'Title/meta/FAQ/schema overrides, redirects, llms.txt (Neon Postgres)',
    storage,
    blobs,
    signatureHeader: 'X-SEO-Agent-Signature',
    signatureAlgorithm: 'HMAC-SHA256',
    envVar: 'SEO_AGENT_WEBHOOK_SECRET',
    payloadFields: [
      'contentHtml',
      'articleStyles',
      'schemaMarkup',
      'categories',
      'tags',
      'primaryCategory',
      'images[].base64',
      'overrides',
      'redirects',
      'llmsTxt',
    ],
  });
}
