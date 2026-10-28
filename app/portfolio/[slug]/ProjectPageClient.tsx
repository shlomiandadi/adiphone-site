import Link from 'next/link';
import { responsiveAttributes } from '../../../lib/responsiveImage';
import ProjectGallery from './ProjectGallery';

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

export default function ProjectPageClient({
  project,
  caseStudy = null,
  relatedService = null,
}: {
  project: Project;
  caseStudy?: CaseStudy | null;
  relatedService?: RelatedService | null;
}) {
  const images = project.images || [];
  const caseStudySteps = caseStudy
    ? [
        caseStudy.challenge ? { title: 'האתגר', description: caseStudy.challenge } : null,
        caseStudy.solution ? { title: 'הפתרון', description: caseStudy.solution } : null,
        caseStudy.result ? { title: 'התוצאה', description: caseStudy.result } : null,
      ].filter((step): step is { title: string; description: string } => Boolean(step))
    : [];

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="relative mb-8 overflow-hidden rounded-2xl shadow-lg">
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
        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 via-black/20 to-transparent p-8">
          <h1 className="mb-2 text-4xl font-bold text-white drop-shadow">{project.name}</h1>
          {(relatedService || (project.technologies && project.technologies.length > 0)) && (
            <div className="mb-2 flex flex-wrap gap-2">
              {relatedService ? (
                <Link
                  href={relatedService.serviceHref}
                  className="rounded-full bg-blue-600/80 px-3 py-1 text-sm font-medium text-white shadow"
                >
                  {relatedService.serviceLabel}
                </Link>
              ) : null}
              {(project.technologies || []).map((tech, i) => (
                <span key={i} className="rounded-full bg-blue-600/80 px-3 py-1 text-sm font-medium text-white shadow">
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
              className="inline-block w-fit min-w-fit rounded-lg bg-white/90 px-6 py-2 font-semibold text-blue-700 transition hover:bg-blue-700 hover:text-white"
            >
              מעבר לאתר הפרויקט
            </a>
          )}
        </div>
      </div>

      <ProjectGallery name={project.name} description={project.description} images={images} />

      {caseStudySteps.length > 0 && (
        <section className="mb-8 rounded-xl bg-white/80 p-6 shadow" aria-label="סיפור מקרה">
          <h2 className="mb-4 text-xl font-semibold">סיפור המקרה</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {caseStudySteps.map((step, index) => (
              <blockquote key={step.title} className="rounded-2xl border border-gray-100 bg-gray-50 p-6 text-right shadow-sm">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white tabular-nums">
                  {index + 1}
                </div>
                <h3 className="mb-1 font-semibold text-gray-900">{step.title}</h3>
                <p className="text-gray-700 whitespace-pre-line">{step.description}</p>
              </blockquote>
            ))}
          </div>
        </section>
      )}

      {project.descriptionRich && (
        <div className="prose prose-lg mb-8 rounded-xl bg-white/80 p-6 shadow">
          <div dangerouslySetInnerHTML={{ __html: project.descriptionRich }} />
        </div>
      )}

      <div className="mt-8">
        <Link
          href="/portfolio"
          className="inline-flex items-center gap-2 font-medium text-blue-700 underline-offset-4 hover:underline"
        >
          <span aria-hidden>→</span>
          חזרה לכל הפרויקטים
        </Link>
      </div>
    </div>
  );
}
