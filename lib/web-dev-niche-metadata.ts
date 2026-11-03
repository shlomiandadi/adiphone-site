import type { Metadata } from 'next';
import { absoluteUrl } from './seo';
import type { WebDevNicheContent } from './web-dev-niches';

export function buildNicheMetadata(content: WebDevNicheContent): Metadata {
  const canonical = absoluteUrl(content.path);
  return {
    title: { absolute: content.metaTitle },
    description: content.metaDescription,
    alternates: {
      canonical,
    },
    openGraph: {
      title: content.metaTitle,
      description: content.metaDescription,
      url: canonical,
      type: 'website',
      locale: 'he_IL',
      siteName: 'Top Webstak',
    },
    twitter: {
      card: 'summary_large_image',
      title: content.metaTitle,
      description: content.metaDescription,
    },
  };
}

export const nicheViewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#03173A',
};
