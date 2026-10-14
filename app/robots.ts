import { MetadataRoute } from 'next';
import { getValidatedRobots } from '../lib/cms/robots';
import { getSiteUrl } from '../lib/seo';

function defaultRobots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/'],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}

export default async function robots(): Promise<MetadataRoute.Robots> {
  const fromCms = await getValidatedRobots();
  return fromCms || defaultRobots();
}
