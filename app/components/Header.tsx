import { Suspense } from 'react';
import { getHeaderMenu } from '../../lib/cms/navigation';
import ClientHeader from './ClientHeader';

export default async function Header() {
  const items = await getHeaderMenu();
  return (
    <Suspense fallback={
      <div className="site-header pointer-events-none fixed top-0 left-0 right-0 z-50 h-[4.5rem] md:h-20" aria-hidden="true" />
    }>
      <ClientHeader items={items} />
    </Suspense>
  );
}
