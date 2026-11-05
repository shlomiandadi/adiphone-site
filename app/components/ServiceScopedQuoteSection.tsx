import Link from 'next/link';

export type ServiceQuoteFactor = {
  title: string;
  text: string;
};

type ServiceScopedQuoteSectionProps = {
  headingId: string;
  heading: string;
  intro: string;
  factors: readonly ServiceQuoteFactor[];
  footerText: string;
  ctaLocation: string;
  ctaLabel?: string;
};

export default function ServiceScopedQuoteSection({
  headingId,
  heading,
  intro,
  factors,
  footerText,
  ctaLocation,
  ctaLabel = 'קבלו הצעת מחיר',
}: ServiceScopedQuoteSectionProps) {
  return (
    <section
      className="bg-gradient-to-b from-gray-50 to-white px-4 py-16 dark:from-gray-900 dark:to-gray-800"
      aria-labelledby={headingId}
    >
      <div className="container mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2
            id={headingId}
            className="mb-4 text-3xl font-bold text-gray-900 dark:text-white md:text-4xl"
          >
            {heading}
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400">{intro}</p>
        </div>

        <ul
          className={`mx-auto grid max-w-5xl gap-8 ${
            factors.length === 4 ? 'md:grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-3'
          }`}
        >
          {factors.map((factor) => (
            <li
              key={factor.title}
              className="flex h-full flex-col rounded-2xl bg-white p-8 shadow-xl dark:bg-gray-800"
            >
              <h3 className="mb-3 text-xl font-bold text-gray-900 dark:text-white">{factor.title}</h3>
              <p className="text-gray-700 dark:text-gray-300">{factor.text}</p>
            </li>
          ))}
        </ul>

        <div className="mt-12 text-center">
          <p className="mb-4 text-gray-600 dark:text-gray-400">{footerText}</p>
          <Link
            href="/contact"
            data-cta="true"
            data-cta-location={ctaLocation}
            className="inline-block rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
          >
            {ctaLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
