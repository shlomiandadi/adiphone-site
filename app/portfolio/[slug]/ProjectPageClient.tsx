"use client";
import { useEffect, useState, type ComponentType } from 'react';
import { optimizedImageUrl, responsiveAttributes } from '../../../lib/responsiveImage';

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

type CaseStudy = {
  challenge: string;
  solution: string;
  result: string;
};

export default function ProjectPageClient({
  project,
  caseStudy = null,
}: {
  project: Project;
  caseStudy?: CaseStudy | null;
}) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [Lightbox, setLightbox] = useState<ComponentType<Record<string, unknown>> | null>(null);

  const images = project.images || [];
  const lightboxSrc = (src: string) => optimizedImageUrl(src, 1600);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    void import('react-image-lightbox/style.css');
    void import('react-image-lightbox').then((mod) => {
      if (!cancelled) {
        const Loaded = mod.default as unknown as ComponentType<Record<string, unknown>>;
        setLightbox(() => Loaded);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [open]);

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      {/* Hero Section */}
      <div className="relative rounded-2xl overflow-hidden shadow-lg mb-8">
        {project.image && (
          <img
            alt={project.name}
            width={864}
            height={320}
            className="w-full h-80 object-cover"
            {...responsiveAttributes(project.image, {
              sizes: '(max-width: 896px) calc(100vw - 2rem), 864px',
              widths: [480, 640, 720, 828, 1200, 1600],
              priority: true,
            })}
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
                alt={project.name + ' image ' + (i + 1)}
                width={480}
                height={270}
                className="rounded-lg w-full object-cover aspect-video shadow hover:scale-105 transition-transform cursor-pointer"
                {...responsiveAttributes(img, {
                  sizes: '(max-width: 768px) 50vw, 280px',
                  widths: [320, 480, 640, 960],
                  crop: { ar: '16:9' },
                  fetchPriority: 'low',
                })}
                onClick={() => { setIndex(i); setOpen(true); }}
              />
            ))}
          </div>
          {open && Lightbox && (
            <Lightbox
              mainSrc={lightboxSrc(images[index])}
              nextSrc={lightboxSrc(images[(index + 1) % images.length])}
              prevSrc={lightboxSrc(images[(index + images.length - 1) % images.length])}
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

      {caseStudy && (caseStudy.challenge || caseStudy.solution || caseStudy.result) && (
        <section className="mb-8 rounded-xl bg-white/80 p-6 shadow" aria-label="סיפור מקרה">
          <h2 className="text-xl font-semibold mb-4">סיפור המקרה</h2>
          {caseStudy.challenge ? (
            <div className="mb-4">
              <h3 className="font-semibold text-gray-900 mb-1">האתגר</h3>
              <p className="text-gray-700 whitespace-pre-line">{caseStudy.challenge}</p>
            </div>
          ) : null}
          {caseStudy.solution ? (
            <div className="mb-4">
              <h3 className="font-semibold text-gray-900 mb-1">הפתרון</h3>
              <p className="text-gray-700 whitespace-pre-line">{caseStudy.solution}</p>
            </div>
          ) : null}
          {caseStudy.result ? (
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">התוצאה</h3>
              <p className="text-gray-700 whitespace-pre-line">{caseStudy.result}</p>
            </div>
          ) : null}
        </section>
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