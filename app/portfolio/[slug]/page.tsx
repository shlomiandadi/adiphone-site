import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import ReactDOM from 'react-dom';
import ProjectPageClient, { PORTFOLIO_HERO_IMAGE } from './ProjectPageClient';
import CreativeWorkSchema from '../../components/CreativeWorkSchema';
import { getSiteUrl, plainTextMeta } from '../../../lib/seo';
import { caseStudyText } from '../../../lib/portfolioCaseStudy';
import {
  getPortfolioCaseStudyCached,
  getPublishedPortfolioBySlug,
  getPublishedPortfolioList,
} from '../../../lib/portfolioPublic';
import { PORTFOLIO_RELATED_SERVICE } from '../../../lib/related-content';
import Link from 'next/link';
import PortfolioCard from '../../components/PortfolioCard';
import ServiceCtaBanner from '../../components/ServiceCtaBanner';
import { mergeSeoAgentMetadata, SeoAgentPageExtras } from '@/seo-agent-apply';
import {
  optimizeContentImages,
  responsiveAttributes,
  type ResponsiveImageAttrs,
} from '../../../lib/responsiveImage';

const CLOUDINARY_ORIGIN = 'https://res.cloudinary.com';

function preloadHero(image: ResponsiveImageAttrs) {
  const preload = (ReactDOM as unknown as {
    preload?: (
      href: string,
      options: {
        as: 'image';
        fetchPriority?: 'high';
        imageSrcSet?: string;
        imageSizes?: string;
      }
    ) => void;
  }).preload;
  if (typeof preload !== 'function') return;
  preload(image.src, {
    as: 'image',
    fetchPriority: 'high',
    imageSrcSet: image.srcSet,
    imageSizes: image.sizes,
  });
}

function preconnectCloudinary() {
  const preconnect = (ReactDOM as unknown as {
    preconnect?: (
      href: string,
      options?: { crossOrigin?: '' | 'anonymous' | 'use-credentials' }
    ) => void;
  }).preconnect;
  if (typeof preconnect !== 'function') return;
  preconnect(CLOUDINARY_ORIGIN);
  preconnect(CLOUDINARY_ORIGIN, { crossOrigin: 'anonymous' });
}

export const revalidate = 3600;

export async function generateStaticParams() {
  try {
    const projects = await getPublishedPortfolioList();
    return projects.map((project) => ({ slug: project.slug }));
  } catch {
    return [];
  }
}

interface Project {
  id: string;
  name: string;
  slug: string;
  image?: string;
  images?: string[];
  description?: string;
  descriptionRich?: string;
  technologies?: string[];
  url?: string;
  date?: string | Date | null;
  keywords?: string[] | null;
  metaTitle?: string | null;
  metaDesc?: string | null;
}

const cloudinaryBase = 'https://res.cloudinary.com/dooxg35gj/image/upload/v1753362055/portfolio/';

function inferProjectType(project: Project): string {
  const haystack = `${project.description || ''} ${(project.technologies || []).join(' ')}`.toLowerCase();
  if (/shop|woocommerce|shopify|ecommerce|חנות/.test(haystack)) return 'חנות אונליין';
  if (/wordpress|וורדפרס/.test(haystack)) return 'אתר וורדפרס';
  if (/app|mobile|אפליקצ/.test(haystack)) return 'אפליקציה';
  return 'אתר';
}

async function fetchProject(slug: string): Promise<Project | null> {
  try {
    const project = await getPublishedPortfolioBySlug(slug);
    if (!project || !project.published) return null;
    return project as Project;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const project = await fetchProject(params.slug);
  if (!project) return {};
  const description =
    (project.metaDesc && plainTextMeta(project.metaDesc, 155)) ||
    plainTextMeta(project.descriptionRich, 155) ||
    plainTextMeta(project.description, 155) ||
    plainTextMeta(`פרויקט: ${project.name}`, 155);
  const type = inferProjectType(project);
  const title =
    (project.metaTitle && project.metaTitle.trim()) ||
    `${project.name} – ${type} | תיק עבודות Top Webstak`;
  return mergeSeoAgentMetadata(`/portfolio/${project.slug}`, {
    title: { absolute: title },
    description,
    alternates: {
      canonical: `/portfolio/${project.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `/portfolio/${project.slug}`,
      images: project.images && project.images.length > 0 ? project.images : project.image ? [project.image] : [],
    },
  });
}

export default async function Page({ params }: { params: { slug: string } }) {
  const project = await fetchProject(params.slug);
  if (!project) return notFound();
  const siteUrl = getSiteUrl();
  const description =
    plainTextMeta(project.descriptionRich, 300) ||
    plainTextMeta(project.description, 300) ||
    '';
  const keywords = (project.keywords && project.keywords.length)
    ? project.keywords
    : (project.technologies || []);
  const caseStudy = await getPortfolioCaseStudyCached(project.slug);
  const relatedService = PORTFOLIO_RELATED_SERVICE[project.slug] || null;
  let relatedProjects: Awaited<ReturnType<typeof getPublishedPortfolioList>> = [];
  try {
    const published = await getPublishedPortfolioList();
    relatedProjects = published.filter((item) => item.slug !== project.slug).slice(0, 3);
  } catch {
    relatedProjects = [];
  }
  const heroImage = project.image
    ? responsiveAttributes(project.image, PORTFOLIO_HERO_IMAGE)
    : null;
  if (heroImage) {
    preconnectCloudinary();
    preloadHero(heroImage);
  }
  return (
    <>
      {heroImage ? (
        <>
          <link rel="preconnect" href={CLOUDINARY_ORIGIN} />
          <link rel="preconnect" href={CLOUDINARY_ORIGIN} crossOrigin="anonymous" />
          <link
            rel="preload"
            as="image"
            href={heroImage.srcSet ? undefined : heroImage.src}
            imageSrcSet={heroImage.srcSet}
            imageSizes={heroImage.sizes}
            fetchPriority="high"
          />
        </>
      ) : null}
      <SeoAgentPageExtras path={`/portfolio/${project.slug}`} />
      <CreativeWorkSchema
        name={project.name}
        description={description}
        image={project.images && project.images.length ? project.images : project.image}
        url={`${siteUrl}/portfolio/${project.slug}`}
        dateCreated={project.date || null}
        keywords={keywords}
        text={caseStudy ? caseStudyText(caseStudy) : undefined}
      />
      <ProjectPageClient
        project={{
          ...project,
          descriptionRich: project.descriptionRich
            ? optimizeContentImages(project.descriptionRich)
            : project.descriptionRich,
        }}
        caseStudy={caseStudy}
        relatedService={relatedService}
        heroImage={heroImage}
      />
      {relatedProjects.length > 0 ? (
        <section
          className="bg-gray-50 py-10 [content-visibility:auto] [contain-intrinsic-size:auto_1400px]"
          aria-label="הפרויקטים שלנו"
        >
          <div className="container mx-auto max-w-4xl px-4">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
              {relatedProjects.map((item) => (
                <PortfolioCard
                  key={item.id}
                  project={{
                    title: item.name,
                    image: item.slug,
                    imageSrc: item.image,
                    description: item.description,
                    category: item.technologies?.[0] || '',
                    href: `/portfolio/${item.slug}`,
                  }}
                />
              ))}
            </div>
          </div>
        </section>
      ) : null}
      <ServiceCtaBanner serviceKey={relatedService?.serviceHref} />
      {relatedService ? (
        <p className="max-w-4xl mx-auto px-4 pb-10 text-right text-lg">
          השירות המתאים:{' '}
          <Link
            href={relatedService.serviceHref}
            className="font-semibold text-blue-700 underline"
          >
            {relatedService.serviceLabel}
          </Link>
        </p>
      ) : null}
    </>
  );
} 