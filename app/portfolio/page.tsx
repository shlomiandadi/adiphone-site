import React from 'react';
import Link from 'next/link';

interface Project {
  id: string;
  name: string;
  slug: string;
  image?: string;
  description?: string;
}

const cloudinaryBase = 'https://res.cloudinary.com/dooxg35gj/image/upload/v1753362055/portfolio/';

async function fetchProjects(): Promise<Project[]> {
  const baseUrl = process.env.NODE_ENV === 'development' 
    ? 'http://localhost:3000' 
    : 'https://adi-phone.co.il';
  const res = await fetch(`${baseUrl}/api/portfolio2`, { 
    cache: 'no-store',
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  });
  if (!res.ok) return [];
  return res.json();
}

export default async function PortfolioPage() {
  const projects = await fetchProjects();

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">הפרויקטים שלנו</h1>
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
                src={project.image || `${cloudinaryBase}${project.slug}.jpg`}
                alt={project.name}
                className="w-full h-48 object-cover"
                loading="lazy"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{project.name}</h2>
                <p className="text-gray-600 text-sm line-clamp-3">{project.description}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
} 