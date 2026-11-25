import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SetBreadcrumbLeaf } from '../../components/BreadcrumbLeaf';
import FaqAccordion from '../../components/FaqAccordion';
import PageBreadcrumbJsonLd from '../../components/PageBreadcrumbJsonLd';
import {
  KNOWN_FAQ_SLUGS,
  faqMetaDescription,
  faqPageJsonLd,
  isFaqTopic,
  normalizeFaqTopicParam,
  requireFaqTopic,
  relatedPagesForTopic,
  siblingTopics,
} from '../../../lib/faq';
import { DEFAULT_OG_IMAGE } from '../../../lib/seo';

export const dynamic = 'force-static';
// true: if the Netlify handler drops the prerender manifest, known slugs still render 200.
// false 404s every /faq/[topic] after ISR even when the page HTML was built (PR 155 regression).
export const dynamicParams = true;
export const revalidate = false;

type PageProps = {
  params: { topic: string };
};

export function generateStaticParams() {
  return KNOWN_FAQ_SLUGS.map((topic) => ({ topic }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const slug = normalizeFaqTopicParam(params.topic);
  if (!isFaqTopic(slug)) {
    return { title: 'שאלות נפוצות' };
  }
  const data = requireFaqTopic(slug);
  const path = `https://adi-phone.co.il/faq/${data.topic}`;
  const description = faqMetaDescription(data);
  return {
    title: `${data.titleHe} — שאלות נפוצות`,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title: `${data.titleHe} — שאלות נפוצות | Top Webstak`,
      description,
      url: path,
      type: 'website',
      locale: 'he_IL',
      siteName: 'Top Webstak',
      images: [DEFAULT_OG_IMAGE],
    },
    twitter: {
      description,
    },
  };
}

export default function FaqTopicPage({ params }: PageProps) {
  const slug = normalizeFaqTopicParam(params.topic);
  // Known slugs must not call notFound(): Netlify Durable caches that 404.
  if (!isFaqTopic(slug)) notFound();
  const data = requireFaqTopic(slug);

  const related = relatedPagesForTopic(data.topic);
  const siblings = siblingTopics(data.topic, 3);
  const pathname = `/faq/${data.topic}`;
  const schema = faqPageJsonLd(data.items);

  return (
    <div className="bg-gray-50">
      <SetBreadcrumbLeaf title={data.titleHe} />
      <PageBreadcrumbJsonLd pathname={pathname} leafTitle={data.titleHe} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <section className="bg-gradient-to-b from-white to-gray-50 px-4 pb-8 pt-6">
        <div className="container mx-auto max-w-3xl">
          <p className="mb-3 text-sm text-blue-700">
            <Link href="/faq" className="hover:underline">
              לכל השאלות הנפוצות
            </Link>
          </p>
          <h1 className="mb-3 text-3xl font-bold text-gray-900 md:text-4xl">{data.titleHe}</h1>
          <p className="text-lg leading-relaxed text-gray-600">{data.descriptionHe}</p>
        </div>
      </section>

      <section className="px-4 pb-12" aria-label={data.titleHe}>
        <div className="container mx-auto max-w-3xl">
          <FaqAccordion items={data.items} />
        </div>
      </section>

      <section className="px-4 pb-16">
        <div className="container mx-auto grid max-w-3xl gap-8 md:grid-cols-2">
          <div>
            <h2 className="mb-3 text-lg font-semibold text-gray-900">עמודים קשורים</h2>
            <ul className="space-y-2">
              {related.map((link) => (
                <li key={link.href}>
                  {link.external ? (
                    <a
                      href={link.href}
                      className="text-blue-700 underline-offset-4 hover:underline"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link href={link.href} className="text-blue-700 underline-offset-4 hover:underline">
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="mb-3 text-lg font-semibold text-gray-900">נושאים נוספים</h2>
            <ul className="space-y-2">
              {siblings.map((topic) => (
                <li key={topic.topic}>
                  <Link
                    href={`/faq/${topic.topic}`}
                    className="text-blue-700 underline-offset-4 hover:underline"
                  >
                    {topic.titleHe}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
