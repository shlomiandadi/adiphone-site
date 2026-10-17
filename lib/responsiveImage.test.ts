import assert from 'node:assert/strict';
import test from 'node:test';
import {
  cloudinaryUrl,
  isOptimizableImageUrl,
  isSeoAgentImage,
  optimizeContentImages,
  optimizedImageUrl,
  responsiveAttributes,
  seoAgentImageUrl,
  unsplashUrl,
} from './responsiveImage.ts';

const ORIGINAL =
  'https://res.cloudinary.com/dooxg35gj/image/upload/v1753362055/portfolio/child-disability.jpg';

test('cloudinary originals get f_auto, q_auto, c_limit and the requested width', () => {
  const url = cloudinaryUrl(ORIGINAL, 828);
  assert.equal(
    url,
    'https://res.cloudinary.com/dooxg35gj/image/upload/f_auto/q_auto/c_limit/w_828/v1753362055/portfolio/child-disability.jpg'
  );
  assert.equal(url.includes(','), false);
});

test('existing cloudinary transforms are replaced once and stay idempotent', () => {
  const already =
    'https://res.cloudinary.com/dooxg35gj/image/upload/c_fill,w_2000/f_auto/v1753362055/portfolio/file.jpg';
  const once = cloudinaryUrl(already, 480);
  assert.equal(
    once,
    'https://res.cloudinary.com/dooxg35gj/image/upload/f_auto/q_auto/c_limit/w_480/v1753362055/portfolio/file.jpg'
  );
  assert.equal(cloudinaryUrl(once, 480), once);
});

test('unsplash urls set w, auto=format, q and fit=max without dropping the photo id', () => {
  const url = unsplashUrl('https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1600', 828, 75);
  const parsed = new URL(url);
  assert.equal(parsed.searchParams.get('w'), '828');
  assert.equal(parsed.searchParams.get('auto'), 'format');
  assert.equal(parsed.searchParams.get('q'), '75');
  assert.equal(parsed.searchParams.get('fit'), 'max');
  assert.match(parsed.pathname, /photo-1460925895917-afdab827c52f/);
});

test('local files, svg and gif are not rewritten', () => {
  assert.equal(isOptimizableImageUrl('/images/logo.svg'), false);
  assert.equal(optimizedImageUrl('/images/og-default.png', 640), '/images/og-default.png');
  assert.equal(
    optimizedImageUrl('https://res.cloudinary.com/dooxg35gj/image/upload/v1/anim.gif', 400),
    'https://res.cloudinary.com/dooxg35gj/image/upload/v1/anim.gif'
  );
});

test('crop option is a srcset-safe center 16:9 fill and does not change the default transform', () => {
  const cropped = cloudinaryUrl(ORIGINAL, 480, { ar: '16:9' });
  assert.equal(cropped.includes(','), false);
  assert.equal(
    cropped,
    'https://res.cloudinary.com/dooxg35gj/image/upload/f_auto/q_auto/c_fill%2Car_16%3A9%2Cg_center/w_480/v1753362055/portfolio/child-disability.jpg'
  );
  assert.equal(cloudinaryUrl(cropped, 480, { ar: '16:9' }), cropped);
  assert.match(cloudinaryUrl(cropped, 320), /c_limit\/w_320/);

  const thumbs = responsiveAttributes(ORIGINAL, {
    sizes: '(max-width: 768px) 50vw, 280px',
    widths: [320, 480],
    crop: { ar: '16:9' },
    fetchPriority: 'low',
  });
  assert.equal(thumbs.loading, 'lazy');
  assert.equal(thumbs.fetchPriority, 'low');
  const candidates = (thumbs.srcSet || '').split(', ');
  assert.equal(candidates.length, 2);
  assert.equal(candidates.every((candidate) => !candidate.slice(0, candidate.lastIndexOf(' ')).includes(',')), true);
  assert.match(candidates[0], /c_fill%2Car_16%3A9%2Cg_center\/w_320/);
  assert.match(candidates[1], / 480w$/);
});

test('coverIfTallerThan crops only sources taller than the hero box and stays srcset-safe', () => {
  const url = cloudinaryUrl(ORIGINAL, 720, undefined, '4:5');
  assert.equal(url.includes(','), false);
  assert.equal(
    url,
    'https://res.cloudinary.com/dooxg35gj/image/upload/f_auto/q_auto/if_ar_lt_4%3A5/c_fill%2Car_4%3A5%2Cg_center/if_end/c_limit/w_720/v1753362055/portfolio/child-disability.jpg'
  );
  assert.equal(cloudinaryUrl(url, 720, undefined, '4:5'), url);
  assert.match(cloudinaryUrl(url, 480), /c_limit\/w_480/);
  assert.equal(cloudinaryUrl(url, 480).includes('if_ar'), false);

  const hero = responsiveAttributes(ORIGINAL, {
    sizes: '(max-width: 896px) calc(100vw - 2rem), 864px',
    widths: [640, 720],
    priority: true,
    coverIfTallerThan: '4:5',
  });
  assert.equal(hero.loading, 'eager');
  assert.equal(hero.fetchPriority, 'high');
  const candidates = (hero.srcSet || '').split(', ');
  assert.equal(candidates.length, 2);
  assert.equal(candidates.every((candidate) => !candidate.slice(0, candidate.lastIndexOf(' ')).includes(',')), true);
  assert.match(candidates[0], /if_ar_lt_4%3A5\/c_fill%2Car_4%3A5%2Cg_center\/if_end\/c_limit\/w_640/);
});

test('priority images are eager and high priority; other images are lazy with a srcset', () => {
  const lcp = responsiveAttributes(ORIGINAL, {
    sizes: '(max-width: 896px) 100vw, 896px',
    widths: [480, 828, 1200],
    priority: true,
  });
  assert.equal(lcp.loading, 'eager');
  assert.equal(lcp.fetchPriority, 'high');
  assert.match(lcp.src, /w_828/);
  assert.match(lcp.srcSet || '', /480w/);
  assert.match(lcp.srcSet || '', /1200w/);

  const rest = responsiveAttributes(ORIGINAL, {
    sizes: '360px',
    widths: [360, 720],
  });
  assert.equal(rest.loading, 'lazy');
  assert.equal(rest.fetchPriority, undefined);
});

test('cms html images are resized and lazy, and non-photo images are left alone', () => {
  const html = [
    '<p>Hi</p>',
    `<img src="${ORIGINAL}" alt="cover" class="prose-img" />`,
    '<img src="/images/logo.svg" alt="logo">',
  ].join('');
  const next = optimizeContentImages(html);
  assert.match(next, /src="[^"]*w_768[^"]*"/);
  assert.match(next, /srcset="[^"]*480w/);
  assert.match(next, /loading="lazy"/);
  assert.match(next, /fetchpriority="low"/);
  assert.match(next, /alt="cover"/);
  assert.match(next, /class="prose-img"/);
  assert.match(next, /src="\/images\/logo\.svg"/);
  assert.equal(next.includes(ORIGINAL), false);
});

test('seo-agent image urls resize through the netlify image cdn with an explicit format', () => {
  const src = 'https://seo-agent-tools.netlify.app/api/images/hero.webp?v=1';
  assert.equal(isSeoAgentImage(src), true);
  assert.equal(isOptimizableImageUrl(src), true);
  assert.equal(isSeoAgentImage('https://seo-agent-tools.netlify.app/logo.png'), false);
  assert.equal(
    seoAgentImageUrl(src, 828, 'avif', 50),
    'https://seo-agent-tools.netlify.app/.netlify/images?url=%2Fapi%2Fimages%2Fhero.webp%3Fv%3D1&w=828&fm=avif&q=50'
  );
  assert.equal(
    seoAgentImageUrl(src, 1200, 'webp', 75),
    'https://seo-agent-tools.netlify.app/.netlify/images?url=%2Fapi%2Fimages%2Fhero.webp%3Fv%3D1&w=1200&fm=webp&q=75'
  );

  const hero = responsiveAttributes(src, {
    sizes: '100vw',
    widths: [640, 828, 1080, 1200],
    priority: true,
    quality: 50,
    format: 'avif',
  });
  assert.equal(hero.loading, 'eager');
  assert.equal(hero.fetchPriority, 'high');
  assert.match(hero.src, /fm=avif/);
  assert.match(hero.src, /q=50/);
  assert.match(hero.src, /w=828/);
  const candidates = (hero.srcSet || '').split(', ');
  assert.deepEqual(
    candidates.map((candidate) => candidate.slice(candidate.lastIndexOf(' ') + 1)),
    ['640w', '828w', '1080w', '1200w']
  );
  assert.equal(
    candidates.every((candidate) => !candidate.slice(0, candidate.lastIndexOf(' ')).includes(',')),
    true
  );
  assert.match(candidates[0], /fm=avif/);
  assert.equal(hero.srcSet?.includes('1600w'), false);

  const unsplash = optimizedImageUrl(
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1600',
    640,
    75,
    undefined,
    undefined,
    'avif'
  );
  assert.equal(unsplash.includes('netlify'), false);
  assert.match(unsplash, /images\.unsplash\.com/);
});

test('hosts we still cannot resize stay on the same url and do not compete with the hero', () => {
  const src = 'https://image.pollinations.ai/prompt/a-website';
  const html = `<img src="${src}" alt="section" width="800" height="450" loading="lazy" title="keep" />`;
  const next = optimizeContentImages(html);
  assert.match(next, /src="https:\/\/image\.pollinations\.ai\/prompt\/a-website"/);
  assert.match(next, /loading="lazy"/);
  assert.match(next, /fetchpriority="low"/);
  assert.equal((next.match(/loading=/g) || []).length, 1);
});

test('seo-agent content images get a real webp srcset and stay below the hero', () => {
  const src = 'https://seo-agent-tools.netlify.app/api/images/hero.webp?v=1';
  const html = `<img src="${src}" alt="section" width="800" height="450" loading="lazy" title="keep" />`;
  const next = optimizeContentImages(html);
  assert.match(next, /fm=webp/);
  assert.match(next, /q=75/);
  assert.match(next, /srcset="[^"]*480w/);
  assert.match(next, /alt="section"/);
  assert.match(next, /width="800"/);
  assert.match(next, /height="450"/);
  assert.match(next, /loading="lazy"/);
  assert.match(next, /fetchpriority="low"/);
  assert.match(next, /decoding="async"/);
  assert.match(next, /title="keep"/);
  assert.equal(next.includes(src), false);
  assert.equal((next.match(/loading=/g) || []).length, 1);
});
