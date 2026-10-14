import type { Metadata } from 'next';

const DEFAULT_ROBOTS = 'index, follow';

export const LAYOUT_OG_DEFAULTS = {
  type: 'website' as const,
  locale: 'he_IL',
  siteName: 'Top Webstak',
};

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

export function mergeOpenGraph(
  base: Metadata,
  patch: { title?: string | null; description?: string | null; image?: string | null; url?: string | null }
): Metadata['openGraph'] | undefined {
  const extra = patchRecord({
    title: patch.title,
    description: patch.description,
    url: patch.url,
    ...(nonEmpty(patch.image) ? { images: [{ url: patch.image }] } : {}),
  });
  if (Object.keys(extra).length === 0) return undefined;
  const baseOg = typeof base.openGraph === 'object' && base.openGraph ? base.openGraph : {};
  return {
    ...LAYOUT_OG_DEFAULTS,
    ...baseOg,
    ...extra,
  };
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
