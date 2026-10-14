import type { Metadata } from 'next';

const DEFAULT_ROBOTS = 'index, follow';

/** Root layout title.template is `%s | Top Webstak`. */
export const TITLE_TEMPLATE_SUFFIX = ' | Top Webstak';

export function nonEmpty(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

export function normalizeRobots(value: Metadata['robots'] | string | null | undefined): string | null {
  if (value == null || value === '') return null;
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase().replace(/\s+/g, ' ');
    return normalized || null;
  }
  if (typeof value === 'object') {
    const index = value.index === false ? 'noindex' : 'index';
    const follow = value.follow === false ? 'nofollow' : 'follow';
    return `${index}, ${follow}`;
  }
  return null;
}

export function isImplicitDefaultRobots(normalized: string | null): boolean {
  return !normalized || normalized === DEFAULT_ROBOTS || normalized === 'index,follow';
}

/** Emit robots only when the row set an explicit value that differs from the page default. */
export function shouldApplyRobots(
  rowRobots: string | null | undefined,
  base: Metadata
): boolean {
  const row = normalizeRobots(rowRobots);
  if (!row) return false;
  const baseNorm = normalizeRobots(base.robots);
  if (baseNorm === row) return false;
  if (!baseNorm && isImplicitDefaultRobots(row)) return false;
  return true;
}

export function metadataTitle(meta: Metadata | null | undefined): string {
  const title = meta?.title;
  if (typeof title === 'string') return title;
  if (title && typeof title === 'object') {
    if ('absolute' in title && title.absolute) return String(title.absolute);
    if ('default' in title && title.default) return String(title.default);
  }
  return '';
}

export function metadataKeywords(meta: Metadata | null | undefined): string {
  const value = meta?.keywords;
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return value.join(', ');
  return '';
}

export function withTitle(base: Metadata, title: string): Metadata['title'] {
  if (base.title && typeof base.title === 'object') {
    if ('absolute' in base.title && base.title.absolute) {
      return { absolute: title };
    }
    return { ...base.title, default: title };
  }
  return title;
}

export function stripTitleTemplateSuffix(title: string): string {
  let next = title.trimEnd();
  while (next.endsWith(TITLE_TEMPLATE_SUFFIX) && next.length > TITLE_TEMPLATE_SUFFIX.length) {
    next = next.slice(0, -TITLE_TEMPLATE_SUFFIX.length).trimEnd();
  }
  return next;
}

/**
 * True only when the root `%s | Top Webstak` template will append the suffix.
 * `{ absolute }` titles and string titles that already include ` | Top Webstak`
 * are complete document titles — do not strip or re-template them.
 */
export function usesTitleTemplate(base: Metadata): boolean {
  const title = base.title;
  if (title && typeof title === 'object' && 'absolute' in title && title.absolute) {
    return false;
  }
  if (typeof title === 'string' && title.includes(TITLE_TEMPLATE_SUFFIX)) {
    return false;
  }
  return true;
}

/**
 * Apply a CMS title so either stored form renders once.
 * Templated pages: strip a trailing ` | Top Webstak` so the root template adds it once.
 * Absolute pages: apply the CMS title exactly as stored (`{ absolute }`).
 */
export function applyCmsTitle(base: Metadata, cmsTitle: string): Metadata['title'] {
  if (!usesTitleTemplate(base)) {
    return { absolute: cmsTitle };
  }
  return withTitle(base, stripTitleTemplateSuffix(cmsTitle));
}

export function exactPathKeys(path: string): string[] {
  const normalized = path === '/' ? '/' : path.replace(/\/+$/, '') || '/';
  if (normalized === '/') return ['/', 'home'];
  return [normalized, normalized.replace(/^\//, '')];
}

export function rowMatchesExactPath(rowPage: string | null | undefined, path: string): boolean {
  if (!rowPage) return false;
  return exactPathKeys(path).includes(rowPage);
}

function patchRecord(patch: Record<string, unknown>) {
  const next: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(patch)) {
    if (value == null) continue;
    if (typeof value === 'string' && !value.trim()) continue;
    next[key] = value;
  }
  return next;
}

function firstOgImageUrl(images: unknown): string | null {
  if (images == null) return null;
  const first = Array.isArray(images) ? images[0] : images;
  if (first == null) return null;
  if (typeof first === 'string') return first;
  if (typeof first === 'object' && 'url' in first) {
    const url = (first as { url: unknown }).url;
    if (typeof url === 'string') return url;
    if (url != null) return String(url);
  }
  return null;
}

/**
 * Patch the page's own openGraph only. Never inject layout locale/site_name/type/url,
 * and keep existing image alt/width/height when the CMS image URL is unchanged.
 */
export function mergeOpenGraph(
  base: Metadata,
  patch: { title?: string | null; description?: string | null; image?: string | null; url?: string | null }
): Metadata['openGraph'] | undefined {
  const baseOg =
    base.openGraph && typeof base.openGraph === 'object' ? { ...base.openGraph } : {};

  const next: Record<string, unknown> = { ...baseOg };
  let changed = false;

  if (nonEmpty(patch.title)) {
    next.title = patch.title;
    changed = true;
  }
  if (nonEmpty(patch.description)) {
    next.description = patch.description;
    changed = true;
  }
  if (nonEmpty(patch.image)) {
    const currentUrl = firstOgImageUrl('images' in baseOg ? baseOg.images : undefined);
    if (currentUrl !== patch.image) {
      next.images = [{ url: patch.image }];
      changed = true;
    }
  }
  // Only update url when the page already rendered one — never add it.
  if (nonEmpty(patch.url) && 'url' in baseOg && baseOg.url != null) {
    next.url = patch.url;
    changed = true;
  }

  if (!changed) return undefined;
  return next as Metadata['openGraph'];
}

export function mergeTwitter(
  base: Metadata,
  patch: { title?: string | null; description?: string | null; image?: string | null }
): Metadata['twitter'] | undefined {
  const extra = patchRecord({
    title: patch.title,
    description: patch.description,
    ...(nonEmpty(patch.image) ? { images: [patch.image] } : {}),
  });
  if (Object.keys(extra).length === 0) return undefined;
  const baseTwitter = typeof base.twitter === 'object' && base.twitter ? base.twitter : {};
  return {
    ...baseTwitter,
    ...extra,
  };
}
