import Link from 'next/link';
import { relatedArticleLinks } from '../../lib/related-content';

export default function RelatedArticleLinks({ slug, category }: { slug: string; category?: string }) {
  const links = relatedArticleLinks(slug, category);
  if (links.length === 0) return null;

  return (
    <aside className="mt-10 rounded-xl border border-gray-100 bg-gray-50 p-6 text-right">
      <p className="text-sm font-medium text-gray-800 mb-3">עוד באתר</p>
      <ul className="space-y-2">
        {links.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className="font-semibold text-blue-700 underline">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
