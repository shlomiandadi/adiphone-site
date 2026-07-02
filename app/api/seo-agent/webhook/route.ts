import { createHmac, timingSafeEqual } from 'crypto';
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

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
};

function verifySignature(rawBody: string, signature: string, secret: string): boolean {
  if (!signature || !secret) return false;

  const normalizedSignature = signature.replace(/^sha256=/i, '').trim();
  const expected = createHmac('sha256', secret).update(rawBody, 'utf8').digest('hex');

  try {
    return timingSafeEqual(Buffer.from(normalizedSignature, 'hex'), Buffer.from(expected, 'hex'));
  } catch {
    return false;
  }
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function getSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || 'https://adi-phone.co.il').replace(/\/$/, '');
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
    canonicalUrl: article.canonical?.trim() || `${getSiteUrl()}/blog/${slug}`,
    published,
    authorName: 'SEO Agent',
    authorEmail: 'seo-agent@adi-phone.co.il',
    categoryId,
  };

  const post = await prisma.post.upsert({
    where: { slug },
    update: postData,
    create: postData,
  });

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

    if (!verifySignature(rawBody, signature, secret)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    let article: SeoAgentArticle;
    try {
      article = JSON.parse(rawBody) as SeoAgentArticle;
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const post = await saveArticle(article);
    const url = `${getSiteUrl()}/blog/${post.slug}`;

    return NextResponse.json({
      success: true,
      url,
      id: article.id || post.id,
      postId: post.id,
    });
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
  return NextResponse.json({
    ok: true,
    message: 'SEO Agent webhook is live. Send POST with X-SEO-Agent-Signature (HMAC-SHA256).',
    urlPattern: `${getSiteUrl()}/blog/{slug}`,
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
    ],
  });
}
