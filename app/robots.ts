import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/'],
    },
    sitemap: `${process.env.NEXT_PUBLIC_API_URL || 'https://adi-phone.co.il'}/sitemap.xml`,
  };
} 