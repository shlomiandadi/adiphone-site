import type { FaqItem } from '../../lib/faq';

export default function FaqAccordion({ items }: { items: FaqItem[] }) {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <details
          key={item.id}
          className="group rounded-xl border border-gray-100 bg-white shadow-sm transition-shadow open:shadow-md hover:shadow-md"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-right outline-none marker:content-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 [&::-webkit-details-marker]:hidden">
            <h2 className="m-0 min-w-0 flex-1 text-base font-semibold leading-snug text-gray-900 md:text-lg">
              {item.question}
            </h2>
            <span
              className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700 transition-transform duration-200 group-open:rotate-180"
              aria-hidden="true"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          </summary>
          <div className="border-t border-gray-100 px-5 pb-5">
            <p className="pt-4 leading-relaxed text-gray-600">{item.answer}</p>
          </div>
        </details>
      ))}
    </div>
  );
}
