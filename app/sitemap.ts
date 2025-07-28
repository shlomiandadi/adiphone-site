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

  // Dynamic blog posts
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/posts`, {
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

    // Dynamic portfolio projects
    const portfolioResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/portfolio2`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    let portfolioRoutes: any[] = [];
    if (portfolioResponse.ok) {
      const portfolioData = await portfolioResponse.json();
      const projects = Array.isArray(portfolioData) ? portfolioData : [];
      portfolioRoutes = projects.map((project: any) => ({
        url: `${baseUrl}/portfolio/${project.slug}`,
        lastModified: project.date ? new Date(project.date) : new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      }));
    }

    return [...staticRoutes, ...blogRoutes, ...portfolioRoutes];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return staticRoutes;
  }
} 