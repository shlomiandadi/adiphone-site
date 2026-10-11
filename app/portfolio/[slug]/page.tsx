import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import ProjectPageClient from './ProjectPageClient';
import { plainTextMeta } from '../../../lib/seo';

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
  return {
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
  };
}

export default async function Page({ params }: { params: { slug: string } }) {
  const project = await fetchProject(params.slug);
  if (!project) return notFound();
  return <ProjectPageClient project={project} />;
} 