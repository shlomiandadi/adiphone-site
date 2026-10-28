import type { ReactNode } from 'react';
import Link from 'next/link';
import Breadcrumbs from './Breadcrumbs';
import BusinessDetails from './BusinessDetails';
import {
  BUSINESS_PHONE_DISPLAY,
  BUSINESS_PHONE_HREF,
} from '../../lib/cms/footerData';

export type LegalTocItem = {
  id: string;
  label: string;
};

export function LegalSection({
  id,
  heading,
  children,
}: {
  id?: string;
  heading?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
      {heading ? (
        <h2 id={id} className="mb-2 scroll-mt-28 text-lg font-bold text-[#02336E]">
          {heading}
        </h2>
      ) : null}
      <div className="leading-relaxed text-gray-800 [&_a]:text-blue-700 [&_a]:underline-offset-2 [&_a]:hover:underline">
        {children}
      </div>
    </section>
  );
}

function LegalTableOfContents({ items }: { items: LegalTocItem[] }) {
  if (items.length === 0) return null;

  const list = (
    <ol className="space-y-1 text-sm">
      {items.map((item) => (
        <li key={item.id}>
          <a
            href={`#${item.id}`}
            className="block rounded-md px-3 py-2 text-gray-700 hover:bg-slate-100 hover:text-[#02336E] focus-visible:bg-slate-100"
          >
            {item.label}
          </a>
        </li>
      ))}
    </ol>
  );

  return (
    <nav aria-label="תוכן עניינים" className="legal-toc">
      <details className="rounded-2xl border border-slate-200 bg-white shadow-sm lg:hidden">
        <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-[#02336E]">
          תוכן עניינים
        </summary>
        <div className="border-t border-slate-100 px-2 py-2">{list}</div>
      </details>
      <div className="sticky top-28 hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:block">
        <p className="mb-3 text-sm font-semibold text-[#02336E]">תוכן עניינים</p>
        {list}
      </div>
    </nav>
  );
}

export default function LegalPageLayout({
  title,
  lastUpdated,
  toc,
  children,
  showBusinessDetails = false,
}: {
  title: string;
  lastUpdated?: string;
  toc: LegalTocItem[];
  children: ReactNode;
  showBusinessDetails?: boolean;
}) {
  return (
    <div className="legal-page bg-slate-50" dir="rtl">
      <header className="legal-page-header bg-gradient-to-l from-[#02336E] via-[#034a8c] to-[#02336E]">
        <div className="mx-auto max-w-6xl px-4 py-6 md:py-8">
          <Breadcrumbs />
          <h1 className="text-3xl font-bold text-white">{title}</h1>
          {lastUpdated ? (
            <p className="mt-2 text-sm text-white/80">{lastUpdated}</p>
          ) : null}
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8 md:py-10">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,16rem)_minmax(0,1fr)] lg:items-start">
          <LegalTableOfContents items={toc} />
          <div className="space-y-4">{children}</div>
        </div>

        <aside
          className="mt-8 rounded-2xl border border-[#22DEFB]/50 bg-[#02336E] p-6 text-white shadow-sm md:p-8"
          aria-label="צור קשר"
        >
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/contact"
              className="inline-flex rounded-lg bg-[#22DEFB] px-4 py-2 text-sm font-semibold text-[#02336E] hover:bg-cyan-200"
            >
              צור קשר
            </Link>
            <a
              href={BUSINESS_PHONE_HREF}
              className="text-sm font-medium text-white underline decoration-[#22DEFB] underline-offset-4 hover:text-[#22DEFB]"
              dir="ltr"
            >
              {BUSINESS_PHONE_DISPLAY}
            </a>
          </div>
          {showBusinessDetails ? (
            <div className="mt-4 text-white [&_address]:text-white [&_a]:text-[#22DEFB]">
              <BusinessDetails variant="page" />
            </div>
          ) : null}
        </aside>
      </div>
    </div>
  );
}
