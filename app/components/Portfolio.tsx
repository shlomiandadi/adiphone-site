import Image from 'next/image';
import Link from 'next/link';

const projects = [
  {
    title: 'אתר תדמית לעסק',
    description: 'אתר תדמית מודרני עם ממשק ניהול תוכן',
    image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800',
    category: 'אתרי תדמית',
    link: '/portfolio/project1'
  },
  {
    title: 'חנות אונליין',
    description: 'חנות אונליין מלאה עם מערכת תשלומים',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800',
    category: 'חנויות אונליין',
    link: '/portfolio/project2'
  },
  {
    title: 'אפליקציית מובייל',
    description: 'אפליקציית מובייל עם ממשק משתמש מתקדם',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800',
    category: 'אפליקציות מובייל',
    link: '/portfolio/project3'
  }
];

export default function Portfolio() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">הפרויקטים שלנו</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <Link href={project.link} key={index}>
              <div className="group relative bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                <div className="relative p-6">
                  <span className="inline-block px-3 py-1 text-sm text-blue-600 bg-blue-50 rounded-full mb-2 transform transition-transform duration-300 group-hover:scale-110 group-hover:bg-blue-100">
                    {project.category}
                  </span>
                  <h3 className="text-xl font-bold mt-2 mb-2 transition-colors duration-300 group-hover:text-blue-600">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 transition-colors duration-300 group-hover:text-gray-900">
                    {project.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
} 