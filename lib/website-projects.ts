import { getPublishedPortfolioList } from './portfolioPublic';

export type WebsiteProjectCard = {
  name: string;
  slug: string;
  image?: string;
  description?: string;
};

export type PortfolioTopic =
  | 'websites'
  | 'ecommerce'
  | 'wordpress'
  | 'apps'
  | 'software'
  | 'seo'
  | 'ui'
  | 'all';

export type PublishedProject = {
  name?: string;
  slug?: string;
  image?: string;
  description?: string;
  technologies?: string[];
  published?: boolean;
};

const APP_ONLY = /sentry|אפליקצ|mobile app|bridge app/i;
const ECOMMERCE = /ecommerce|woocommerce|חנות|shop|stripe|cbd|gold market|event gear/i;
const WORDPRESS = /wordpress|וורדפרס|wp template/i;
const SEO = /\bseo\b|קידום|geo/i;
const SOFTWARE = /sentry|api|template creator|saas|מערכת/i;

function haystack(project: PublishedProject) {
  return `${project.name || ''} ${project.slug || ''} ${project.description || ''} ${(project.technologies || []).join(' ')}`;
}

export function isWebsiteBuildingProject(project: PublishedProject) {
  const text = haystack(project);
  if (APP_ONLY.test(text) && !/אתר|wordpress|וורדפרס|חנות|landing|דף נחיתה|ecommerce/i.test(text)) {
    return false;
  }
  return true;
}

export function matchesPortfolioTopic(project: PublishedProject, topic: PortfolioTopic) {
  const text = haystack(project);
  switch (topic) {
    case 'all':
      return true;
    case 'websites':
      return isWebsiteBuildingProject(project);
    case 'ecommerce':
      return ECOMMERCE.test(text);
    case 'wordpress':
      return WORDPRESS.test(text);
    case 'apps':
      return APP_ONLY.test(text);
    case 'software':
      return SOFTWARE.test(text) || APP_ONLY.test(text);
    case 'seo':
      return SEO.test(text);
    case 'ui':
      return isWebsiteBuildingProject(project);
    default:
      return false;
  }
}

export async function getPublishedPortfolioProjects(
  topic: PortfolioTopic = 'all',
  limit = 6
): Promise<WebsiteProjectCard[]> {
  try {
    const rows = (await getPublishedPortfolioList()) as PublishedProject[];
    if (!Array.isArray(rows)) return [];
    return rows
      .filter((row) => row.slug && row.name && row.published !== false && matchesPortfolioTopic(row, topic))
      .slice(0, limit)
      .map((row) => ({
        name: row.name as string,
        slug: row.slug as string,
        image: row.image,
        description: row.description,
      }));
  } catch {
    return [];
  }
}

export async function getWebsitePortfolioProjects(): Promise<WebsiteProjectCard[]> {
  return getPublishedPortfolioProjects('websites', 6);
}
