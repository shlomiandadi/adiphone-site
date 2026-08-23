import Link from 'next/link';
import { BLOG_META_OVERRIDES } from '../../lib/seo';

export default function RelatedServiceCTA({ slug }: { slug: string }) {
  const override = BLOG_META_OVERRIDES[slug];
  if (!override) return null;

  return (
    <aside className="mt-12 rounded-xl border border-blue-100 bg-blue-50 p-6 text-right">
      <p className="text-sm font-medium text-blue-800 mb-2">מחפשים ליווי מקצועי?</p>
      <p className="text-gray-700 mb-4">
        המדריך הזה משלים את השירות שלנו. לעבודה מלאה מול צוות מומחים:
      </p>
      <Link
        href={override.relatedService}
        className="inline-flex items-center font-semibold text-blue-700 hover:text-blue-900 underline-offset-4 hover:underline"
      >
        {override.relatedLabel}
        <span className="mr-2" aria-hidden>
          ←
        </span>
      </Link>
    </aside>
  );
}
