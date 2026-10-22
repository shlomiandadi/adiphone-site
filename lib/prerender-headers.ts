/**
 * Cache headers for /netlify-prerender-function.
 *
 * The Netlify Prerender extension rewrites crawler UAs (facebookexternalhit,
 * WhatsApp, GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, LinkedInBot,
 * Twitterbot, Slackbot, …) to this one path with the original URL in `?url=`.
 *
 * @netlify/plugin-nextjs 5.16.2 then sets Netlify-Vary to query=__nextDataReq|_rsc
 * only. It does not vary on `url`, so every crawler request shares one CDN
 * object. Next.js metadata routes (app/opengraph-image.png, opengraph-image.tsx)
 * answer with Cache-Control: public, max-age=31536000, immutable. Copying that
 * onto this shared path stores the 1200x630 PNG under every page URL for a year.
 */

const OG_IMAGE_PATH = /(?:^|\/)opengraph-image\/?$/i;
const STATIC_IMAGE_PATH = /\.(?:avif|gif|ico|jpe?g|png|svg|webp)$/i;

export function isOgImagePath(pathname: string): boolean {
  return OG_IMAGE_PATH.test(pathname);
}

export function isImagePath(pathname: string): boolean {
  return isOgImagePath(pathname) || STATIC_IMAGE_PATH.test(pathname);
}

export function isHtmlContentType(value: string | null | undefined): boolean {
  return typeof value === 'string' && /^text\/html\b/i.test(value);
}

export function prerenderOutboundHeaders(input: {
  contentType: string | null;
  location?: string | null;
  robotsTag?: string | null;
}): Headers {
  const headers = new Headers();
  if (input.contentType) headers.set('content-type', input.contentType);
  if (input.location) headers.set('location', input.location);
  if (input.robotsTag) headers.set('x-robots-tag', input.robotsTag);

  // Must include url: the plugin merges this into Netlify-Vary and otherwise
  // ignores the prerender target when building the CDN cache key.
  headers.set('Netlify-Vary', 'query=url');

  if (isHtmlContentType(input.contentType)) {
    headers.set('Cache-Control', 'public, max-age=0, must-revalidate');
    headers.set('Netlify-CDN-Cache-Control', 'public, max-age=0, must-revalidate');
  } else {
    headers.set('Cache-Control', 'private, no-store');
    headers.set('Netlify-CDN-Cache-Control', 'private, no-store');
  }

  return headers;
}
