import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import ProjectPageClient from './ProjectPageClient';
import CreativeWorkSchema from '../../components/CreativeWorkSchema';
import { getSiteUrl, plainTextMeta } from '../../../lib/seo';
import prisma from '../../../lib/prisma';
import { caseStudyText, readPortfolioCaseStudy } from '../../../lib/portfolioCaseStudy';
import { mergeSeoAgentMetadata, SeoAgentPageExtras } from '@/seo-agent-apply';

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
  const baseUrl = process.env.NODE_ENV === 'development' 
    ? 'http://localhost:3000' 
    : 'https://adi-phone.co.il';
  const res = await fetch(`${baseUrl}/api/portfolio2?slug=${slug}`, { cache: 'no-store' });
  if (!res.ok) return null;
  return res.json();
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
  const caseStudy = await readPortfolioCaseStudy(prisma, project.slug);
  return (
    <>
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
      <ProjectPageClient project={project} caseStudy={caseStudy} />
    </>
  );
} 