import { MetadataRoute } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://adi-phone.co.il';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static routes only
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

  return staticRoutes;
} 