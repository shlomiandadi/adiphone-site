import type { ReactNode } from 'react';

export const dynamic = 'force-static';
export const revalidate = false;

export default function FaqLayout({ children }: { children: ReactNode }) {
  return children;
}
