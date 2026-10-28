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

/** One TOC in the DOM. Mobile is a details accordion; lg+ is the sticky sidebar. */
export default function BlogPostToc({ headings }: { headings: BlogHeading[] }) {
  if (headings.length === 0) return null;

  return (
    <aside className="blog-toc-root mx-auto mb-8 w-full max-w-[42rem] lg:mx-0 lg:mb-0 lg:w-64 lg:max-w-none lg:flex-shrink-0">
      <details className="blog-toc overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm lg:sticky lg:top-24">
        <summary className="blog-toc-summary flex cursor-pointer list-none items-center justify-between px-4 py-3 font-semibold text-[#02336E]">
          <span>תוכן עניינים</span>
          <span className="blog-toc-chevron text-[#22DEFB]" aria-hidden>
            ▾
          </span>
        </summary>
        <div className="blog-toc-panel border-t border-gray-100 px-2 py-3">
          <TocList headings={headings} />
        </div>
      </details>
    </aside>
  );
}
