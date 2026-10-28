import type { BlogHeading } from '../../lib/blog-article-enhance';

/** Shown only when enough H2s exist to list as section takeaways — no invented copy. */
export default function BlogKeyTakeaways({ headings }: { headings: BlogHeading[] }) {
  if (headings.length < 3) return null;
  const items = headings.slice(0, 6);

  return (
    <aside
      className="mb-8 rounded-2xl border border-[#22DEFB]/40 bg-[#02336E]/[0.04] p-6 text-right"
      aria-label="נקודות עיקריות"
    >
      <p className="mb-3 text-sm font-bold tracking-wide text-[#02336E]">נקודות עיקריות</p>
      <ul className="space-y-2">
        {items.map((heading) => (
          <li key={heading.id} className="flex items-start gap-2 text-gray-800">
            <span
              className="mt-1 inline-block h-2.5 w-2.5 flex-shrink-0 rounded-full bg-[#22DEFB]"
              aria-hidden
            />
            <a href={`#${heading.id}`} className="font-medium text-[#02336E] hover:underline">
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
