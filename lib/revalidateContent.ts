import { revalidatePath, revalidateTag } from 'next/cache';
import { CMS_CACHE_TAG } from './cms/cache';

function safeRevalidate(paths: string[]) {
  try {
    for (const path of paths) {
      revalidatePath(path);
    }
  } catch {
    // ignore — same as SEO-agent webhook
  }
}

export function revalidateBlogPaths(
  slug: string,
  previousSlug?: string | null,
  extra?: {
    categorySlugs?: Array<string | null | undefined>;
    tags?: Array<string | null | undefined>;
  }
) {
  const paths = new Set<string>([`/blog/${slug}`, '/blog', '/', '/sitemap.xml']);
  if (previousSlug && previousSlug !== slug) {
    paths.add(`/blog/${previousSlug}`);
  }
  for (const categorySlug of extra?.categorySlugs || []) {
    if (categorySlug) {
      paths.add(`/blog/category/${categorySlug}`);
    }
  }
  for (const tag of extra?.tags || []) {
    if (tag) {
      paths.add(`/blog/tag/${tag}`);
    }
  }
  safeRevalidate(Array.from(paths));
}

export function revalidatePortfolioPaths(slug: string, previousSlug?: string | null) {
  const paths = [`/portfolio/${slug}`, '/portfolio', '/', '/sitemap.xml'];
  if (previousSlug && previousSlug !== slug) {
    paths.unshift(`/portfolio/${previousSlug}`);
  }
  safeRevalidate(paths);
}

export function revalidateSitePaths(paths: string[], layout = false) {
  try {
    revalidateTag(CMS_CACHE_TAG);
    for (const path of paths) {
      if (layout) {
        revalidatePath(path, 'layout');
      } else {
        revalidatePath(path);
      }
    }
  } catch {
    // ignore
  }
}
