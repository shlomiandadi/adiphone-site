import { PERMANENT_REDIRECTS as REDIRECT_ROWS } from './permanent-redirects-data.js';

export type PermanentRedirect = {
  source: string;
  destination: string;
};

export const PERMANENT_REDIRECTS: PermanentRedirect[] = REDIRECT_ROWS;

const KEEP_BLOG_SLUGS = new Set([
  'mh-zh-seo',
  'seo-tkny',
  'mh-zh-kydvm-avrgny',
  'pytvch-aplyktsyvt-hrbh-yvtr-mkvd',
  'pytvch-aplyktsyvt-hybrydyvt',
  'ptrvnvt-bann',
  'shyvvk-dygytly-ai',
  'What-is-AEO-Answer-Engine-Optimization-and-Why-Does-It-Change',
]);

export function normalizeRedirectPath(pathname: string): string {
  let path = pathname || '/';
  try {
    path = decodeURIComponent(path);
  } catch {
    // keep the raw path when it is not valid percent-encoding
  }
  if (!path.startsWith('/')) path = `/${path}`;
  if (path.length > 1) path = path.replace(/\/+$/, '');
  return path || '/';
}

const REDIRECT_BY_SOURCE = new Map(
  PERMANENT_REDIRECTS.map((rule) => [normalizeRedirectPath(rule.source), rule.destination])
);

export function lookupPermanentRedirect(pathname: string): string | null {
  const path = normalizeRedirectPath(pathname);
  return REDIRECT_BY_SOURCE.get(path) ?? null;
}

export function isRedirectedBlogSlug(slug: string): boolean {
  return lookupPermanentRedirect(`/blog/${slug}`) !== null;
}

export const REDIRECTED_BLOG_SLUGS: string[] = PERMANENT_REDIRECTS.filter((rule) =>
  rule.source.startsWith('/blog/')
).map((rule) => rule.source.slice('/blog/'.length));

export const REDIRECTED_BLOG_SLUG_SET = new Set(REDIRECTED_BLOG_SLUGS);

export function nextPermanentRedirectRules() {
  return PERMANENT_REDIRECTS.map((rule) => ({
    source: rule.source,
    destination: rule.destination,
    permanent: true,
  }));
}

export function assertKeepersNotRedirected() {
  for (const slug of KEEP_BLOG_SLUGS) {
    if (isRedirectedBlogSlug(slug)) {
      throw new Error(`Keeper slug must not redirect: ${slug}`);
    }
  }
}
