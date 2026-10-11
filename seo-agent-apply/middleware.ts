import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isSeoAgentProtectedPath, normalizeSeoAgentPath } from './paths';
import { getSeoAgentRedirects } from './store';

function resolveDestination(to: string, request: NextRequest): URL {
  if (/^https?:\/\//i.test(to)) return new URL(to);
  return new URL(to, request.url);
}

/**
 * Apply SEO Agent 301/302 redirects from Netlify Blobs.
 * Existing next.config.js / netlify.toml redirects stay in place.
 */
export async function applySeoAgentRedirects(
  request: NextRequest
): Promise<NextResponse | null> {
  const path = normalizeSeoAgentPath(request.nextUrl.pathname);
  if (isSeoAgentProtectedPath(path)) return null;

  try {
    const redirects = await getSeoAgentRedirects();
    const match = redirects.find((item) => normalizeSeoAgentPath(item.from) === path);
    if (!match) return null;

    const destination = resolveDestination(match.to, request);
    if (destination.pathname === path && destination.origin === request.nextUrl.origin) {
      return null;
    }

    return NextResponse.redirect(destination, match.status === 302 ? 302 : 301);
  } catch {
    return null;
  }
}
