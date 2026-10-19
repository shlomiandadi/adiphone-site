import type { Metadata } from 'next';
import { applyCmsTitle } from '../lib/cms/seoMerge.ts';
import type { SeoAgentPageOverride } from './types';

export function hasPageOverride(override: SeoAgentPageOverride | null | undefined): boolean {
  if (!override) return false;
  return Boolean(
    override.title ||
      override.description ||
      override.canonical ||
      override.keywords ||
      override.ogTitle ||
      override.ogDescription ||
      override.ogImage ||
      override.schemaMarkup ||
      (override.faq && override.faq.length > 0)
  );
}

/**
 * Root layout title.template is `%s | Top Webstak`.
 * Service pages under `/services` also sit under a parent title that is `{ absolute }`,
 * which clears that template. `applyCmsTitle` covers both:
 * templated pages strip one trailing suffix so the template adds it once;
 * pages whose own title is already a full document title keep the stored string
 * as `{ absolute }` so `| Top Webstak` is not appended again.
 */
export function applySeoAgentOverride(
  base: Metadata,
  override: SeoAgentPageOverride | null
): Metadata {
  if (!hasPageOverride(override) || !override) return base;

  const next: Metadata = { ...base };
  const title = override.title?.trim();

  if (title) {
    next.title = applyCmsTitle(base, title);
  }

  if (override.description?.trim()) {
    next.description = override.description.trim();
  }

  if (override.keywords?.trim()) {
    next.keywords = override.keywords.trim();
  }

  if (override.canonical?.trim()) {
    next.alternates = {
      ...(base.alternates || {}),
      canonical: override.canonical.trim(),
    };
  }

  const ogTitle = override.ogTitle?.trim() || title;
  const ogDescription = override.ogDescription?.trim() || override.description?.trim();
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
