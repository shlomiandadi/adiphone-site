import prisma from './prisma';
import {
  CONTENT_REVALIDATE_SECONDS,
  PORTFOLIO_CACHE_TAG,
  contentCache,
  reviveDates,
} from './contentCache';
import { readPortfolioCaseStudy } from './portfolioCaseStudy';

export const PORTFOLIO_LIST_SELECT = {
  id: true,
  name: true,
  slug: true,
  image: true,
  description: true,
  technologies: true,
  published: true,
  date: true,
} as const;

/** Homepage cards only — omit fields not rendered above the fold. */
export const PORTFOLIO_HOME_SELECT = {
  id: true,
  name: true,
  slug: true,
  image: true,
  description: true,
} as const;

export const getPublishedPortfolioList = contentCache(
  'portfolio-list',
  [PORTFOLIO_CACHE_TAG],
  async () => {
    const projects = await prisma.portfolioProject2.findMany({
      where: { published: true },
      orderBy: { date: 'desc' },
      select: PORTFOLIO_LIST_SELECT,
    });
    return projects.map(reviveDates);
  }
);

export const getHomepagePortfolioPreview = contentCache(
  'portfolio-home-preview',
  [PORTFOLIO_CACHE_TAG],
  async () => {
    const projects = await prisma.portfolioProject2.findMany({
      where: { published: true },
      orderBy: { date: 'desc' },
      take: 3,
      select: PORTFOLIO_HOME_SELECT,
    });
    return projects;
  }
);

export const getPublishedPortfolioBySlug = contentCache(
  'portfolio-by-slug',
  [PORTFOLIO_CACHE_TAG],
  async (slug: string) => {
    const project = await prisma.portfolioProject2.findUnique({
      where: { slug },
    });
    return project ? reviveDates(project) : null;
  }
);

export const getPortfolioCaseStudyCached = contentCache(
  'portfolio-case-study',
  [PORTFOLIO_CACHE_TAG],
  async (slug: string) => readPortfolioCaseStudy(prisma, slug)
);

export function portfolioFetchInit() {
  return {
    next: { revalidate: CONTENT_REVALIDATE_SECONDS, tags: [PORTFOLIO_CACHE_TAG] },
  } as const;
}
