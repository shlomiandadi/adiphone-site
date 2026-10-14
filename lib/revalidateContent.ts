import { revalidatePath } from 'next/cache';

function safeRevalidate(paths: string[]) {
  try {
    for (const path of paths) {
      revalidatePath(path);
    }
  } catch {
    // ignore — same as SEO-agent webhook
  }
}

export function revalidateBlogPaths(slug: string, previousSlug?: string | null) {
  const paths = [`/blog/${slug}`, '/blog', '/', '/sitemap.xml'];
  if (previousSlug && previousSlug !== slug) {
    paths.unshift(`/blog/${previousSlug}`);
  }
  safeRevalidate(paths);
}

export function revalidatePortfolioPaths(slug: string, previousSlug?: string | null) {
  const paths = [`/portfolio/${slug}`, '/portfolio', '/sitemap.xml'];
  if (previousSlug && previousSlug !== slug) {
    paths.unshift(`/portfolio/${previousSlug}`);
  }
  safeRevalidate(paths);
}
