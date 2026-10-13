import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * The Netlify "Prerender" extension rewrites crawler / link-preview requests
 * (facebookexternalhit, Instagram, etc.) to /netlify-prerender-function?url=...
 * Its function route is shadowed by the Next.js catch-all server handler, so
 * Next answered with its 404 page. Our pages are already server-rendered, so
 * this handler simply returns the real page HTML for the requested URL.
 */
const BROWSER_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';

export async function GET(request: NextRequest) {
  const target = request.nextUrl.searchParams.get('url');
  const expected = process.env.NETLIFY_PRERENDER_AUTH_TOKEN?.trim();
  const token = request.headers.get('x-prerender-token')?.trim();

  if (!target || (expected && token !== expected)) {
    return new Response('Not found', { status: 404 });
  }

  let url: URL;
  try {
    url = new URL(target);
  } catch {
    return new Response('Bad request', { status: 400 });
  }
  if (url.host !== request.nextUrl.host || url.pathname.startsWith('/netlify-prerender-function')) {
    return new Response('Forbidden', { status: 403 });
  }

  const upstream = await fetch(url.toString(), {
    headers: { 'user-agent': BROWSER_UA, accept: 'text/html' },
    redirect: 'manual',
    cache: 'no-store',
  });

  const headers = new Headers();
  for (const name of ['content-type', 'location', 'cache-control', 'x-robots-tag']) {
    const value = upstream.headers.get(name);
    if (value) headers.set(name, value);
  }
  return new Response(upstream.body, { status: upstream.status, headers });
}
