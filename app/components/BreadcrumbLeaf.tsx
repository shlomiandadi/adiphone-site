'use client';

import {
  createContext,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { usePathname } from 'next/navigation';

type Leaf = { path: string; title?: string };

const BreadcrumbLeafContext = createContext<{
  leafTitle?: string;
  setLeaf: (leaf: Leaf) => void;
}>({ setLeaf: () => undefined });

export function BreadcrumbLeafProvider({
  initialPath,
  initialTitle,
  children,
}: {
  initialPath: string;
  initialTitle?: string;
  children: ReactNode;
}) {
  const pathname = usePathname() || '/';
  const [leaf, setLeaf] = useState<Leaf>({ path: initialPath, title: initialTitle });
  const leafTitle = leaf.path === pathname ? leaf.title : undefined;
  const value = useMemo(() => ({ leafTitle, setLeaf }), [leafTitle]);

  return (
    <BreadcrumbLeafContext.Provider value={value}>{children}</BreadcrumbLeafContext.Provider>
  );
}

/** Pages that already loaded a real title pass it here so crumbs and JSON-LD stay in sync. */
export function SetBreadcrumbLeaf({ title }: { title: string }) {
  const pathname = usePathname() || '/';
  const { setLeaf } = useContext(BreadcrumbLeafContext);

  useLayoutEffect(() => {
    setLeaf({ path: pathname, title });
    return () => setLeaf({ path: pathname, title: undefined });
  }, [pathname, setLeaf, title]);

  return null;
}

export function useBreadcrumbLeafTitle() {
  return useContext(BreadcrumbLeafContext).leafTitle;
}
