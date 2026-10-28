import type { Context } from 'https://edge.netlify.com';

const STYLE_ID = 'blog-critical-css';
const STYLESHEET_LINK =
  /<link\b(?=[^>]*\brel=["']stylesheet["'])(?![^>]*\bmedia=["']print["'])[^>]*>/gi;

function withPrintSwap(tag: string): string {
  let next = tag;
  if (/\bmedia=/.test(next)) {
    next = next.replace(/\bmedia=["'][^"']*["']/, 'media="print"');
  } else {
    next = next.replace(/<link\b/, '<link media="print"');
  }
  if (!/\bonload=/.test(next)) {
    next = next.replace(/<link\b/, '<link onload="this.media=\'all\'"');
  }
  return `${next}<noscript>${tag}</noscript>`;
}

export default async function blogDeferCss(request: Request, context: Context) {
  const url = new URL(request.url);
  if (!/^\/blog\/(?!tag\/|category\/)[^/]+\/?$/.test(url.pathname)) {
    return context.next();
  }

  const response = await context.next();
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('text/html')) return response;

  const html = await response.text();
  if (!html.includes(`id="${STYLE_ID}"`) && !html.includes(`id='${STYLE_ID}'`)) {
    return new Response(html, response);
  }

  const next = html.replace(STYLESHEET_LINK, withPrintSwap);
  return new Response(next, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  });
}
