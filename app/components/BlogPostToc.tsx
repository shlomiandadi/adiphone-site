import type { BlogHeading } from '../../lib/blog-article-enhance';

function TocList({ headings }: { headings: BlogHeading[] }) {
  return (
    <nav aria-label="תוכן עניינים">
      <ul className="space-y-1">
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              className={`block rounded px-3 py-2 text-sm text-gray-600 hover:bg-[#02336E]/5 hover:text-[#02336E] ${
                heading.level > 2 ? 'text-[13px]' : 'font-medium'
              }`}
              style={{ paddingInlineStart: `${(heading.level - 2) * 12 + 12}px` }}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default function BlogPostToc({
  headings,
  variant = 'all',
}: {
  headings: BlogHeading[];
  variant?: 'mobile' | 'desktop' | 'all';
}) {
  if (headings.length === 0) return null;

  const mobile = variant === 'mobile' || variant === 'all';
  const desktop = variant === 'desktop' || variant === 'all';

  return (
    <>
      {mobile ? (
        <details className="blog-toc-mobile mb-8 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm lg:hidden">
          <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 font-semibold text-[#02336E]">
            <span>תוכן עניינים</span>
            <span className="blog-toc-chevron text-[#22DEFB]" aria-hidden>
              ▾
            </span>
          </summary>
          <div className="border-t border-gray-100 px-2 py-3">
            <TocList headings={headings} />
          </div>
        </details>
      ) : null}

      {desktop ? (
        <aside className="blog-toc-desktop hidden lg:block">
          <div className="sticky top-24 w-64 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <p className="border-b border-gray-200 px-4 py-3 font-semibold text-[#02336E]">
              תוכן עניינים
            </p>
            <div className="max-h-[28rem] overflow-y-auto p-2">
              <TocList headings={headings} />
            </div>
          </div>
        </aside>
      ) : null}
    </>
  );
}
