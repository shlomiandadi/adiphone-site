"use client";
import { useEffect, useState, type ComponentType } from 'react';
import Link from 'next/link';
import { lightboxImageUrl, responsiveAttributes } from '../../../lib/responsiveImage';

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

type RelatedService = {
  serviceHref: string;
  serviceLabel: string;
};

function TechChip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-[#22DEFB]/40 bg-white px-3 py-1 text-sm font-medium text-[#02336E] shadow-sm">
      {label}
    </span>
  );
}

export default function ProjectPageClient({
  project,
  caseStudy = null,
  relatedService = null,
}: {
  project: Project;
  caseStudy?: CaseStudy | null;
  relatedService?: RelatedService | null;
}) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [Lightbox, setLightbox] = useState<ComponentType<Record<string, unknown>> | null>(null);
  const [originalFallback, setOriginalFallback] = useState<Record<string, true>>({});

  const images = project.images || [];
  const lightboxSrc = (src: string) => (originalFallback[src] ? src : lightboxImageUrl(src, 1600));
  const caseStudySteps = caseStudy
    ? [
        caseStudy.challenge ? { title: 'האתגר', description: caseStudy.challenge } : null,
        caseStudy.solution ? { title: 'הפתרון', description: caseStudy.solution } : null,
        caseStudy.result ? { title: 'התוצאה', description: caseStudy.result } : null,
      ].filter((step): step is { title: string; description: string } => Boolean(step))
    : [];

  const handleImageLoadError = (imageSrc: string) => {
    const original = images.find((img) => img === imageSrc || lightboxImageUrl(img, 1600) === imageSrc);
    if (!original || original === imageSrc || originalFallback[original]) return;
    setOriginalFallback((prev) => (prev[original] ? prev : { ...prev, [original]: true }));
  };

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
    <div className="mx-auto max-w-5xl px-4 py-12 md:py-16">
      <div className="relative mb-10 overflow-hidden rounded-2xl shadow-lg">
        {project.image && (
          <img
            alt={project.name}
            width={864}
            height={320}
            className="h-80 w-full object-cover"
            {...responsiveAttributes(project.image, {
              sizes: '(max-width: 896px) calc(100vw - 2rem), 864px',
              widths: [480, 640, 720, 828, 1200, 1600],
              priority: true,
              coverIfTallerThan: '4:5',
            })}
          />
        )}
        <div
          className="absolute inset-0 flex flex-col justify-end p-6 md:p-8"
          style={{
            background:
              'linear-gradient(to top, rgba(2, 51, 110, 0.82) 0%, rgba(2, 51, 110, 0.28) 45%, transparent 100%)',
          }}
        >
          <h1 className="mb-3 text-3xl font-bold text-white drop-shadow md:text-4xl">{project.name}</h1>
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block w-fit min-w-fit rounded-lg bg-white/90 px-6 py-2 font-semibold text-blue-700 transition hover:bg-[#22DEFB] hover:text-[#02336E]"
            >
              מעבר לאתר הפרויקט
            </a>
          )}
        </div>
      </div>

      {(relatedService || (project.technologies && project.technologies.length > 0)) && (
        <section className="mb-10 overflow-hidden rounded-lg bg-white shadow-lg">
          <div className="p-6 md:p-8">
            <div className="flex flex-wrap gap-2">
              {relatedService ? (
                <Link
                  href={relatedService.serviceHref}
                  className="inline-flex items-center rounded-full bg-[#02336E] px-3 py-1 text-sm font-medium text-white shadow-sm"
                >
                  {relatedService.serviceLabel}
                </Link>
              ) : null}
              {(project.technologies || []).map((tech, i) => (
                <TechChip key={i} label={tech} />
              ))}
            </div>
          </div>
        </section>
      )}

      {images.length > 0 && (
        <div className="mb-10">
          <h2 className="mb-4 text-xl font-semibold">גלריית תמונות</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {images.map((img, i) => (
              <img
                key={i}
                alt={project.name + ' image ' + (i + 1)}
                width={480}
                height={270}
                className="aspect-video w-full cursor-pointer rounded-lg object-cover shadow transition-transform hover:scale-105"
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
              onImageLoadError={handleImageLoadError}
            />
          )}
        </div>
      )}

      {caseStudySteps.length > 0 && (
        <section className="relative mb-10 overflow-hidden rounded-lg bg-gray-50 py-10 shadow-lg" aria-label="סיפור מקרה">
          <div className="px-6 md:px-8">
            <h2 className="mb-8 text-center text-xl font-semibold">סיפור המקרה</h2>
            <div className="relative">
              <div className="absolute left-0 right-0 top-6 hidden h-1 -translate-y-1/2 bg-[#22DEFB]/40 md:block" />
              <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                {caseStudySteps.map((step, index) => (
                  <div key={step.title} className="relative">
                    <div className="relative z-10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#02336E] text-xl font-bold text-white tabular-nums">
                      <span>{index + 1}</span>
                    </div>
                    <blockquote className="rounded-2xl border border-gray-100 bg-white p-6 text-right shadow-sm">
                      <h3 className="mb-2 text-xl font-bold">{step.title}</h3>
                      <p className="leading-relaxed text-gray-700 whitespace-pre-line">{step.description}</p>
                    </blockquote>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {project.descriptionRich && (
        <div className="mb-10 overflow-hidden rounded-lg bg-white shadow-lg">
          <blockquote className="border-r-4 border-[#22DEFB] p-6 text-right md:p-8">
            <div className="prose prose-lg max-w-none leading-relaxed text-gray-700">
              <div dangerouslySetInnerHTML={{ __html: project.descriptionRich }} />
            </div>
          </blockquote>
        </div>
      )}

      <div className="mt-4 text-right">
        <Link
          href="/portfolio"
          className="inline-flex min-h-12 items-center gap-2 font-semibold text-[#02336E] underline-offset-4 transition-colors hover:text-blue-700 hover:underline"
        >
          <span aria-hidden>→</span>
          חזרה לכל הפרויקטים
        </Link>
      </div>
    </div>
  );
}
