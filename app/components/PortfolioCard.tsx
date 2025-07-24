import Image from 'next/image';

interface Project {
  title: string;
  image: string;
  description: string;
  category: string;
}

interface PortfolioCardProps {
  project: Project;
}

export default function PortfolioCard({ project }: PortfolioCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <Image
        src={`/images/portfolio/${project.image}.svg`}
        alt={project.title}
        width={800}
        height={600}
        className="w-full h-48 object-cover rounded-t-lg"
      />
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{project.title}</h3>
        <p className="text-gray-600 mb-4">{project.description}</p>
        <div className="text-sm text-gray-500">{project.category}</div>
      </div>
    </div>
  );
} 