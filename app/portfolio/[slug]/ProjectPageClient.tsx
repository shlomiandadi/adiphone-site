"use client";
import { useState } from 'react';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';

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

export default function ProjectPageClient({ project }: { project: Project }) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const images = project.images || [];

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      {/* Hero Section */}
      <div className="relative rounded-2xl overflow-hidden shadow-lg mb-8">
        {project.image && (
          <img
            src={project.image}
            alt={project.name}
            className="w-full h-80 object-cover"
            loading="lazy"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-8">
          <h1 className="text-4xl font-bold text-white drop-shadow mb-2">{project.name}</h1>
          {project.technologies && project.technologies.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {project.technologies.map((tech, i) => (
                <span key={i} className="bg-blue-600/80 text-white px-3 py-1 rounded-full text-sm font-medium shadow">
                  {tech}
                </span>
              ))}
            </div>
          )}
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-white/90 text-blue-700 px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 hover:text-white transition w-fit min-w-fit"
            >
              מעבר לאתר הפרויקט
            </a>
          )}
        </div>
      </div>

      {/* Gallery */}
      {images.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">גלריית תמונות</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={project.name + ' image ' + (i + 1)}
                className="rounded-lg w-full object-cover aspect-video shadow hover:scale-105 transition-transform cursor-pointer"
                loading="lazy"
                onClick={() => { setIndex(i); setOpen(true); }}
              />
            ))}
          </div>
          {open && (
            <Lightbox
              mainSrc={images[index]}
              nextSrc={images[(index + 1) % images.length]}
              prevSrc={images[(index + images.length - 1) % images.length]}
              onCloseRequest={() => setOpen(false)}
              onMovePrevRequest={() => setIndex((index + images.length - 1) % images.length)}
              onMoveNextRequest={() => setIndex((index + 1) % images.length)}
              imageTitle={project.name}
              imageCaption={project.description}
              enableZoom={true}
            />
          )}
        </div>
      )}

      {/* Description */}
      {project.descriptionRich && (
        <div className="prose prose-lg mb-8 bg-white/80 rounded-xl p-6 shadow">
          <div dangerouslySetInnerHTML={{ __html: project.descriptionRich }} />
        </div>
      )}

      {/* Back Button */}
      <div className="text-center mt-8">
        <a
          href="/portfolio"
          className="inline-block bg-gray-100 hover:bg-blue-600 hover:text-white text-blue-700 px-8 py-3 rounded-lg text-lg font-medium transition-colors"
        >
          חזרה לכל הפרויקטים
        </a>
      </div>
    </main>
  );
} 