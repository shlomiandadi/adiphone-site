import type { Metadata } from 'next';
import { mergeCmsMetadata } from '../lib/cms/seo';
import { getSeoAgentPageOverride, hasPageOverride } from './store';
import type { SeoAgentPageOverride } from './types';

function withTitle(base: Metadata, title: string): Metadata['title'] {
  if (base.title && typeof base.title === 'object') {
    if ('absolute' in base.title && base.title.absolute) {
      return { absolute: title };
    }
    return { ...base.title, default: title };
  }
  return title;
}

export function applySeoAgentOverride(
  base: Metadata,
  override: SeoAgentPageOverride | null
): Metadata {
  if (!hasPageOverride(override) || !override) return base;

  const next: Metadata = { ...base };
  const title = override.title;

  if (title) {
    next.title = withTitle(base, title);
  }

  if (override.description) {
    next.description = override.description;
  }

  if (override.keywords) {
    next.keywords = override.keywords;
  }

  if (override.canonical) {
    next.alternates = {
      ...(base.alternates || {}),
      canonical: override.canonical,
    };
  }

  const ogTitle = override.ogTitle || title;
  const ogDescription = override.ogDescription || override.description;
  if (ogTitle || ogDescription || override.ogImage) {
    const baseOg = base.openGraph && typeof base.openGraph === 'object' ? base.openGraph : {};
    next.openGraph = {
      ...baseOg,
      ...(ogTitle ? { title: ogTitle } : {}),
      ...(ogDescription ? { description: ogDescription } : {}),
      ...(override.ogImage ? { images: [{ url: override.ogImage }] } : {}),
      ...(override.canonical ? { url: override.canonical } : {}),
    };
  }

  if (ogTitle || ogDescription || override.ogImage) {
    const baseTwitter = base.twitter && typeof base.twitter === 'object' ? base.twitter : {};
    next.twitter = {
      ...baseTwitter,
      ...(ogTitle ? { title: ogTitle } : {}),
      ...(ogDescription ? { description: ogDescription } : {}),
      ...(override.ogImage ? { images: [override.ogImage] } : {}),
    };
  }

  return next;
}

/**
 * Returns `base` unchanged when neither the SEO-agent store nor an explicitly
 * cmsEnabled row applies. Legacy `seo` / `canonical_tags` rows are ignored
 * until cmsEnabled is set in the admin — they must never overwrite live titles.
 */
export async function mergeSeoAgentMetadata(path: string, base: Metadata): Promise<Metadata> {
  const override = await getSeoAgentPageOverride(path);
  const withAgent = override ? applySeoAgentOverride(base, override) : base;
  return mergeCmsMetadata(path, withAgent);
}

export function createSeoAgentGenerateMetadata(path: string, base: Metadata) {
  return async function generateMetadata(): Promise<Metadata> {
    return mergeSeoAgentMetadata(path, base);
  };
}
