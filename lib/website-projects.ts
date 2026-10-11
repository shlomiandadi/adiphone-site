export type WebsiteProjectCard = {
  name: string;
  slug: string;
  image?: string;
  description?: string;
};

const APP_ONLY = /sentry|אפליקצ|mobile app|bridge app/i;

export function isWebsiteBuildingProject(project: {
  name?: string;
  slug?: string;
  description?: string;
  technologies?: string[];
}) {
  const haystack = `${project.name || ''} ${project.slug || ''} ${project.description || ''} ${(project.technologies || []).join(' ')}`;
  if (APP_ONLY.test(haystack) && !/אתר|wordpress|וורדפרס|חנות|landing|דף נחיתה|ecommerce/i.test(haystack)) {
    return false;
  }
  return true;
}

export async function getWebsitePortfolioProjects(): Promise<WebsiteProjectCard[]> {
  try {
    // Production API is the source of truth (local/preview Prisma may be empty).
    const res = await fetch('https://adi-phone.co.il/api/portfolio2', {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const rows = (await res.json()) as Array<{
      name?: string;
      slug?: string;
      image?: string;
      description?: string;
      technologies?: string[];
      published?: boolean;
    }>;
    if (!Array.isArray(rows)) return [];
    return rows
      .filter((row) => row.slug && row.name && row.published !== false && isWebsiteBuildingProject(row))
      .slice(0, 6)
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
