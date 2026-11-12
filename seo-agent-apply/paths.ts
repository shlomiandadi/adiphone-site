/** Normalize a URL or pathname to a site-relative path (`/`, `/blog/slug`). */
export function normalizeSeoAgentPath(input: string | null | undefined): string {
  if (!input) return '/';

  let path = input.trim();
  try {
    if (/^https?:\/\//i.test(path)) {
      path = new URL(path).pathname;
    }
  } catch {
    // keep the raw value
  }

  const queryIndex = path.indexOf('?');
  if (queryIndex >= 0) path = path.slice(0, queryIndex);
  const hashIndex = path.indexOf('#');
  if (hashIndex >= 0) path = path.slice(0, hashIndex);

  if (!path.startsWith('/')) path = `/${path}`;
  if (path.length > 1) path = path.replace(/\/+$/, '');
  return path || '/';
}

/** Paths whose title/meta/FAQ/schema may only change in code, never via webhook. */
export function isSeoAgentProtectedPath(path: string): boolean {
  return (
    path.startsWith('/api/') ||
    path.startsWith('/admin') ||
    path.startsWith('/_next/') ||
    path === '/api' ||
    path === '/services' ||
    path.startsWith('/services/')
  );
}
