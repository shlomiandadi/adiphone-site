const TAG_PREFIX = '/blog/tag/';

export function decodeTagParam(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

/** Canonical tag slug: spaces (any whitespace run) become a single hyphen. */
export function hyphenatedTagSlug(value: string): string {
  return decodeTagParam(value).trim().replace(/\s+/g, '-');
}

export function blogTagCanonicalPath(value: string): string {
  return `${TAG_PREFIX}${hyphenatedTagSlug(value)}`;
}

export function isBlogTagPath(pathname: string): boolean {
  const path = pathname.replace(/\/$/, '') || '/';
  return path === '/blog/tag' || path.startsWith(TAG_PREFIX);
}

/**
 * Single-hop destination when the tag segment contains whitespace
 * (literal spaces or %20). Hyphen URLs return null — no chain.
 */
export function blogTagSpaceRedirectPath(pathname: string): string | null {
  const path = pathname.replace(/\/$/, '') || '/';
  if (!path.startsWith(TAG_PREFIX)) return null;
  const raw = path.slice(TAG_PREFIX.length);
  if (!raw) return null;
  const decoded = decodeTagParam(raw);
  if (!/\s/.test(decoded)) return null;
  const hyphen = decoded.trim().replace(/\s+/g, '-');
  if (!hyphen || hyphen === decoded) return null;
  return `${TAG_PREFIX}${hyphen}`;
}
