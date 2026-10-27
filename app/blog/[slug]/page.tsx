import React from 'react';
import Image from 'next/image';
import ReactDOM from 'react-dom';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import BlogPostSchema from '../../components/BlogPostSchema';
import BlogNavigation from '../../components/BlogNavigation';
import RelatedServiceCTA from '../../components/RelatedServiceCTA';
import RelatedArticleLinks from '../../components/RelatedArticleLinks';
import { BLOG_META_OVERRIDES, getSiteUrl, normalizeCanonicalUrl } from '../../../lib/seo';
import { cleanupBlogHtml } from '../../../lib/blog-content-cleanup';
import { getPostBySlug, getPublishedNavPosts, getPublishedPosts } from '../../../lib/posts';
import { adjacentBlogPosts } from '../../../lib/blogNav';
import { mergeSeoAgentMetadata, SeoAgentPageExtras } from '@/seo-agent-apply';
import {
  isOptimizableImageUrl,
  isSeoAgentImage,
  optimizeContentImages,
  responsiveAttributes,
  SEO_AGENT_IMAGE_ORIGIN,
  type ResponsiveImageAttrs,
} from '../../../lib/responsiveImage';

/** Enable ISR: pages are cached and periodically regenerated instead of SSR per request. */
export const revalidate = 300;

/** Pre-render published posts at build (when the DB is reachable); others render on demand. */
export async function generateStaticParams() {
  if (!process.env.DATABASE_URL) return [];
  try {
    const posts = await getPublishedPosts();
    return posts.map((post) => ({ slug: post.slug }));
  } catch (error) {
    console.error('generateStaticParams (blog) failed:', error);
    return [];
  }
}

/**
 * The page template already renders the single <h1> (post.title). Some DB-stored
 * post bodies contain an additional <h1>, producing two H1s per page. Demote any
 * in-content <h1> to <h2> so each post has exactly one H1.
 */
function demoteContentHeadings(html: string): string {
  if (!html) return html;
  return html
    .replace(/<h1(\s[^>]*)?>/gi, '<h2$1>')
    .replace(/<\/h1>/gi, '</h2>');
}

const HERO_SIZES = '100vw';

/**
 * AVIF q=50 held the same crop as the original on the cloud and SEO heroes
 * (edges and the small labels stayed intact), so this stays at 50 rather than 60.
 */
const SEO_AGENT_HERO_AVIF_QUALITY = 50;
const SEO_AGENT_HERO_WIDTHS = [640, 828, 1080, 1200];

/** Hero is full-bleed. Eager + high priority, and no fake srcset for hosts we cannot resize. */
function blogHeroImage(src: string): ResponsiveImageAttrs {
  if (!isOptimizableImageUrl(src)) {
    return {
      src,
      loading: 'eager',
      fetchPriority: 'high',
      // auto, not async: async defers decode and holds the hero out of the first paint.
      decoding: 'auto',
    };
  }
  return responsiveAttributes(src, {
    sizes: HERO_SIZES,
    widths: [640, 750, 828, 1080, 1200, 1600],
    priority: true,
  });
}

function seoAgentHeroPicture(src: string) {
  const shared = {
    sizes: HERO_SIZES,
    widths: SEO_AGENT_HERO_WIDTHS,
    priority: true as const,
  };
  return {
    avif: responsiveAttributes(src, { ...shared, quality: SEO_AGENT_HERO_AVIF_QUALITY, format: 'avif' }),
    webp: responsiveAttributes(src, { ...shared, quality: 75, format: 'webp' }),
  };
}

function preconnectSeoAgent() {
  const preconnect = (ReactDOM as unknown as {
    preconnect?: (
      href: string,
      options?: { crossOrigin?: '' | 'anonymous' | 'use-credentials' }
    ) => void;
  }).preconnect;
  if (typeof preconnect !== 'function') return;
  // <img> is no-cors, so this is the connection the hero actually reuses.
  preconnect(SEO_AGENT_IMAGE_ORIGIN);
  preconnect(SEO_AGENT_IMAGE_ORIGIN, { crossOrigin: 'anonymous' });
}

function preloadHero(image: ResponsiveImageAttrs, type?: string) {
  const preload = (ReactDOM as unknown as {
    preload?: (
      href: string,
      options: {
        as: 'image';
        fetchPriority?: 'high';
        imageSrcSet?: string;
        imageSizes?: string;
        type?: string;
      }
    ) => void;
  }).preload;
  if (typeof preload !== 'function') return;
  preload(image.src, {
    as: 'image',
    fetchPriority: 'high',
    imageSrcSet: image.srcSet,
    imageSizes: image.sizes,
    type,
  });
}

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  mainImage: string;
  category: string;
  createdAt: string;
  tags: string[];
  slug: string;
  published: boolean;
  authorName: string;
  authorEmail: string;
  views: number;
  likes: number;
  metaTitle: string;
  metaDesc: string;
  updatedAt: string;
  articleStyles?: string | null;
  schemaMarkup?: string | null;
  canonicalUrl?: string | null;
  ogImage?: string | null;
  robots?: string | null;
  categoryColor?: string | null;
}

async function getBlogPost(slug: string) {
  try {
    const post = await getPostBySlug(slug);
    if (!post || !post.published) {
      return null;
    }
    const categoryName = typeof post.category === 'string'
      ? post.category
      : post.category?.name || '';
    const categoryColor = typeof post.category === 'object' && post.category
      ? post.category.color
      : null;
    const tagNames = [
      ...(Array.isArray(post.tags) ? post.tags : []),
      ...((post as any).postTags || []).map((item: { tag?: { name?: string } }) => item.tag?.name).filter(Boolean),
    ];
    return {
      ...post,
      category: categoryName,
      categoryColor,
      tags: Array.from(new Set(tagNames)),
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
    } as any;
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getBlogPost(params.slug);
  
  if (!post) {
    return {
      title: 'פוסט לא נמצא | Top Webstak',
      description: 'הפוסט שחיפשת לא נמצא',
    };
  }

  const siteUrl = getSiteUrl();
  const override = BLOG_META_OVERRIDES[post.slug];
  const title = override?.metaTitle || post.metaTitle || post.title;
  const description = override?.metaDesc || post.metaDesc || post.excerpt;
  const canonical = normalizeCanonicalUrl(
    post.canonicalUrl,
    `${siteUrl}/blog/${post.slug}`
  );

  const ogImage = post.ogImage || post.mainImage;
  return mergeSeoAgentMetadata(`/blog/${post.slug}`, {
    title,
    description,
    keywords: post.tags?.join(', '),
    authors: [{ name: post.authorName }],
    robots: post.robots || undefined,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      type: 'article',
      url: canonical,
      publishedTime: post.createdAt,
      modifiedTime: post.updatedAt,
      authors: [post.authorName],
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  });
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await getBlogPost(params.slug);

  if (!post) {
    notFound();
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('he-IL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const picture = post.mainImage && isSeoAgentImage(post.mainImage)
    ? seoAgentHeroPicture(post.mainImage)
    : null;
  const heroImage = !picture && post.mainImage ? blogHeroImage(post.mainImage) : null;
  if (picture) {
    preconnectSeoAgent();
    preloadHero(picture.avif, 'image/avif');
  } else if (heroImage) {
    preloadHero(heroImage);
  }
  const { previousPost, nextPost } = adjacentBlogPosts(await getPublishedNavPosts(), post.slug);

  return (
    <main className="pt-24">
      <SeoAgentPageExtras path={`/blog/${post.slug}`} />
      <BlogPostSchema post={post} />
      {post.articleStyles && (
        <style dangerouslySetInnerHTML={{ __html: post.articleStyles }} />
      )}
      {/* Hero Section */}
      <section className="relative h-[500px] flex items-center justify-center text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          {picture ? (
            <>
              <link rel="preconnect" href={SEO_AGENT_IMAGE_ORIGIN} />
              <link rel="preconnect" href={SEO_AGENT_IMAGE_ORIGIN} crossOrigin="anonymous" />
              <link
                rel="preload"
                as="image"
                type="image/avif"
                href={picture.avif.srcSet ? undefined : picture.avif.src}
                imageSrcSet={picture.avif.srcSet}
                imageSizes={picture.avif.sizes}
                fetchPriority="high"
              />
              <picture className="absolute inset-0">
                <source type="image/avif" srcSet={picture.avif.srcSet} sizes={picture.avif.sizes} />
                <img
                  alt={post.title}
                  className="absolute inset-0 h-full w-full object-cover"
                  src={picture.webp.src}
                  srcSet={picture.webp.srcSet}
                  sizes={picture.webp.sizes}
                  loading={picture.webp.loading}
                  fetchPriority={picture.webp.fetchPriority}
                  decoding={picture.webp.decoding}
                />
              </picture>
            </>
          ) : heroImage ? (
            <>
              <link
                rel="preload"
                as="image"
                href={heroImage.srcSet ? undefined : heroImage.src}
                imageSrcSet={heroImage.srcSet}
                imageSizes={heroImage.sizes}
                fetchPriority="high"
              />
              <img
                alt={post.title}
                className="absolute inset-0 h-full w-full object-cover"
                {...heroImage}
              />
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-600 to-purple-700" />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-blue-600/80" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <span
              className="inline-block bg-blue-500 text-white px-4 py-2 rounded-full text-sm mb-4"
              style={post.categoryColor ? { backgroundColor: post.categoryColor } : undefined}
            >
              {post.category}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {BLOG_META_OVERRIDES[post.slug]?.metaTitle || post.title}
            </h1>
            <div className="flex items-center justify-center space-x-4">
              <span>{formatDate(post.createdAt)}</span>
              <span>•</span>
              <span>{Math.ceil(post.content.length / 1000)} דקות קריאה</span>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Main Image Display */}
            {post.mainImage && (
              <div className="mb-8">
                <Image
                  src={post.mainImage}
                  alt={post.title}
                  width={800}
                  height={400}
                  sizes="(max-width: 768px) 100vw, 768px"
                  className="w-full h-auto rounded-lg shadow-lg"
                  loading="lazy"
                  fetchPriority="low"
                  unoptimized={!isOptimizableImageUrl(post.mainImage)}
                />
              </div>
            )}
            <div 
              className="prose prose-lg dark:prose-invert max-w-none prose-img:max-w-full prose-img:h-auto prose-img:rounded-lg prose-img:shadow-lg prose-img:my-6 prose-img:mx-auto"
              dangerouslySetInnerHTML={{
                __html: optimizeContentImages(
                  demoteContentHeadings(cleanupBlogHtml(post.content, post.slug))
                ),
              }}
            />
            <RelatedArticleLinks slug={post.slug} category={post.category} />
            <RelatedServiceCTA slug={post.slug} />
          </div>
        </div>
      </section>

      {/* Blog Navigation */}
      <BlogNavigation previousPost={previousPost} nextPost={nextPost} />
    </main>
  );
} 
