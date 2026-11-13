import { getPublishedPortfolioList } from '../portfolioPublic';
import {
  getCategoryLeafRows,
  getPostBySlug,
  getPostsByCategorySlugCached,
  getPublishedPostTitles,
  getTagLabel,
  getTagLeafRows,
} from '../posts';

const PORTFOLIO_STATIC_TITLES: Record<string, string> = {
  project1: 'פרויקט 1',
  project2: 'פרויקט 2',
  project3: 'פרויקט 3',
};

const CATEGORY_PAGE_TITLES: Record<string, string> = {
  SEO: 'קידום אתרים',
  seo: 'קידום אתרים',
  WEB_DEVELOPMENT: 'פיתוח אתרים',
  'web-development': 'פיתוח אתרים',
  APP_DEVELOPMENT: 'פיתוח אפליקציות',
  'app-development': 'פיתוח אפליקציות',
  'mobile-apps': 'פיתוח אפליקציות',
  DIGITAL_MARKETING: 'שיווק דיגיטלי',
  'digital-marketing': 'שיווק דיגיטלי',
  UI_UX: 'עיצוב ממשק משתמש',
  design: 'עיצוב',
  ECOMMERCE: 'מסחר אלקטרוני',
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
    const mapped = CATEGORY_PAGE_TITLES[slug] || CATEGORY_PAGE_TITLES[slug.toUpperCase()];
    if (mapped) return mapped;
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
      const projects = await getPublishedPortfolioList();
      const project = projects.find((item) => item.slug === parts[1]);
      const name = project?.name?.trim();
      return name || undefined;
    } catch {
      return undefined;
    }
  }

  return undefined;
}

/** Path → last-crumb title, for layout SSR without reading request headers. */
export async function loadBreadcrumbLeaves(): Promise<Record<string, string>> {
  const leaves: Record<string, string> = {
    '/blog/kama-oleh-bniyat-atar-2026': 'כמה עולה בניית אתר ב-2026',
    '/portfolio/project1': PORTFOLIO_STATIC_TITLES.project1,
    '/portfolio/project2': PORTFOLIO_STATIC_TITLES.project2,
    '/portfolio/project3': PORTFOLIO_STATIC_TITLES.project3,
  };
  try {
    const [posts, categories, tags, projects] = await Promise.all([
      getPublishedPostTitles(),
      getCategoryLeafRows(),
      getTagLeafRows(),
      getPublishedPortfolioList(),
    ]);
    posts.forEach((post) => {
      if (post.slug && post.title) leaves[`/blog/${post.slug}`] = post.title;
    });
    categories.forEach((category) => {
      if (!category.slug) return;
      const title =
        CATEGORY_PAGE_TITLES[category.slug] ||
        CATEGORY_PAGE_TITLES[category.slug.toUpperCase()] ||
        category.name;
      if (title) leaves[`/blog/category/${category.slug}`] = title;
    });
    tags.forEach((tag) => {
      const name = tag.name?.trim();
      if (!name) return;
      if (tag.slug) leaves[`/blog/tag/${tag.slug}`] = name;
      leaves[`/blog/tag/${encodeURIComponent(name)}`] = name;
    });
    projects.forEach((project) => {
      if (project.slug && project.name) leaves[`/portfolio/${project.slug}`] = project.name;
    });
  } catch (error) {
    console.warn('Breadcrumb leaf map fallback:', error);
  }
  return leaves;
}

function decodeSegment(segment: string): string {
  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
}
