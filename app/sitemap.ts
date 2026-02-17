import { MetadataRoute } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_API_URL || 'https://adi-phone.co.il';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static routes
  const staticRoutes = [
    '',
    '/about',
    '/services',
    '/portfolio',
    '/blog',
    '/contact',
    '/privacy-policy',
    '/accessibility-statement',
    '/services/ai',
    '/services/analytics',
    '/services/app-development',
    '/services/cloud',
    '/services/ecommerce',
    '/services/mobile-apps',
    '/services/organic-seo',
    '/services/paid-promotion',
    '/services/ppc',
    '/services/seo',
    '/services/software',
    '/services/software-development',
    '/services/ui-design',
    '/services/web-development',
    '/services/wordpress',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Blog posts - try to fetch from database, but don't fail if database is not available
  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    if (process.env.DATABASE_URL) {
      const { PrismaClient } = await import('@prisma/client');
      const prisma = new PrismaClient();
      
      const blogPosts = await prisma.post.findMany({
        where: { published: true },
        select: { slug: true, updatedAt: true }
      });

      blogRoutes = blogPosts.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: post.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }));

      await prisma.$disconnect();
    }
  } catch (error) {
    // If database is not available, just skip blog posts
    console.warn('Could not fetch blog posts for sitemap:', error);
  }

  return [...staticRoutes, ...blogRoutes];
} 