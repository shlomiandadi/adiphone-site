import { MetadataRoute } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://adi-phone.co.il';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static routes
  const staticRoutes = [
    '',
    '/about',
    '/services',
    '/portfolio',
    '/blog',
    '/contact',
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

  // Dynamic blog posts
  try {
    const response = await fetch(`${baseUrl}/api/posts`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch blog posts');
    }

    const data = await response.json();
    const posts = Array.isArray(data.posts) ? data.posts : [];
    const blogRoutes = posts.map((post: any) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));

    return [...staticRoutes, ...blogRoutes];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return staticRoutes;
  }
} 