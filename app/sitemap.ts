import { MetadataRoute } from 'next';
import { getSitemapSettings } from '../lib/cms/sitemap';
import staticLastmod from '../lib/static-lastmod.json';
import { resolveStaticLastModified, STATIC_ROUTES } from '../lib/staticLastmod';
import { getSiteUrl } from '../lib/seo';

export const revalidate = 3600;

/** Slugs that 301 elsewhere — must not appear in sitemap. */
const REDIRECTED_BLOG_SLUGS = new Set([
  'nyhvl-kmpyynym-mmvmnym',
  'bnyyt-atrym-prds-chnh',
  'bnyyt-atry-ayntrnt-bprds-chnh',
  'building-websites-for-businesses',
  'kmpyynym-mmvmnym',
  'kydvm-mmvmn-ppc',
  'top-webstack',
  'kyshvrym-mhyrym',
  'ptrvnvt-ai-mtkdmym',
  'thlyk-habvdh-shlnv',
  'ady-pvn-tkshvrt',
  'mvknym-lhtchyl',
  'htknvlvgyvt-shlnv',
  'hchzvn-shlnv',
  'shyrvty-ann',
  'avdvt-hchbrh',
  'bnyyh-vkydvm-atrym-mktsvayym',
  'hshyrvtym-shlnv',
  'ai-laskym-ktnym',
  'kydvm-atrym-laskym-ktnym',
  'pytvch-aplyktsyvt',
  'ptrvnvt-mschr-mtkdmym',
  'hytrvnvt-shlnv',
  'anlytyks-vmdydh',
  'htsvvt-shlnv',
  '3-hvravt-shymvsh',
  'bnyyt-atry-vvrdprs',
  'kydvm-atrym',
  '3-mkvrvt-hmyda',
  'hprvyktym-shlnv',
  'kblt-hchltvt-mbvssvt-dath',
  'atrym-vprvyktym-mvtslchym',
  'tknvn-hgyrh-n',
  'hvpkym-rayvn-lmtsyavt',
  'bnyyt-atrym-ktnym',
  'svknvt-kydvm-atrym',
]);

function isExcluded(path: string, excludes: string[]) {
  return excludes.some((rule) => {
    if (!rule) return false;
    const normalized = rule.replace(/\/\*$/, '');
    return path === rule || path === normalized || path.startsWith(`${normalized}/`);
  });
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();
  const settings = await getSitemapSettings();
  const changeFrequency = (settings?.changeFreq as MetadataRoute.Sitemap[number]['changeFrequency']) || 'weekly';
  const defaultPriority = typeof settings?.priority === 'number' ? settings.priority : 0.8;
  const excludes = [
    ...(settings?.excludePages || []),
    ...(settings?.excludePaths || []),
  ];

  const includePages = settings ? settings.includePages : true;
  const includePosts = settings ? settings.includePosts : true;
  const includePortfolio = settings ? settings.includePortfolio : true;
  const includeCategories = settings ? settings.includeCategories : false;

  const staticRoutes = (includePages ? STATIC_ROUTES : [])
    .filter((route) => !isExcluded(route || '/', excludes))
    .map((route) => {
      const lastModified = resolveStaticLastModified(route, staticLastmod);
      return {
        url: `${baseUrl}${route}`,
        ...(lastModified ? { lastModified } : {}),
        changeFrequency,
        priority: route === '' ? 1 : defaultPriority,
      };
    });

  let blogRoutes: MetadataRoute.Sitemap = [];
  let portfolioRoutes: MetadataRoute.Sitemap = [];
  let categoryRoutes: MetadataRoute.Sitemap = [];
  try {
    if (process.env.DATABASE_URL) {
      const { PrismaClient } = await import('@prisma/client');
      const prisma = new PrismaClient();

      if (includePosts) {
        const blogPosts = await prisma.post.findMany({
          where: { published: true },
          select: { slug: true, updatedAt: true, canonicalUrl: true },
        });

        blogRoutes = blogPosts
          .filter((post) => !REDIRECTED_BLOG_SLUGS.has(post.slug))
          .filter((post) => !isExcluded(`/blog/${post.slug}`, excludes))
          .filter((post) => {
            // Skip posts whose stored canonical points to a different path (non-self)
            if (!post.canonicalUrl) return true;
            try {
              const canonical = new URL(
                post.canonicalUrl.replace(/^http:\/\//i, 'https://'),
                baseUrl
              );
              const selfPath = `/blog/${post.slug}`;
              return canonical.pathname.replace(/\/$/, '') === selfPath;
            } catch {
              return true;
            }
          })
          .map((post) => ({
            url: `${baseUrl}/blog/${post.slug}`,
            lastModified: post.updatedAt,
            changeFrequency,
            priority: 0.7,
          }));
      }

      if (includePortfolio) {
        const projects = await prisma.portfolioProject2.findMany({
          where: { published: true },
          select: { slug: true, updatedAt: true },
        });

        portfolioRoutes = projects
          .filter((project) => !isExcluded(`/portfolio/${project.slug}`, excludes))
          .map((project) => ({
            url: `${baseUrl}/portfolio/${project.slug}`,
            lastModified: project.updatedAt,
            changeFrequency: 'monthly' as const,
            priority: 0.6,
          }));
      }

      if (includeCategories) {
        const categories = await prisma.category.findMany({
          select: { slug: true, updatedAt: true },
        });
        categoryRoutes = categories
          .filter((category) => !isExcluded(`/blog/category/${category.slug}`, excludes))
          .map((category) => ({
            url: `${baseUrl}/blog/category/${category.slug}`,
            lastModified: category.updatedAt,
            changeFrequency,
            priority: 0.5,
          }));
      }

      await prisma.$disconnect();
    }
  } catch (error) {
    console.warn('Could not fetch dynamic routes for sitemap:', error);
  }

  return [...staticRoutes, ...blogRoutes, ...portfolioRoutes, ...categoryRoutes];
}
