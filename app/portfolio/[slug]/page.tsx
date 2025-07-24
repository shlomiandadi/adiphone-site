import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import ProjectPageClient from './ProjectPageClient';

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
}

const cloudinaryBase = 'https://res.cloudinary.com/dooxg35gj/image/upload/v1753362055/portfolio/';

async function fetchProject(slug: string): Promise<Project | null> {
  const baseUrl = process.env.NODE_ENV === 'development' 
    ? 'http://localhost:3002' 
    : 'https://adi-phone.co.il';
  const res = await fetch(`${baseUrl}/api/portfolio2?slug=${slug}`, { cache: 'no-store' });
  if (!res.ok) return null;
  return res.json();
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const project = await fetchProject(params.slug);
  if (!project) return {};
  return {
    title: project.name,
    description: project.descriptionRich || project.description || `פרויקט: ${project.name}`,
    alternates: {
      canonical: `/portfolio/${project.slug}`,
    },
    openGraph: {
      title: project.name,
      description: project.descriptionRich || project.description || `פרויקט: ${project.name}`,
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