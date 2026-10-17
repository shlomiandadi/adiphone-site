/**
 * Responsive delivery for Cloudinary, Unsplash, and seo-agent-tools originals.
 * Layout stays put: c_limit / fit=max / Netlify `w` keep the aspect ratio and do not crop.
 * Cloudinary transforms are slash-separated so f_auto applies and srcset
 * (which splits on raw commas) stays valid.
 */

export const SEO_AGENT_IMAGE_ORIGIN = 'https://seo-agent-tools.netlify.app';
const SEO_AGENT_IMAGE_PREFIX = `${SEO_AGENT_IMAGE_ORIGIN}/api/images/`;

const CLOUDINARY_MARKER = '/upload/';
const TRANSFORM_PARAM =
  /^(?:c|w|h|f|q|g|e|b|r|a|o|x|y|z|t|l|u|p|d|if|fl|ar|bo|dpr|so|eo|pg|vc|ac|af|dn|dl|sp|vs)_/i;

/** Center crop that matches `object-cover` + `object-position: center` for one aspect ratio. */
export type ImageCrop = {
  ar: string;
  gravity?: string;
};

export type ResponsiveImageOptions = {
  widths?: number[];
  sizes: string;
  priority?: boolean;
  quality?: number;
  crop?: ImageCrop;
  /**
   * For a fixed-height object-cover box: if the source is taller than this
   * aspect, crop to that center band. Wider sources stay on c_limit, unchanged.
   * The band is the object-cover window of the narrowest viewport we still
   * match, so every wider viewport shows the same pixels as the full image.
   */
  coverIfTallerThan?: string;
  /** Set on gallery thumbs so an in-view lazy image does not compete with the hero. */
  fetchPriority?: 'high' | 'low' | 'auto';
  /**
   * seo-agent-tools Netlify Image CDN only. `fm` has to be explicit — without it
   * the CDN returns WebP. Cloudinary and Unsplash keep negotiating format themselves.
   */
  format?: 'avif' | 'webp';
};

export type ResponsiveImageAttrs = {
  src: string;
  srcSet?: string;
  sizes?: string;
  loading: 'eager' | 'lazy';
  fetchPriority?: 'high' | 'low' | 'auto';
  decoding: 'async' | 'auto';
};

const CONTENT_WIDTHS = [480, 768, 1080, 1440];

function isSvgOrGif(src: string) {
  const path = src.split(/[?#]/)[0] || '';
  return /\.(?:svg|gif)$/i.test(path);
}

export function isCloudinaryUpload(src: string) {
  return src.includes('://res.cloudinary.com/') && src.includes(CLOUDINARY_MARKER);
}

export function isUnsplashImage(src: string) {
  try {
    const host = new URL(src).hostname;
    return host === 'images.unsplash.com' || host === 'plus.unsplash.com';
  } catch {
    return false;
  }
}

export function isSeoAgentImage(src: string) {
  return typeof src === 'string' && src.startsWith(SEO_AGENT_IMAGE_PREFIX);
}

export function isOptimizableImageUrl(src: string) {
  if (!src || isSvgOrGif(src)) return false;
  return isCloudinaryUpload(src) || isUnsplashImage(src) || isSeoAgentImage(src);
}

function isTransformSegment(segment: string) {
  const path = segment.split('?')[0];
  if (!path || path.includes('.')) return false;
  if (/^v\d+$/.test(path)) return false;
  return path.split(',').every((part) => TRANSFORM_PARAM.test(part));
}

function cloudinaryCropSegment(crop: ImageCrop) {
  // Commas and colons are percent-encoded. srcset splits candidates on raw commas,
  // and Cloudinary requires c_fill + ar + g in one component.
  const gravity = crop.gravity || 'center';
  return `c_fill,ar_${crop.ar},g_${gravity}`.replace(/,/g, '%2C').replace(/:/g, '%3A');
}

function cloudinaryCoverIfTallerSegment(ar: string) {
  const encodedAr = ar.replace(/:/g, '%3A');
  return `if_ar_lt_${encodedAr}/${cloudinaryCropSegment({ ar })}/if_end`;
}

export function cloudinaryUrl(src: string, width: number, crop?: ImageCrop, coverIfTallerThan?: string) {
  const index = src.indexOf(CLOUDINARY_MARKER);
  if (index === -1) return src;
  const prefix = src.slice(0, index + CLOUDINARY_MARKER.length);
  const rest = src.slice(index + CLOUDINARY_MARKER.length);
  const hashIndex = rest.indexOf('#');
  const beforeHash = hashIndex === -1 ? rest : rest.slice(0, hashIndex);
  const hash = hashIndex === -1 ? '' : rest.slice(hashIndex);
  const queryIndex = beforeHash.indexOf('?');
  const pathOnly = queryIndex === -1 ? beforeHash : beforeHash.slice(0, queryIndex);
  const query = queryIndex === -1 ? '' : beforeHash.slice(queryIndex);
  const segments = pathOnly.split('/').filter((segment, i) => segment.length > 0 || i === 0);
  while (segments.length > 1 && isTransformSegment(segments[0])) {
    segments.shift();
  }
  const safeWidth = Math.max(16, Math.round(width));
  // Slash-separated so f_auto still negotiates WebP/AVIF. A raw comma in the URL
  // would also break srcset, which splits candidates on raw commas.
  const transform = crop?.ar
    ? `f_auto/q_auto/${cloudinaryCropSegment(crop)}/w_${safeWidth}`
    : coverIfTallerThan
      ? `f_auto/q_auto/${cloudinaryCoverIfTallerSegment(coverIfTallerThan)}/c_limit/w_${safeWidth}`
      : `f_auto/q_auto/c_limit/w_${safeWidth}`;
  return `${prefix}${transform}/${segments.join('/')}${query}${hash}`;
}

export function unsplashUrl(src: string, width: number, quality = 75) {
  const url = new URL(src);
  url.searchParams.set('auto', 'format');
  if (!url.searchParams.has('q')) url.searchParams.set('q', String(quality || 75));
  url.searchParams.set('w', String(Math.max(16, Math.round(width))));
  if (!url.searchParams.has('fit')) url.searchParams.set('fit', 'max');
  return url.toString();
}

/**
 * Netlify Image CDN on seo-agent-tools. `url` is the pathname + search of the
 * original (width is ignored there). `fm` is required; omitting it returns WebP.
 * `w` only resizes, so the crop stays the one `object-cover` already applies.
 */
export function seoAgentImageUrl(
  src: string,
  width: number,
  format: 'avif' | 'webp' = 'webp',
  quality = 75,
) {
  let parsed: URL;
  try {
    parsed = new URL(src);
  } catch {
    return src;
  }
  const cdn = new URL('/.netlify/images', SEO_AGENT_IMAGE_ORIGIN);
  cdn.searchParams.set('url', `${parsed.pathname}${parsed.search}`);
  cdn.searchParams.set('w', String(Math.max(16, Math.round(width))));
  cdn.searchParams.set('fm', format);
  cdn.searchParams.set('q', String(quality || 75));
  return cdn.toString();
}

export function optimizedImageUrl(
  src: string,
  width: number,
  quality = 75,
  crop?: ImageCrop,
  coverIfTallerThan?: string,
  format?: 'avif' | 'webp',
) {
  if (!isOptimizableImageUrl(src)) return src;
  if (isCloudinaryUpload(src)) return cloudinaryUrl(src, width, crop, coverIfTallerThan);
  if (isUnsplashImage(src)) return unsplashUrl(src, width, quality);
  if (isSeoAgentImage(src)) return seoAgentImageUrl(src, width, format || 'webp', quality);
  return src;
}

export function responsiveAttributes(src: string, options: ResponsiveImageOptions): ResponsiveImageAttrs {
  const priority = Boolean(options.priority);
  const widths = (options.widths && options.widths.length > 0 ? options.widths : [480, 768, 1080, 1600])
    .map((width) => Math.round(width))
    .filter((width) => width > 0)
    .sort((a, b) => a - b);
  const loading = priority ? 'eager' : 'lazy';
  const decoding = priority ? 'auto' : 'async';
  const fetchPriority = options.fetchPriority ?? (priority ? 'high' : undefined);
  const urlFor = (width: number) =>
    optimizedImageUrl(src, width, options.quality, options.crop, options.coverIfTallerThan, options.format);
  if (!isOptimizableImageUrl(src) || widths.length === 0) {
    return {
      src,
      loading,
      fetchPriority,
      decoding,
    };
  }
  const fallback = priority
    ? widths.find((width) => width >= 828) || widths[widths.length - 1]
    : widths[Math.min(1, widths.length - 1)];
  return {
    src: urlFor(fallback),
    srcSet: widths.map((width) => `${urlFor(width)} ${width}w`).join(', '),
    sizes: options.sizes,
    loading,
    fetchPriority,
    decoding,
  };
}

function readAttr(attrs: string, name: string) {
  const match = attrs.match(new RegExp(`(?:^|\\s)${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, 'i'));
  if (!match) return '';
  return match[1] ?? match[2] ?? match[3] ?? '';
}

function stripAttr(attrs: string, name: string) {
  return attrs.replace(new RegExp(`(?:^|\\s)${name}\\s*=\\s*(?:"[^"]*"|'[^']*'|[^\\s>]+)`, 'ig'), '');
}

function escapeAttr(value: string) {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}

function withLowPriority(rawAttrs: string) {
  let attrs = rawAttrs;
  if (!readAttr(attrs, 'loading')) attrs += ' loading="lazy"';
  if (!readAttr(attrs, 'fetchpriority')) attrs += ' fetchpriority="low"';
  if (!readAttr(attrs, 'decoding')) attrs += ' decoding="async"';
  return attrs;
}

/** Rewrite <img> tags inside CMS HTML. Content images are below the hero, so they stay lazy. */
export function optimizeContentImages(html: string) {
  if (!html || !/<img\b/i.test(html)) return html;
  return html.replace(/<img\b([^>]*?)\/?>/gi, (full, rawAttrs: string) => {
    const src = readAttr(rawAttrs, 'src');
    if (!src) return full;
    // Hosts we cannot resize still must not compete with the hero.
    if (!isOptimizableImageUrl(src)) {
      const attrs = withLowPriority(rawAttrs);
      return `<img${attrs}>`;
    }
    let attrs = rawAttrs;
    for (const name of ['src', 'srcset', 'sizes', 'loading', 'fetchpriority', 'decoding']) {
      attrs = stripAttr(attrs, name);
    }
    const image = responsiveAttributes(src, {
      widths: CONTENT_WIDTHS,
      sizes: '(max-width: 768px) 100vw, 768px',
      priority: false,
    });
    const tail = attrs.trim() ? ` ${attrs.trim()}` : '';
    return `<img src="${escapeAttr(image.src)}" srcset="${escapeAttr(image.srcSet || '')}" sizes="${escapeAttr(image.sizes || '')}" loading="lazy" fetchpriority="low" decoding="async"${tail}>`;
  });
}
