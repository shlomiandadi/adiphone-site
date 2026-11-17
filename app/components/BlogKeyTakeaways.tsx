/** Answer sentences from the article aio-summary. Hidden when the post has none. */
export default function BlogKeyTakeaways({ items }: { items: string[] }) {
  if (!items.length) return null;

  return (
    <aside
      className="mb-8 rounded-2xl border border-[#22DEFB]/40 bg-[#02336E]/[0.04] p-6 text-right"
      aria-label="נקודות עיקריות"
    >
      <p className="mb-3 text-sm font-bold tracking-wide text-[#02336E]">נקודות עיקריות</p>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-gray-800">
            <span
              className="mt-1.5 inline-block h-2.5 w-2.5 flex-shrink-0 rounded-full bg-[#22DEFB]"
              aria-hidden
            />
            <span className="font-medium leading-relaxed text-[#02336E]">{item}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
