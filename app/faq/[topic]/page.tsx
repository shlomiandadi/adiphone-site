import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SetBreadcrumbLeaf } from '../../components/BreadcrumbLeaf';
import FaqAccordion from '../../components/FaqAccordion';
import PageBreadcrumbJsonLd from '../../components/PageBreadcrumbJsonLd';
import {
  FAQ_FILE_SLUGS,
  faqMetaDescription,
  faqPageJsonLd,
  getFaqTopic,
  relatedPagesForTopic,
  siblingTopics,
} from '../../../lib/faq';

export const dynamic = 'force-static';
export const dynamicParams = false;
export const revalidate = false;

type PageProps = {
  params: { topic: string };
};

export function generateStaticParams() {
  return FAQ_FILE_SLUGS.map((topic) => ({ topic }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const data = getFaqTopic(params.topic);
  if (!data) {
    return { title: 'שאלות נפוצות' };
  }
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
    },
    twitter: {
      description,
    },
  };
}

export default function FaqTopicPage({ params }: PageProps) {
  const data = getFaqTopic(params.topic);
  if (!data) notFound();

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
