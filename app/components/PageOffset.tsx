'use client';

import { usePathname } from 'next/navigation';

export default function PageOffset({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname === '/') return null;

  return (
    <div className="page-offset bg-gray-50 pt-[6rem] md:pt-[7rem]">
      {children}
    </div>
  );
}
