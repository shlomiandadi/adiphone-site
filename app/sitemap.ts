import { MetadataRoute } from 'next';
import { getSiteUrl } from '../lib/seo';

/** Indexable static routes only (no noindex pages, no duplicate/redirect stubs). */
const STATIC_ROUTES = [
  '',
  '/about',
  '/services',
  '/portfolio',
  '/blog',
  '/contact',
  '/pricing',
  '/privacy-policy',
  '/services/ai',
  '/services/analytics',
  '/services/cloud',
  '/services/ecommerce',
  '/services/mobile-apps',
  '/services/ppc',
  '/services/seo',
  '/services/software-development',
  '/services/ui-design',
  '/services/web-development',
  '/services/wordpress',
  '/services/bniyat-atarim-pardes-hana',
] as const;

/** Slugs that 301 elsewhere — must not appear in sitemap. */
const REDIRECTED_BLOG_SLUGS = new Set([
  'nyhvl-kmpyynym-mmvmnym',
  'bnyyt-atrym-prds-chnh',
  'bnyyt-atry-ayntrnt-bprds-chnh',
]);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();

  const staticRoutes = STATIC_ROUTES.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  let blogRoutes: MetadataRoute.Sitemap = [];
  let portfolioRoutes: MetadataRoute.Sitemap = [];
  try {
    if (process.env.DATABASE_URL) {
      const { PrismaClient } = await import('@prisma/client');
      const prisma = new PrismaClient();

      const blogPosts = await prisma.post.findMany({
        where: { published: true },
        select: { slug: true, updatedAt: true, canonicalUrl: true },
      });

      blogRoutes = blogPosts
        .filter((post) => !REDIRECTED_BLOG_SLUGS.has(post.slug))
        .filter((post) => {
          // Skip posts whose stored canonical points to a different path (non-self)
          if (!post.canonicalUrl) return true;
          try {
            const canonical = new URL(
              post.canonicalUrl.replace(/^http:\/\//i, 'https://'),
              baseUrl
            );
            const selfPath = `/blog/${post.slug}`;
            return canonical.pathname.replace(/\/$/, '') === selfPath;
          } catch {
            return true;
          }
        })
        .map((post) => ({
          url: `${baseUrl}/blog/${post.slug}`,
          lastModified: post.updatedAt,
          changeFrequency: 'weekly' as const,
          priority: 0.7,
        }));

      const projects = await prisma.portfolioProject2.findMany({
        where: { published: true },
        select: { slug: true, updatedAt: true },
      });

      portfolioRoutes = projects.map((project) => ({
        url: `${baseUrl}/portfolio/${project.slug}`,
        lastModified: project.updatedAt,
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      }));

      await prisma.$disconnect();
    }
  } catch (error) {
    console.warn('Could not fetch dynamic routes for sitemap:', error);
  }

  return [...staticRoutes, ...blogRoutes, ...portfolioRoutes];
}
