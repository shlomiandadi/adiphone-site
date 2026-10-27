import React from 'react';
import Link from 'next/link';
import Hero3D from '../components/hero3d/Hero3D';
import { responsiveAttributes } from '../../lib/responsiveImage';
import { getPublishedPortfolioList } from '../../lib/portfolioPublic';

export const revalidate = 3600;

interface Project {
  id: string;
  name: string;
  slug: string;
  image?: string;
  description?: string;
}

const cloudinaryBase = 'https://res.cloudinary.com/dooxg35gj/image/upload/v1753362055/portfolio/';

async function fetchProjects(): Promise<Project[]> {
  try {
    return await getPublishedPortfolioList();
  } catch {
    return [];
  }
}

export default async function PortfolioPage() {
  const projects = await fetchProjects();

  return (
    <main>
      <Hero3D
        theme="portfolio"
        title="הפרויקטים שלנו"
        subtitle="עבודות אמיתיות מתיק העבודות של Top Webstak"
        align="center"
        ctas={[{ href: '/contact', label: 'דברו איתנו על הפרויקט הבא' }]}
      />
      <div data-reveal className="max-w-6xl mx-auto px-4 py-12">
      {projects.length === 0 ? (
        <div className="text-center text-gray-500">לא נמצאו פרויקטים.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/portfolio/${project.slug}`}
              className="block bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden"
            >
              <img
                alt={project.name}
                className="w-full h-48 object-cover"
                {...responsiveAttributes(project.image || `${cloudinaryBase}${project.slug}.jpg`, {
                  sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 360px',
                  widths: [360, 480, 720, 960],
                })}
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{project.name}</h2>
                <p className="text-gray-600 text-sm line-clamp-3">{project.description}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
      </div>
    </main>
  );
} 