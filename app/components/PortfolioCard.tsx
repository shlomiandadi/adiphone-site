import Link from 'next/link';
import { responsiveAttributes } from '../../lib/responsiveImage';

interface Project {
  title: string;
  image: string;
  description: string;
  category: string;
  href?: string;
  imageSrc?: string;
}

interface PortfolioCardProps {
  project: Project;
}

export default function PortfolioCard({ project }: PortfolioCardProps) {
  const src = project.imageSrc || `/images/portfolio/${project.image}.svg`;
  const card = (
    <div className="flex h-full flex-col overflow-hidden rounded-lg bg-white shadow-lg">
      <img
        alt={project.title}
        width={360}
        height={192}
        className="h-48 w-full object-cover"
        {...responsiveAttributes(src, {
          sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 360px',
          widths: [360, 480, 720],
          fetchPriority: 'low',
          priority: false,
        })}
        loading="lazy"
        decoding="async"
        fetchPriority="low"
      />
      <div className="flex flex-1 flex-col p-6">
        <h3 className="mb-2 text-xl font-bold text-gray-900">{project.title}</h3>
        <p className="mb-4 line-clamp-3 text-gray-600">{project.description}</p>
        {project.category ? (
          <div className="mt-auto text-sm text-gray-500">{project.category}</div>
        ) : null}
      </div>
    </div>
  );

  if (project.href) {
    return (
      <Link href={project.href} className="block h-full">
        {card}
      </Link>
    );
  }

  return card;
}
