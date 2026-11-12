import type { Metadata } from 'next';
import { mergeCmsMetadata } from '../lib/cms/seo';
import { absoluteUrl } from '../lib/seo';
import {
  SERVICE_OG_CACHE_VERSION,
  versionedServiceOgImagePath,
} from '../lib/og/service-og-image';
import { applySeoAgentOverride } from './override';
import { getSeoAgentPageOverride } from './state';

export { applySeoAgentOverride } from './override';

/**
 * Returns `base` unchanged when neither the SEO-agent store nor an explicitly
 * cmsEnabled row applies. Legacy `seo` / `canonical_tags` rows are ignored
 * until cmsEnabled is set in the admin — they must never overwrite live titles.
 */
function withVersionedServiceOgImage(path: string, meta: Metadata): Metadata {
  if (!path.startsWith('/services/')) return meta;

  const imagePath = versionedServiceOgImagePath(path);
  const imageUrl = absoluteUrl(imagePath);
  const title =
    (typeof meta.openGraph === 'object' &&
      meta.openGraph &&
      'title' in meta.openGraph &&
      typeof meta.openGraph.title === 'string' &&
      meta.openGraph.title) ||
    (typeof meta.title === 'string' ? meta.title : 'Top Webstak');

  const openGraph =
    meta.openGraph && typeof meta.openGraph === 'object' ? { ...meta.openGraph } : {};
  const twitter =
    meta.twitter && typeof meta.twitter === 'object' ? { ...meta.twitter } : {};
  const twitterCard: 'summary' | 'summary_large_image' | 'player' | 'app' =
    'card' in twitter &&
    (twitter.card === 'summary' ||
      twitter.card === 'summary_large_image' ||
      twitter.card === 'player' ||
      twitter.card === 'app')
      ? twitter.card
      : 'summary_large_image';

  const otherEntries =
    meta.other && typeof meta.other === 'object'
      ? Object.entries(meta.other).filter(
          (entry): entry is [string, string | number | (string | number)[]] => entry[1] !== undefined
        )
      : [];

  return {
    ...meta,
    openGraph: {
      ...openGraph,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      ...twitter,
      card: twitterCard,
      images: [imageUrl],
    },
    other: {
      ...Object.fromEntries(otherEntries),
      'og:image:secure_url': imageUrl,
      'og:image:cache_version': String(SERVICE_OG_CACHE_VERSION),
    },
  };
}

export async function mergeSeoAgentMetadata(path: string, base: Metadata): Promise<Metadata> {
  const withCms = await mergeCmsMetadata(path, base);
  const override = await getSeoAgentPageOverride(path);
  // Agent overrides win over CMS and hardcoded metadata. Title-only payloads
  // leave canonical and other omitted fields untouched.
  const merged = override ? applySeoAgentOverride(withCms, override) : withCms;
  return withVersionedServiceOgImage(path, merged);
}

export function createSeoAgentGenerateMetadata(path: string, base: Metadata) {
  return async function generateMetadata(): Promise<Metadata> {
    return mergeSeoAgentMetadata(path, base);
  };
}
