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
 * Live /services/web-development once stored a description that attached
 * 2,500 ₪ to אתר תדמית. Site pricing (and this page body) uses 2,500 ₪ for a
 * landing page and 6,500 ₪ for a brochure site. Drop title/description fields
 * from that override so hardcoded metadata can render the correct claim.
 */
export function isMisleadingWebDevPricingOverride(
  path: string,
  override: SeoAgentPageOverride | null | undefined
): boolean {
  if (path !== '/services/web-development' || !override) return false;
  const texts = [override.description, override.ogDescription, override.title, override.ogTitle];
  return texts.some((text) => {
    if (!text) return false;
    const has2500 = /2,500/.test(text);
    const hasTadmit = /תדמית/.test(text);
    const has6500 = /6,500/.test(text);
    const hasLanding = /דף נחיתה/.test(text);
    return has2500 && hasTadmit && !has6500 && !hasLanding;
  });
}

export function sanitizeSeoAgentOverride(
  path: string,
  override: SeoAgentPageOverride | null
): SeoAgentPageOverride | null {
  if (!override || !isMisleadingWebDevPricingOverride(path, override)) return override;
  const next: SeoAgentPageOverride = { ...override };
  delete next.title;
  delete next.description;
  delete next.ogTitle;
  delete next.ogDescription;
  return hasPageOverride(next) ? next : null;
}

export function hasAccurateWebDevPricingCopy(text: unknown): boolean {
  return (
    typeof text === 'string' &&
    /דף נחיתה/.test(text) &&
    /2,500/.test(text) &&
    /תדמית/.test(text) &&
    /6,500/.test(text)
  );
}

/**
 * CMS (`seo` with cmsEnabled) can restore an older title/description after a
 * bad SEO-agent price line is stripped. Keep the page's hardcoded copy unless
 * the merged description already states both /pricing packages.
 */
export function preferAccurateWebDevCopy(path: string, base: Metadata, merged: Metadata): Metadata {
  if (path !== '/services/web-development') return merged;
  if (hasAccurateWebDevPricingCopy(merged.description)) return merged;

  const baseOg = base.openGraph && typeof base.openGraph === 'object' ? base.openGraph : {};
  const mergedOg = merged.openGraph && typeof merged.openGraph === 'object' ? merged.openGraph : {};
  const baseTwitter = base.twitter && typeof base.twitter === 'object' ? base.twitter : {};
  const mergedTwitter = merged.twitter && typeof merged.twitter === 'object' ? merged.twitter : {};
  const ogTitle = 'title' in baseOg && baseOg.title ? baseOg.title : undefined;
  const ogDescription =
    'description' in baseOg && baseOg.description ? baseOg.description : base.description;
  const twitterTitle = 'title' in baseTwitter && baseTwitter.title ? baseTwitter.title : ogTitle;
  const twitterDescription =
    'description' in baseTwitter && baseTwitter.description ? baseTwitter.description : ogDescription;

  return {
    ...merged,
    title: base.title,
    description: base.description,
    openGraph: {
      ...mergedOg,
      ...baseOg,
      ...(ogTitle ? { title: ogTitle } : {}),
      ...(ogDescription ? { description: ogDescription } : {}),
    },
    twitter: {
      ...mergedTwitter,
      ...baseTwitter,
      ...(twitterTitle ? { title: twitterTitle } : {}),
      ...(twitterDescription ? { description: twitterDescription } : {}),
    },
  };
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
