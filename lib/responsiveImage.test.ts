import assert from 'node:assert/strict';
import test from 'node:test';
import {
  cloudinaryUrl,
  isOptimizableImageUrl,
  optimizeContentImages,
  optimizedImageUrl,
  responsiveAttributes,
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
  assert.match(next, /alt="cover"/);
  assert.match(next, /class="prose-img"/);
  assert.match(next, /src="\/images\/logo\.svg"/);
  assert.equal(next.includes(ORIGINAL), false);
});
