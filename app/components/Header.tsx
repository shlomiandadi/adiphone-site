import { Suspense } from 'react';
import type { NavigationItem } from './navigation-data';
import ClientHeader from './ClientHeader';

export default function Header({ items }: { items?: NavigationItem[] | null }) {
  return (
    <Suspense fallback={
      <div className="site-header pointer-events-none fixed top-0 left-0 right-0 z-50 h-[4.5rem] md:h-20" aria-hidden="true" />
    }>
      <ClientHeader items={items} />
    </Suspense>
  );
}
