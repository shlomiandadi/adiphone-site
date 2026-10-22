import { NextRequest } from 'next/server';
import { prerenderOutboundHeaders } from '../../lib/prerender-headers';

export const dynamic = 'force-dynamic';

/**
 * The Netlify "Prerender" extension rewrites crawler / link-preview requests
 * (facebookexternalhit, Instagram, GPTBot, …) to /netlify-prerender-function?url=...
 * Its function route is shadowed by the Next.js catch-all server handler, so
 * Next answered with its 404 page. Our pages are already server-rendered, so
 * this handler simply returns the real page HTML for the requested URL.
 *
 * Do not compare against request.nextUrl.host: inside the Netlify function
 * that is an internal host, which 403'd production bots.
 *
 * Never copy upstream Cache-Control. The opengraph-image metadata route sends
 * public, max-age=31536000, immutable. @netlify/plugin-nextjs 5.16.2 varies
 * query only on __nextDataReq|_rsc, so inheriting those headers cached the PNG
 * under this shared path for every crawler page URL.
 */
const BROWSER_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';

const STATIC_ALLOWED_HOSTS = new Set(['adi-phone.co.il', 'www.adi-phone.co.il']);

function hostnameOf(value: string): string {
  return value.split(',')[0].trim().split(':')[0].toLowerCase();
}

function isAllowedHost(hostname: string, request: NextRequest): boolean {
  const host = hostname.toLowerCase();
  if (STATIC_ALLOWED_HOSTS.has(host)) return true;
  if (host === 'adi-phone.netlify.app' || host.endsWith('--adi-phone.netlify.app')) return true;

  const forwarded = request.headers.get('x-forwarded-host');
  const headerHost = request.headers.get('host');
  if (forwarded && hostnameOf(forwarded) === host) return true;
  if (headerHost && hostnameOf(headerHost) === host) return true;
  return false;
}

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
  if (!isAllowedHost(url.hostname, request) || url.pathname.startsWith('/netlify-prerender-function')) {
    return new Response('Forbidden', { status: 403 });
  }

  const upstreamUrl = `https://${url.hostname}${url.pathname}${url.search}`;
  const upstream = await fetch(upstreamUrl, {
    headers: { 'user-agent': BROWSER_UA, accept: 'text/html' },
    redirect: 'manual',
    cache: 'no-store',
  });

  const headers = prerenderOutboundHeaders({
    contentType: upstream.headers.get('content-type'),
    location: upstream.headers.get('location'),
    robotsTag: upstream.headers.get('x-robots-tag'),
  });
  return new Response(upstream.body, { status: upstream.status, headers });
}
