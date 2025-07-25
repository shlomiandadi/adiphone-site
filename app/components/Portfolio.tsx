import Image from 'next/image';
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
    ? 'http://localhost:3002' 
    : 'https://adi-phone.co.il';
  const res = await fetch(`${baseUrl}/api/portfolio2`, { cache: 'no-store' });
  if (!res.ok) return [];
  return res.json();
}

export default async function Portfolio() {
  const projects = await fetchProjects();
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">הפרויקטים שלנו</h2>
        {projects.length === 0 ? (
          <div className="text-center text-gray-500">לא נמצאו פרויקטים.</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {projects.slice(0, 3).map((project) => (
                <Link href={`/portfolio/${project.slug}`} key={project.id}>
                  <div className="group relative bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                    <div className="relative h-64 overflow-hidden">
                      <Image
                        src={project.image || `${cloudinaryBase}${project.slug}.jpg`}
                        alt={project.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                    <div className="relative p-6">
                      <h3 className="text-xl font-bold mt-2 mb-2 transition-colors duration-300 group-hover:text-blue-600">
                        {project.name}
                      </h3>
                      <p className="text-gray-600 transition-colors duration-300 group-hover:text-gray-900">
                        {project.description}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link href="/portfolio" className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors">
                לכל הפרויקטים
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
} 