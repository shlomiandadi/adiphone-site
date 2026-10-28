import '../prose.css';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getCmsPageBySlug } from '../../lib/cms/pages';
import { isCmsEnabled } from '../../lib/cms/enabled';
import { mergeCmsMetadata } from '../../lib/cms/seo';

type PageProps = {
  params: { slug: string[] };
};

export const dynamicParams = true;

export function generateStaticParams() {
  return [];
}

function pathFromParams(slug: string[]) {
  return `/${slug.join('/')}`;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const path = pathFromParams(params.slug);
  const page = await getCmsPageBySlug(path);
  if (!page) return {};
  const base: Metadata = {
    title: page.metaTitle || page.title,
    description: page.metaDesc || page.excerpt || undefined,
    alternates: page.metaCanonical ? { canonical: page.metaCanonical } : { canonical: path },
  };
  return mergeCmsMetadata(path, base);
}

export default async function CmsCatchAllPage({ params }: PageProps) {
  const path = pathFromParams(params.slug);
  const page = await getCmsPageBySlug(path);
  if (!page) notFound();

  const sections =
    page.cmsTemplate && isCmsEnabled(page.cmsTemplate)
      ? (page.cmsTemplate.sections || []).filter((section) => isCmsEnabled(section))
      : [];

  const faqSection = sections.find((section) => section.type === 'faq');
  const faqContent =
    faqSection && faqSection.content && typeof faqSection.content === 'object'
      ? (faqSection.content as { questions?: { question: string; answer: string }[] })
      : null;

  return (
    <article className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-6">{page.heroTitle || page.title}</h1>
      {page.heroSubtitle ? <p className="text-lg text-gray-600 mb-8">{page.heroSubtitle}</p> : null}
      {page.content ? (
        <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: page.content }} />
      ) : null}
      {faqContent?.questions && faqContent.questions.length > 0 ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: faqContent.questions.map((item) => ({
                '@type': 'Question',
                name: item.question,
                acceptedAnswer: { '@type': 'Answer', text: item.answer },
              })),
            }),
          }}
        />
      ) : null}
    </article>
  );
}
