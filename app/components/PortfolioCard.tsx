import Image from 'next/image';
import Link from 'next/link';

interface Project {
  title: string;
  image: string;
  description: string;
  category: string;
  href?: string;
}

interface PortfolioCardProps {
  project: Project;
}

export default function PortfolioCard({ project }: PortfolioCardProps) {
  const imageSrc = project.image.includes('/')
    ? project.image
    : `/images/portfolio/${project.image}.svg`;

  const body = (
    <div className="h-full overflow-hidden rounded-lg bg-white shadow-lg">
      <div className="relative h-48 w-full bg-slate-100">
        <Image
          src={imageSrc}
          alt={project.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
        />
      </div>
      <div className="p-6">
        <h3 className="mb-2 text-xl font-bold text-gray-900">{project.title}</h3>
        {project.description ? (
          <p className="mb-4 text-gray-600">{project.description}</p>
        ) : null}
        {project.category ? <div className="text-sm text-gray-500">{project.category}</div> : null}
      </div>
    </div>
  );

  if (project.href) {
    return (
      <Link href={project.href} className="block h-full">
        {body}
      </Link>
    );
  }

  return body;
}
