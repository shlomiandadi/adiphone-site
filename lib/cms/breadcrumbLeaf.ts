import { getPublishedPortfolioBySlug } from '../portfolioPublic';
import { getPostBySlug, getPostsByCategorySlugCached, getTagLabel } from '../posts';

const PORTFOLIO_STATIC_TITLES: Record<string, string> = {
  project1: 'פרויקט 1',
  project2: 'פרויקט 2',
  project3: 'פרויקט 3',
};

/**
 * Real page title for the last breadcrumb, when the URL slug is not the label.
 * Skips /services/* so those crumbs stay on the static Hebrew map.
 */
export async function resolveBreadcrumbLeafTitle(pathname: string): Promise<string | undefined> {
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length < 2) return undefined;
  if (parts[0] === 'services') return undefined;

  if (parts[0] === 'blog' && parts[1] === 'category' && parts[2]) {
    const slug = decodeSegment(parts[2]);
    try {
      const { categoryRecord } = await getPostsByCategorySlugCached(slug);
      const name = categoryRecord?.name?.trim();
      return name || undefined;
    } catch {
      return undefined;
    }
  }

  if (parts[0] === 'blog' && parts[1] === 'tag' && parts[2]) {
    try {
      return await getTagLabel(parts[2]);
    } catch {
      return decodeSegment(parts[2]);
    }
  }

  if (parts[0] === 'blog' && parts.length === 2) {
    try {
      const post = await getPostBySlug(parts[1]);
      const title = post?.title?.trim();
      return title || undefined;
    } catch {
      return undefined;
    }
  }

  if (parts[0] === 'portfolio' && parts.length === 2) {
    if (PORTFOLIO_STATIC_TITLES[parts[1]]) return PORTFOLIO_STATIC_TITLES[parts[1]];
    try {
      const project = await getPublishedPortfolioBySlug(parts[1]);
      const name = project?.name?.trim();
      return name || undefined;
    } catch {
      return undefined;
    }
  }

  return undefined;
}

function decodeSegment(segment: string): string {
  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
}
